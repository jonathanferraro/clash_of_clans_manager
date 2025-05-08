import express, { Router, Request, Response } from 'express';

import {
    selectActiveClanPlayers,
    selectNewestClanWarsIDs,
    selectPlayerPastFiveWars,
    selectPlayerWarIDs,
} from './railwayDB';

import { ClanPlayer, PlayerPastWarResult } from './interfaces';

const router: Router = express.Router();

router.get("/players", async (req, res) => {
    try {
        const data = await selectActiveClanPlayers();

        if (data === undefined) {
            throw new Error("Failed to fetch clan players from DB");
       }

        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in /players route:", error.message)
        res.status(500).json({ error: "Failed to fetch clan players" });
    }
});

router.get("/playerLastTenWars/:playerTag", async (req: Request, res: Response) => { 
    try {
        const playerTag: string | undefined = req.params.playerTag;
        if (!playerTag) {
            return res.status(400).json({ error: "Player tag is required" });
        }

        // Fetch the last 10 clan wars
        let newestWars = await selectNewestClanWarsIDs(10);

        if (!newestWars) {
            return res.status(500).json({ error: "Failed to fetch recent clan wars" });
        }
        if (newestWars.length === 0) {
            return res.status(404).json({ error: "No clan wars found in the database" });
        }  

        const warIDNumbers: number[] = newestWars.map(w => w.war_id); // Extract war_ids

        // Fetch the wars the player participated in
        const playerWarIDs: number[] = await selectPlayerWarIDs(warIDNumbers, playerTag); // playerWarIDs is number[]
        if (!playerWarIDs || playerWarIDs.length === 0) {
            return res.status(404).json({ error: "Player has not participated in the queried wars" });
        }

        // Count how many wars the player participated in (no need for warIDCount object)
        const uniquePlayerWarIDs = new Set(playerWarIDs);
        const participationCount = uniquePlayerWarIDs.size;

        res.status(200).json(participationCount); // Return the count of unique wars

    } catch (error: any) {
        console.error('Error fetching player last 10 wars count:', error.message);
        res.status(500).json({ error: "Failed to fetch player war participation count" });
    }
});

router.get("/playerLastFiveWars/:playerTag", async (req: Request, res: Response) => {
    try {
        const playerTag: string | undefined = req.params.playerTag;
        if (!playerTag) {
            return res.status(400).json({ error: "Player tag is required" });
        }

        //  Fetch IDs of the last 15 clan wars overall
        const newestWars = await selectNewestClanWarsIDs(15); // Returns { war_id: number }[] | null

         if (!newestWars) {
             return res.status(500).json({ error: "Failed to fetch recent clan wars" });
        }
        if (newestWars.length === 0) {
            return res.status(404).json({ error: "No clan wars found in the database" });
        }

        const warIDNumbers: number[] = newestWars.map(w => w.war_id);

        const pastFiveWarsDetails = await selectPlayerPastFiveWars(warIDNumbers, playerTag);

        res.status(200).json(pastFiveWarsDetails);

    } catch (error: any) {
        console.error('Error fetching player last 5 wars details:', error.message);
        res.status(500).json({ error: "Failed to fetch player war details" });
    }

})


export default router;