import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

export interface ClanPlayer {
  active: boolean;
  player_tag: string;
  name: string;
  role: string;
  trophies: number;
  level: number;
  town_hall: number;
  donations: number;
  donations_received: number;
  wars_participated_in: number;
  wars_missed_attacks: number;
  capital_raids_participated_in: number;
}

export async function fetchClanPlayers(): Promise<ClanPlayer[]> {
  try {
    const response = await api.get('api/players');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching clan players:', error.message);
    return [];
  }
}

export async function fetchPlayerLastTenWarsCount(playerTag: string) {
    try {
      const encodedPlayerTag = encodeURIComponent(playerTag);
      const response = await api.get(`api/playerLastTenWars/${encodedPlayerTag}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching player wars count:', {
        message: error.message,
        response: error.response?.data, 
      });

      return 0; 
    }
}

export async function fetchPlayerLastFiveWars(playerTag: string) {
  try {
    const encodedPlayerTag = encodeURIComponent(playerTag);
    const response = await api.get(`api/playerLastFiveWars/${encodedPlayerTag}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching player wars count:', {
      message: error.message,
      response: error.response?.data, 
    });

    return []; 
  }

}

  
