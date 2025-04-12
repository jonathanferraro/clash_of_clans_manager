"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabaseDB_1 = require("./supabaseDB");
const router = express_1.default.Router();
router.get("/players", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, supabaseDB_1.selectClanPlayers)();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch clan players" });
    }
}));
router.get("/playerLastTenWars/:playerTag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playerTag = req.params.playerTag;
        if (!playerTag) {
            return res.status(400).json({ error: "Player tag is required" });
        }
        // Fetch the last 10 clan wars
        let warIDs = yield (0, supabaseDB_1.selectNewestClanWarsIDs)(10);
        if (!warIDs || warIDs.length === 0) {
            return res.status(404).json({ error: "No clan wars found" });
        }
        const warIDNumbers = warIDs.map(w => w.war_id); // Extract war_ids
        // Fetch the wars the player participated in
        const playerWarIDs = yield (0, supabaseDB_1.selectPlayerWarIDs)(warIDNumbers, playerTag); // playerWarIDs is number[]
        if (!playerWarIDs || playerWarIDs.length === 0) {
            return res.status(404).json({ error: "Player has not participated in the queried wars" });
        }
        // Count how many wars the player participated in (no need for warIDCount object)
        const warIDSet = new Set(playerWarIDs);
        const count = warIDSet.size;
        res.status(200).json(count); // Return the count of unique wars
    }
    catch (error) {
        console.error('Error fetching player 10 wars:', error.message);
        res.status(500).json({ error: "Failed to fetch clan player 10 wars" });
    }
}));
router.get("/playerLastFiveWars/:playerTag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playerTag = req.params.playerTag;
        if (!playerTag) {
            return res.status(400).json({ error: "Player tag is required" });
        }
        let warIDs = yield (0, supabaseDB_1.selectNewestClanWarsIDs)(15);
        if (!warIDs || warIDs.length === 0) {
            return res.status(404).json({ error: "No clan wars found" });
        }
        const warIDNumbers = warIDs.map(w => w.war_id);
        let pastFiveWars = yield (0, supabaseDB_1.selectPlayerPastFiveWars)(warIDNumbers, playerTag);
        res.status(200).json(pastFiveWars);
    }
    catch (error) {
        console.error('Error fetching player 5 wars:', error.message);
        res.status(500).json({ error: "Failed to fetch clan player 5 wars" });
    }
}));
exports.default = router;
