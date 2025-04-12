import express, { Router, Request, Response } from 'express';
import { selectClanPlayers, selectNewestClanWarsIDs, selectPlayerPastFiveWars, selectPlayerWarIDs } from "./supabaseDB";
const router: Router = express.Router();

router.get("/players", async (req, res) => {
    try {
        const data = await selectClanPlayers();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clan players" });
    }
});

router.get("/playerLastTenWars/:playerTag", async (req: Request, res: Response) => { 
    try {
        const playerTag = req.params.playerTag;
        if (!playerTag) {
            return res.status(400).json({ error: "Player tag is required" });
        }

        // Fetch the last 10 clan wars
        let warIDs = await selectNewestClanWarsIDs(10);
        if (!warIDs || warIDs.length === 0) {
            return res.status(404).json({ error: "No clan wars found" });
        }

        const warIDNumbers = warIDs.map(w => w.war_id); // Extract war_ids

        // Fetch the wars the player participated in
        const playerWarIDs = await selectPlayerWarIDs(warIDNumbers, playerTag); // playerWarIDs is number[]
        if (!playerWarIDs || playerWarIDs.length === 0) {
            return res.status(404).json({ error: "Player has not participated in the queried wars" });
        }

        // Count how many wars the player participated in (no need for warIDCount object)
        const warIDSet = new Set(playerWarIDs);
        const count = warIDSet.size;

        res.status(200).json(count); // Return the count of unique wars

    } catch (error: any) {
        console.error('Error fetching player 10 wars:', error.message);
        res.status(500).json({ error: "Failed to fetch clan player 10 wars" });
    }
});

router.get("/playerLastFiveWars/:playerTag", async (req: Request, res: Response) => {
    try {
        const playerTag = req.params.playerTag;
        if (!playerTag) {
            return res.status(400).json({ error: "Player tag is required" });
        }

        let warIDs = await selectNewestClanWarsIDs(15);
        if (!warIDs || warIDs.length === 0) {
            return res.status(404).json({ error: "No clan wars found" });
        }

        const warIDNumbers = warIDs.map(w => w.war_id);
        let pastFiveWars = await selectPlayerPastFiveWars(warIDNumbers, playerTag);

        res.status(200).json(pastFiveWars);

    } catch (error: any) {
        console.error('Error fetching player 5 wars:', error.message);
        res.status(500).json({ error: "Failed to fetch clan player 5 wars" });
    }

})


export default router;