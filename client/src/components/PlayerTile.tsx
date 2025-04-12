import { useEffect, useState } from "react";
import { fetchPlayerLastTenWarsCount, fetchPlayerLastFiveWars } from "../supabaseAPI";

type PlayerWar = {
  war_id: number;
  attacks: WarAttack[];
};
type WarAttack = {
  stars: number;
  destruction_percentage: number;
};

type PlayerData = {
  active: boolean;
  player_tag: string;
  level: number;
  town_hall: number;
  name: string;
  role: string;
  trophies: number;
  donations: number;
  donations_received: number;
  wars_participated_in: number;
  wars_missed_attacks: number;
  capital_raids_participated_in: number;
};

export function PlayerTile({ data }: { data: PlayerData }) {
  const [showDetails, setShowDetails] = useState(false);
  const [playerLast10WarsCount, setPlayerLast10WarsCount] = useState(0);
  const [playerLast5Wars, setPlayerLast5Wars] = useState<PlayerWar[]>([]);

  const handleToggle = () => setShowDetails(!showDetails);

  function getPlayerLast10WarsCount(playertag: string) {
    fetchPlayerLastTenWarsCount(playertag).then((count) =>
      setPlayerLast10WarsCount(count)
    );
  }

  function getPlayerLast5Wars(playerTag: string) {
    fetchPlayerLastFiveWars(playerTag).then((wars) =>
      setPlayerLast5Wars(wars)
    );
  }

  useEffect(() => {
    if (data.player_tag) {
      getPlayerLast10WarsCount(data.player_tag);
    }
  }, [data.player_tag]);

  useEffect(() => {
    if (data.player_tag) {
      getPlayerLast5Wars(data.player_tag);
    }
  }, [data.player_tag]);

  return (
    <div className="card mb-4 shadow-sm p-3 border-0" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <strong className="text-primary">Level {data.level}</strong> |{" "}
          <span className="badge bg-secondary">TH{data.town_hall}</span> |{" "}
          <span className="text-capitalize">{data.role}</span> |{" "}
          <strong className="text-dark">{data.name}</strong>
        </div>
        <div className="text-end">
          <strong className="text-warning">{data.trophies}</strong> Trophies
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-6">
          <p className="mb-1">
            Donated: <strong className="text-success">{data.donations}</strong>
          </p>
          <p className="mb-1">
            Donations Received:{" "}
            <strong className="text-danger">{data.donations_received}</strong>
          </p>
        </div>
        <div className="col-md-6">
          <p className="mb-1">
            Wars Participated In:{" "}
            <strong className="text-info">{data.wars_participated_in}</strong>
          </p>
          <p className="mb-1">
            # of Wars Missed Attacks:{" "}
            <strong className="text-danger">{data.wars_missed_attacks}</strong>
          </p>
        </div>
      </div>

      <p className="mb-2">
        # of capital raids participated in:{" "}
        <strong className="text-primary">{data.capital_raids_participated_in}</strong>
      </p>

      <p className="mb-2">
        # of past 10 wars participated in:{" "}
        <strong className="text-primary">{playerLast10WarsCount}</strong>
      </p>

      <div className="mb-2">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleToggle}
        >
          {showDetails ? "Hide" : "Show"} Past 5 Wars
        </button>
      </div>

      {showDetails && (
        <div className="border rounded p-3 bg-light">
          {playerLast5Wars &&
            playerLast5Wars.map((war, index) => (
              <div key={index} className="mb-2">
                <p className="mb-1">
                  <strong>Attack 1:</strong>{" "}
                  <span className="text-warning">
                    {"★".repeat(war.attacks[0].stars)}
                    {"☆".repeat(3 - war.attacks[0].stars)}
                  </span>{" "}
                  - {war.attacks[0].destruction_percentage}%
                </p>
                {war.attacks.length > 1 && (
                  <p className="mb-1">
                    <strong>Attack 2:</strong>{" "}
                    <span className="text-warning">
                      {"★".repeat(war.attacks[1].stars)}
                      {"☆".repeat(3 - war.attacks[1].stars)}
                    </span>{" "}
                    - {war.attacks[1].destruction_percentage}%
                  </p>
                )}
                <p>____________________________</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
