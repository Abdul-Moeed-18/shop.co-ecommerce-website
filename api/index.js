// Vercel auto-detects any file under /api as a serverless function.
// This one just re-exports our existing Express app, so every /api/*
// request (routed here via the rewrite in vercel.json) is handled by
// the exact same routes/middleware as local dev.
const app = require("../server/server.js");
module.exports = app;
