import dotenv from "dotenv";
dotenv.config();

/*
==================================
DEBUG: ENV CHECK
==================================
*/

console.log("==================================");
console.log("🔍 ENV DEBUG START");

console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "LOADED ✅" : "MISSING ❌");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED ✅" : "MISSING ❌");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

console.log("JWT_SECRET:", process.env.JWT_SECRET ? "LOADED ✅" : "MISSING ❌");

console.log("🔍 ENV DEBUG END");
console.log("==================================");

/*
==================================
IMPORTS
==================================
*/

import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import requisitionRoutes from "./routes/requisitionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import accountsRoutes from "./routes/accountsRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import assetHistoryRoutes from "./routes/assetHistoryRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import assetConditionRequestRoutes from "./routes/assetConditionRequestRoutes.js";


import { initSocket } from "./sockets/socket.js";

/*
==================================
DATABASE CONNECTION
==================================
*/

connectDB();

/*
==================================
APP INIT
==================================
*/

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/*
==================================
API ROUTES
==================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/requisitions", requisitionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/asset-history", assetHistoryRoutes);
app.use("/api/assets", assetRoutes);
app.use( "/api/asset-condition-requests",assetConditionRequestRoutes);
/*
==================================
TEST ROUTE
==================================
*/

app.get("/", (req, res) => {
  res.json({
    message: "Inventory Management API Running..."
  });
});

/*
==================================
GLOBAL ERROR HANDLER
==================================
*/

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message
  });
});

/*
==================================
HTTP SERVER (SOCKET SUPPORT)
==================================
*/

// STEP 2 FIX APPLIED CLEANLY
const server = http.createServer(app);
const io = initSocket(server);
app.set("io", io);

/*
==================================
START SERVER
==================================
*/

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});