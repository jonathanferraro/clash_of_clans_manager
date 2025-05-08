import { useState, useEffect } from "react";
import { fetchClanPlayers } from "../supabaseAPI";
import { ClanPlayer } from "../supabaseAPI";
import { PlayerTile } from "./PlayerTile";

export function PlayerList() {
  const [players, setPlayers] = useState<ClanPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSortKey, setCurrentSortKey] = useState<keyof ClanPlayer>('wars_participated_in'); 
  const [currentSortOrder, setCurrentSortOrder] = useState<'asc' | 'desc'>('desc');
  

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    const fetchData = async () => {
        try {
            let playersData = await fetchClanPlayers();
            if (isMounted) {
              setPlayers(playersData);
            }
        } catch (err) {
            console.error("Failed to fetch players:", err);
            if (isMounted) {
                setError("Could not load player data.");
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
    };

    fetchData();
    return () => {
        isMounted = false;
    };
  }, []); 
  

  const sortPlayersArray = (
    playersArray: ClanPlayer[],
    property: keyof ClanPlayer,
    order: 'asc' | 'desc' = 'desc'
  ): ClanPlayer[] => {
    return [...playersArray].sort((a, b) => {
      const aVal = a[property];
      const bVal = b[property];

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal; 
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal); 
      }
      

      return order === 'desc' ? comparison * -1 : comparison;
    });
  };

  function handleSort(property: keyof ClanPlayer) {
    let newOrder: 'asc' | 'desc';

    // Toggle order if sorting by the same key, or set default for new key
    if (currentSortKey === property) {
      newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Default order for new properties (e.g., numeric desc, string asc)
      if (typeof players[0]?.[property] === 'number') {
        newOrder = 'desc';
      } else {
        newOrder = 'asc';
      }
    }

    const sorted = sortPlayersArray(players, property, newOrder);
    setPlayers(sorted);
    setCurrentSortKey(property);
    setCurrentSortOrder(newOrder);
  }

  if (isLoading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading players...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
       <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">Clan Players ({players.length})</h2>
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="sortPlayersDropdown" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort By: {currentSortKey.toString().replace(/_/g, ' ')} ({currentSortOrder})
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="sortPlayersDropdown">
            {/* Helper to create sort options */}
            {(['wars_participated_in', 'level', 'wars_missed_attacks', 'trophies', 'name'] as const).map((key) => (
              <li key={key}>
                <button
                  className={`dropdown-item ${currentSortKey === key ? 'active' : ''}`}
                  onClick={() => handleSort(key)}
                >
                  {key.toString().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {currentSortKey === key && (currentSortOrder === 'asc' ? ' (Asc)' : ' (Desc)')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {players &&
        players.map(
          (player: any) =>
            player.active && <PlayerTile key={player.player_tag} data={player} />
        )}
    </div>
  );
}