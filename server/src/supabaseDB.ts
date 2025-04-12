import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function selectClanPlayers() {
    try {
      const { data, error } = await supabase
        .from('clash_clan_players') 
        .select('*');
  
      if (error) throw error;
      return data;
      
    } catch (error: any) {
      console.error('Error selecting clan players from Supabase:', error.message);
      return undefined;
    }
}

export async function selectSingleClanPlayer(player_tag: string) {
  try {
    const { data, error } = await supabase
      .from('clash_clan_players') 
      .select('*')
      .eq('player_tag', player_tag)
      .single()

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return undefined;
    }
    
    return data;
    
  } catch (error: any) {
    console.error('Error selecting single clan player from Supabase:', error.message);
    return undefined;
  }
}

export async function selectClanPlayerIDs() {
  try {
      const { data, error } = await supabase.from("clash_clan_players").select("player_tag");

      if (error) throw error;
      return data.map((player) => player.player_tag);
  } catch (error: any) {
      console.error("Error selecting player IDs players:", error.message);
      return [];
  }
}

export async function selectClanWarId(opponentClanTag: string) {
  try {
    const {data, error} = await supabase
    .from('clash_clan_wars')
    .select('war_id')
    .eq('opponent_clan_tag', opponentClanTag)
    .single();

  if (error) throw error;

  return data?.war_id;

  } catch (error: any) {
    console.error('Error selecting clan war ID to Supabase:', error.message);
    return null;
  }
}

export async function selectClanCapitalRaidID(startTime: string) {
  try {
    const {data, error} = await supabase
    .from('clash_clan_capital_raids')
    .select('raid_id')
    .eq('start_time', startTime)
    .single();

  if (error) throw error;

  return data?.raid_id;

  } catch (error: any) {
    console.error('Error selecting clan capital raid ID from Supabase:', error.message);
    return null;
  }
}

export async function selectClanPlayerAttacks(playerTag: string) {
  try {
    const {data, error} = await supabase
    .from('clash_clan_capital_raids')
    .select('raid_id')
    .eq('', playerTag)
    .single();

  if (error) throw error;

  return data?.raid_id;

  } catch (error: any) {
    console.error('Error selecting clan capital raid ID from Supabase:', error.message);
    return null;
  }
}

export async function selectNewestClanWarsIDs(numOfPastWars: number) {
  try {
    const { data, error } = await supabase
    .from('clash_clan_wars')
    .select('war_id')
    .order('created_at', { ascending: false })
    .limit(numOfPastWars);

    if (error) throw error;

    return data;

  } catch (error: any) {
    console.error('Error selecting war IDs from Supabase:', error.message);
    return null;
  }
}

export async function selectPlayerWarIDs(warIDs: number[], playerTag: string) {
  try {
    const { data, error } = await supabase
      .from('clash_clan_war_attacks')
      .select('war_id')
      .in('war_id', warIDs)
      .eq('attacker_tag', playerTag);

    if (error) throw error;

    return data ? data.map(item => item.war_id) : [];

  } catch (error: any) {
    console.error('Error fetching player war IDs from Supabase:', error.message);
    return [];
  } 
}

export async function selectPlayerPastFiveWars(warIDs: number[], playerTag: string) {
  try {
    const { data, error } = await supabase
      .from('clash_clan_war_attacks')
      .select('war_id, stars, destruction_percentage')
      .in('war_id', warIDs)
      .eq('attacker_tag', playerTag)
      .order('war_id', { ascending: false }) 
      .limit(10); 
    if (error) throw error;

    // Convert attacks into a war-based map and return 5 unique wars
    const warMap = new Map<number, any[]>();

    for (const attack of data || []) {
      if (!warMap.has(attack.war_id)) warMap.set(attack.war_id, []);
      warMap.get(attack.war_id)!.push(attack);
    }

    const result = Array.from(warMap.entries())
      .slice(0, 5)
      .map(([war_id, attacks]) => ({ war_id, attacks }));

    return result;

  } catch (error: any) {
    console.error('Error fetching player war attacks from Supabase:', error.message);
    return [];
  }
}








