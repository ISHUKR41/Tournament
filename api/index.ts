import express from "express";
import { registerRoutes } from "../server/routes";
import { initializeDatabase } from "../server/init-db";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS for Vercel
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

// Initialize database (create tables and default admin) on first cold start
let initialized = false;
if (!initialized) {
  initializeDatabase().then(() => {
    initialized = true;
    console.log('✅ Database initialized for Vercel deployment');
  }).catch(err => {
    console.error('❌ Database initialization failed:', err);
  });
}

// Register all API routes
registerRoutes(app).catch(err => {
  console.error('Failed to register routes:', err);
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Export for Vercel
export default app;
