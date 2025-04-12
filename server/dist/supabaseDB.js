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
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectClanPlayers = selectClanPlayers;
exports.selectSingleClanPlayer = selectSingleClanPlayer;
exports.selectClanPlayerIDs = selectClanPlayerIDs;
exports.selectClanWarId = selectClanWarId;
exports.selectClanCapitalRaidID = selectClanCapitalRaidID;
exports.selectClanPlayerAttacks = selectClanPlayerAttacks;
exports.selectNewestClanWarsIDs = selectNewestClanWarsIDs;
exports.selectPlayerWarIDs = selectPlayerWarIDs;
exports.selectPlayerPastFiveWars = selectPlayerPastFiveWars;
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function selectClanPlayers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_players')
                .select('*');
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error selecting clan players from Supabase:', error.message);
            return undefined;
        }
    });
}
function selectSingleClanPlayer(player_tag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_players')
                .select('*')
                .eq('player_tag', player_tag)
                .single();
            if (error)
                throw error;
            if (!data || data.length === 0) {
                return undefined;
            }
            return data;
        }
        catch (error) {
            console.error('Error selecting single clan player from Supabase:', error.message);
            return undefined;
        }
    });
}
function selectClanPlayerIDs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase.from("clash_clan_players").select("player_tag");
            if (error)
                throw error;
            return data.map((player) => player.player_tag);
        }
        catch (error) {
            console.error("Error selecting player IDs players:", error.message);
            return [];
        }
    });
}
function selectClanWarId(opponentClanTag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_wars')
                .select('war_id')
                .eq('opponent_clan_tag', opponentClanTag)
                .single();
            if (error)
                throw error;
            return data === null || data === void 0 ? void 0 : data.war_id;
        }
        catch (error) {
            console.error('Error selecting clan war ID to Supabase:', error.message);
            return null;
        }
    });
}
function selectClanCapitalRaidID(startTime) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_capital_raids')
                .select('raid_id')
                .eq('start_time', startTime)
                .single();
            if (error)
                throw error;
            return data === null || data === void 0 ? void 0 : data.raid_id;
        }
        catch (error) {
            console.error('Error selecting clan capital raid ID from Supabase:', error.message);
            return null;
        }
    });
}
function selectClanPlayerAttacks(playerTag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_capital_raids')
                .select('raid_id')
                .eq('', playerTag)
                .single();
            if (error)
                throw error;
            return data === null || data === void 0 ? void 0 : data.raid_id;
        }
        catch (error) {
            console.error('Error selecting clan capital raid ID from Supabase:', error.message);
            return null;
        }
    });
}
function selectNewestClanWarsIDs(numOfPastWars) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_wars')
                .select('war_id')
                .order('created_at', { ascending: false })
                .limit(numOfPastWars);
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error selecting war IDs from Supabase:', error.message);
            return null;
        }
    });
}
function selectPlayerWarIDs(warIDs, playerTag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_war_attacks')
                .select('war_id')
                .in('war_id', warIDs)
                .eq('attacker_tag', playerTag);
            if (error)
                throw error;
            return data ? data.map(item => item.war_id) : [];
        }
        catch (error) {
            console.error('Error fetching player war IDs from Supabase:', error.message);
            return [];
        }
    });
}
function selectPlayerPastFiveWars(warIDs, playerTag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('clash_clan_war_attacks')
                .select('war_id, stars, destruction_percentage')
                .in('war_id', warIDs)
                .eq('attacker_tag', playerTag)
                .order('war_id', { ascending: false })
                .limit(10);
            if (error)
                throw error;
            // Convert attacks into a war-based map and return 5 unique wars
            const warMap = new Map();
            for (const attack of data || []) {
                if (!warMap.has(attack.war_id))
                    warMap.set(attack.war_id, []);
                warMap.get(attack.war_id).push(attack);
            }
            const result = Array.from(warMap.entries())
                .slice(0, 5)
                .map(([war_id, attacks]) => ({ war_id, attacks }));
            return result;
        }
        catch (error) {
            console.error('Error fetching player war attacks from Supabase:', error.message);
            return [];
        }
    });
}
