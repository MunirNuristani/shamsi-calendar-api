// api/index.js
// Vercel serverless function entry point

const path = require('path');

// Try to load the compiled app
let app;
try {
  // In production (Vercel), load from dist
  app = require(path.join(__dirname, '../dist/app')).default;

  if (!app) {
    throw new Error('App export is undefined');
  }
} catch (error) {
  console.error('Failed to load app:', error);

  // Fallback: create minimal error response
  const express = require('express');
  app = express();
  app.use((req, res) => {
    res.status(500).json({
      success: false,
      error: 'Failed to load application',
      message: error.message,
      dist_path: path.join(__dirname, '../dist/app'),
      cwd: process.cwd(),
      dirname: __dirname
    });
  });
}

module.exports = app;
