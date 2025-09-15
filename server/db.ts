import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket with proper certificate handling
class WebSocketWithCertConfig extends ws {
  constructor(address: any, protocols?: any, options?: any) {
    const wsOptions = {
      ...options,
      // Environment-specific certificate validation
      rejectUnauthorized: process.env.NODE_ENV === 'production',
      // Enable TLS 1.3 for production
      secureProtocol: process.env.NODE_ENV === 'production' ? 'TLSv1_3_method' : undefined,
      // Disable certificate validation only in development
      checkServerIdentity: process.env.NODE_ENV === 'production' ? undefined : () => undefined,
    };
    super(address, protocols, wsOptions);
  }
}

neonConfig.webSocketConstructor = WebSocketWithCertConfig;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });