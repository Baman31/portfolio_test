interface Stat {
  value: string;
  label: string;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: number;
}

export default function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid gap-8 max-w-4xl mx-auto ${gridCols[columns as keyof typeof gridCols] || gridCols[4]}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
          <div className="text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
