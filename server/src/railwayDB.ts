// knexDB.ts
import 'dotenv/config';
import Knex from 'knex';
import type { Knex as KnexType } from 'knex';

import {
    ClanPlayer,
    ClanWar,
    ClanWarAttack,
    ClanCapitalRaid,
    PlayerPastWarResult,
    PlayerWarAttackSummary
} from './interfaces';

// Check if DATABASE_URL is set
if (!process.env.RAILWAY_DB_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
}

// Initialize Knex with types
const knexInstance: KnexType = Knex({ 
    client: 'pg',
    pool: { min: 2, max: 10 },
    connection: {
      connectionString: process.env.RAILWAY_DB_URL,
      ssl: { rejectUnauthorized: false }
    }
});

// Test connection
knexInstance.raw('SELECT NOW()')
    .then(result => console.log('Successfully connected to Railway PostgreSQL via Knex at:', result.rows[0].now))
    .catch(err => console.error('Error connecting to Railway PostgreSQL via Knex:', err));

export async function selectClanPlayers(): Promise<ClanPlayer[] | undefined> {
    try {
        const data = await knexInstance<ClanPlayer>('clash_clan_players').select('*');
        return data;
    } catch (error: any) {
        console.error('Error selecting clan players using Knex:', error.message);
        return undefined; 
    }
}

export async function selectSingleClanPlayer(player_tag: string): Promise<ClanPlayer | undefined> {
    try {
        const data = await knexInstance<ClanPlayer>('clash_clan_players')
            .where('player_tag', player_tag)
            .first(); 
        return data;
    } catch (error: any) {
        console.error('Error selecting single clan player using Knex:', error.message);
        return undefined;
    }
}

export async function selectClanPlayerIDs(): Promise<string[]> {
    try {
        const data = await knexInstance<{ player_tag: string }>('clash_clan_players')
            .select('player_tag');
        return data.map((player) => player.player_tag);
    } catch (error: any) {
        console.error("Error selecting player IDs using Knex:", error.message);
        return []; 
    }
}

export async function selectClanWarId(opponentClanTag: string): Promise<number | null> {
    try {
        const data = await knexInstance<{ war_id: number }>('clash_clan_wars')
            .where('opponent_clan_tag', opponentClanTag)
            .select('war_id')
            .first();
        return data?.war_id ?? null; 
    } catch (error: any) {
        console.error('Error selecting clan war ID using Knex:', error.message);
        return null;
    }
}

export async function selectClanCapitalRaidID(startTime: string): Promise<number | null> {
    try {
        const data = await knexInstance<{ raid_id: number }>('clash_clan_capital_raids')
            .where('start_time', startTime)
            .select('raid_id')
            .first();
        return data?.raid_id ?? null;
    } catch (error: any) {
        console.error('Error selecting clan capital raid ID using Knex:', error.message);
        return null;
    }
}


export async function selectClanPlayerAttacks(playerTag: string): Promise<ClanWarAttack[]> {
    try {
        const data = await knexInstance<ClanWarAttack>('clash_clan_war_attacks')
            .where('attacker_tag', playerTag)
            .select('*'); 
        return data ?? []; 
    } catch (error: any) {
        console.error('Error selecting clan player attacks using Knex:', error.message);
        return []; 
    }
}

export async function selectNewestClanWarsIDs(numOfPastWars: number): Promise<{ war_id: number }[] | null> {
    try {
        const data = await knexInstance<{ war_id: number }>('clash_clan_wars')
            .select('war_id')
            .orderBy('created_at', 'desc')
            .limit(numOfPastWars);
        return data;
    } catch (error: any) {
        console.error('Error selecting newest war IDs using Knex:', error.message);
        return null; 
    }
}

export async function selectPlayerWarIDs(warIDs: number[], playerTag: string): Promise<number[]> {
    if (!warIDs || warIDs.length === 0) {
        return []; 
    }
    try {
        const data = await knexInstance<{ war_id: number }>('clash_clan_war_attacks')
            .whereIn('war_id', warIDs)
            .where('attacker_tag', playerTag)
            .select('war_id');

        // data will be like [{ war_id: 1 }, { war_id: 1 }, { war_id: 3 }]
        return data.map(item => item.war_id);

    } catch (error: any) {
        console.error('Error fetching player war IDs using Knex:', error.message);
        return []; 
    }
}

// Type for intermediate attack fetch result
type RawPlayerAttack = Pick<ClanWarAttack, 'war_id' | 'stars' | 'destruction_percentage'>;

export async function selectPlayerPastFiveWars(warIDs: number[], playerTag: string): Promise<PlayerPastWarResult[]> {
     if (!warIDs || warIDs.length === 0) {
        return []; 
    }
    try {
        // Fetch up to 10 *attacks* from the specified wars, ordered by war recency (assuming higher war_id is newer)
        const attacksData = await knexInstance<RawPlayerAttack>('clash_clan_war_attacks')
            .whereIn('war_id', warIDs)
            .where('attacker_tag', playerTag)
            .select('war_id', 'stars', 'destruction_percentage')
            .orderBy('war_id', 'desc') 
            .limit(10); 

        if (!attacksData || attacksData.length === 0) {
            return [];
        }

        // Group attacks by war_id using a Map
        const warMap = new Map<number, PlayerWarAttackSummary[]>();

        for (const attack of attacksData) {
            if (!warMap.has(attack.war_id)) {
                warMap.set(attack.war_id, []);
            }
            // Push only the relevant attack details
            warMap.get(attack.war_id)!.push({
                war_id: attack.war_id, 
                stars: attack.stars,
                destruction_percentage: attack.destruction_percentage
            });
        }

        // Convert Map entries to an array, sort by war_id descending (already done by query), take top 5 unique wars
        const sortedWarEntries = Array.from(warMap.entries());

        const result: PlayerPastWarResult[] = sortedWarEntries
            .slice(0, 5) // Take the 5 most recent unique wars based on the fetched attacks
            .map(([war_id, attacks]) => ({ war_id, attacks }));

        return result;

    } catch (error: any) {
        console.error('Error fetching player past five wars using Knex:', error.message);
        return []; 
    }
}


// close the Knex pool
export async function destroyKnexConnection(): Promise<void> {
    console.log('Closing Knex database connection pool...');
    try {
        await knexInstance.destroy();
        console.log('Knex database pool destroyed.');
    } catch (error: any) {
        console.error('Error destroying Knex pool:', error.message);
    }
}
