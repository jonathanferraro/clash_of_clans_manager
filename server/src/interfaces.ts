// interfaces.ts (or place them in your knexDB.ts)

export interface ClanPlayer {
    player_tag: string;
    name: string;
    role: string;
    trophies: number;
    donations: number;
    donations_received: number;
    level: number;
    town_hall: number;
    active: boolean;
    wars_participated_in: number;
    wars_missed_attacks: number;
    capital_raids_participated_in: number;
    created_at: string;
}

export interface ClanWar {
    war_id: number;
    opponent_clan_tag: string;
    opponent_clan_name: string;
    team_size: number;
    created_at: string; 
}

export interface ClanWarAttack {
    attack_id: number; 
    war_id: number;
    attacker_tag: string;
    stars: number;
    destruction_percentage: number;
    attack_number: number;
}

export interface ClanCapitalRaid {
    raid_id: number;
    start_time: string;
    capital_total_loot: number;
    raids_completed: number;
    total_attacks: number;
    enemy_districts_destroyed: number;
}

// Specific structure for selectPlayerPastFiveWars result
export interface PlayerWarAttackSummary {
  war_id: number;
  stars: number;
  destruction_percentage: number;
}

export interface PlayerPastWarResult {
  war_id: number;
  attacks: PlayerWarAttackSummary[];
}