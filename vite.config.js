import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import express from 'express';
// Create an instance of Express
const app = express();
// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  next();
});
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    configureServer: ({ middleware }) => {
      middleware.use(app);
    }
  }
});
