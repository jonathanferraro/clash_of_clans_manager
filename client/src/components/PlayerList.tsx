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
  const [searchTerm, setSearchTerm] = useState<string>('');
  

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    const fetchData = async () => {
        try {
            let playersData = await fetchClanPlayers();
            if (isMounted) {
              const defaultSortedPlayers = sortPlayersArray(playersData, 'wars_participated_in', 'desc');
              setPlayers(defaultSortedPlayers);
              setCurrentSortKey('wars_participated_in');
              setCurrentSortOrder('desc');    
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

  function handleSearch(e:any) {
    setSearchTerm(e.target.value);
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
    <div className="container-fluid container-sm py-4 " style={{ maxWidth: '700px' }}>
       {/* Header section: Title, Search, Sort */}
      <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4 gap-3">
        <h2 className="text-primary mb-0 order-md-1">
          Clan Players ({players.length}) 
        </h2>

        {/* Search  */}
        <div className="input-group order-md-2 flex-grow-1 flex-md-grow-0" style={{ maxWidth: '350px' }}> 
          <input
            type="text"
            className="form-control" 
            placeholder="Search by name"
            onChange={handleSearch} 
            value={searchTerm}   
            aria-label="Search players by name"
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <i className="bi bi-x-lg"></i> 
            </button>
          )}
        </div>

        {/* Dropdown  */}
        <div className="dropdown order-md-3 ms-md-auto"> 
          <button
            className="btn btn-outline-primary dropdown-toggle w-100 w-md-auto" 
            type="button"
            id="sortPlayersDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort By: {currentSortKey.toString().replace(/_/g, ' ')} ({currentSortOrder})
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="sortPlayersDropdown">
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
          (player: any) =>{
              if (searchTerm.length === 0) {
                return <PlayerTile key={player.player_tag} data={player} />
              } else if
               (player.name.length >= searchTerm.length && 
                player.name.slice(0, searchTerm.length).toLowerCase() === searchTerm.toLowerCase()
              ) {
                return <PlayerTile key={player.player_tag} data={player} />
              }
              
          }
        )}
    </div>
  );
}