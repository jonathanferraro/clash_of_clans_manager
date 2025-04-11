import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

export async function fetchClanPlayers() {
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
      const response = await api.get(`api/playerLastTenWars?playerTag=${playerTag}`);
      return response.data.count;
    } catch (error: any) {
      console.error('Error fetching player wars count:', error.message);
      return 0; 
    }
  }
  
