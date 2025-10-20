import express from "express";
import { registerRoutes } from "../server/routes";
import { initializeDatabase } from "../server/init-db";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS for Vercel - Allow requests from any origin
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Initialize database and routes on first request (serverless)
let initPromise: Promise<void> | null = null;

const ensureInit = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        console.log('🔧 Initializing database for Vercel...');
        await initializeDatabase();
        console.log('✅ Database initialized');
        
        console.log('📋 Registering routes...');
        await registerRoutes(app);
        console.log('✅ Routes registered');
      } catch (err) {
        console.error('❌ Initialization failed:', err);
        initPromise = null;
        throw err;
      }
    })();
  }
  return initPromise;
};

// Middleware to ensure initialization before handling requests
app.use(async (req, res, next) => {
  try {
    await ensureInit();
    next();
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default app;
