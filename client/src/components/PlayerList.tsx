import { useState, useEffect } from "react";
import { fetchClanPlayers } from "../supabaseAPI";
import { ClanPlayer } from "../supabaseAPI";
import { PlayerTile } from "./PlayerTile";


export function PlayerList() {
    const [players, setPlayers] = useState<ClanPlayer[]>([]);

    useEffect(() => {
      fetchClanPlayers().then(data => setPlayers(data));
    }, []);

    function sortPlayers<K extends keyof ClanPlayer>(property: K) {
        const sortedPlayers = [...players].sort((a, b) => {
          const aVal = a[property];
          const bVal = b[property];
      
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal);
          }
      
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return bVal - aVal;
          }
      
          return 0;
        });
      
        setPlayers(sortedPlayers);
      }
      

    return (
        <div className="container py-4">
      
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Sort Players By:
          </button>
            <ul className="dropdown-menu">
                <li onClick={() => sortPlayers('wars_participated_in')}>
                    <a className="dropdown-item" href="#">Wars Participated In</a>
                </li>
                <li onClick={() => sortPlayers('level')}>
                    <a className="dropdown-item" href="#">Level</a>
                </li>
                <li onClick={() => sortPlayers('wars_missed_attacks')}>
                    <a className="dropdown-item" href="#">Wars Missed</a>
                </li>
                <li onClick={() => sortPlayers('trophies')}>
                    <a className="dropdown-item" href="#">Trophies</a>
                </li>
            </ul>
        </div>
  
        <h2 className="mb-3">Clan Players</h2>
        {players && players.map((player: any) => (
          player.active && <PlayerTile key={player.player_tag} data={player} />
        ))}
      </div>
    )
}