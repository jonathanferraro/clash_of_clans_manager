"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: false,
}));
app.use(express_1.default.json());
app.use("/api", routes_1.default);
// Sample API route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from backend!" });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
