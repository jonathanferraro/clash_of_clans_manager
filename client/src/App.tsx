import { useState, useEffect } from 'react'
import './App.css'
import { PlayerTile } from './components/playerTile';
import { fetchClanPlayers } from './supabaseAPI';

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchClanPlayers().then(data => setPlayers(data));
  }, []);

  return (
    <div className="container py-4">
  
      <h2 className="mb-3">Clan Players</h2>
      {players && players.map((player: any) => (
        <PlayerTile key={player.player_tag} data={player} />
      ))}
    </div>
  );
}

export default App
