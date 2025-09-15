import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bold, 
  Italic, 
  Underline,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Eye,
  Type
} from "lucide-react";

interface ContentEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function ContentEditor({ 
  value = "", 
  onChange, 
  placeholder = "Start writing your content..." 
}: ContentEditorProps) {
  const [content, setContent] = useState(value);
  const [activeTab, setActiveTab] = useState("write");

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  const insertFormatting = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    handleContentChange(newContent);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertFormatting("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertFormatting("*", "*") },
    { icon: Underline, label: "Underline", action: () => insertFormatting("<u>", "</u>") },
    { icon: Link, label: "Link", action: () => insertFormatting("[", "](url)") },
    { icon: List, label: "Bullet List", action: () => insertFormatting("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertFormatting("1. ") },
    { icon: Quote, label: "Quote", action: () => insertFormatting("> ") },
    { icon: Code, label: "Code", action: () => insertFormatting("`", "`") },
    { icon: Image, label: "Image", action: () => insertFormatting("![alt text](", ")") },
  ];

  const renderPreview = () => {
    if (!content) return <p className="text-muted-foreground">No content to preview</p>;
    
    // Simple markdown-like rendering for preview
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
      .replace(/^> (.+)/gm, '<blockquote class="border-l-4 border-primary pl-4 my-2">$1</blockquote>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/^1\. (.+)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br />');

    return <div 
      className="prose max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }} 
    />;
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border bg-muted/50">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2">
              {toolbarButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={button.action}
                    title={button.label}
                    data-testid={`toolbar-${button.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
            
            <TabsList className="ml-auto">
              <TabsTrigger value="write" className="flex items-center">
                <Type className="h-4 w-4 mr-1" />
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] border-0 focus-visible:ring-0 resize-none rounded-none"
            data-testid="content-textarea"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0 p-4 min-h-[400px] bg-background">
          {renderPreview()}
        </TabsContent>
      </Tabs>

      {/* Footer with character count and tips */}
      <div className="border-t border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{content.length} characters</span>
            <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Markdown supported
            </Badge>
            <Badge variant="outline" className="text-xs">
              HTML allowed
            </Badge>
          </div>
        </div>
        
        {activeTab === "write" && (
          <div className="mt-2 text-xs text-muted-foreground">
            <p>
              <strong>Formatting tips:</strong> Use **bold**, *italic*, `code`, 
              > quotes, - lists, [links](url), ![images](url)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
