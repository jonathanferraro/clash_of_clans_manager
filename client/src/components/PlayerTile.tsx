
import { useState } from "react";

type WarAttack = {
  stars: number;
  destruction: number;
};

type PlayerData = {
    level: number;
    town_hall: number;
    name: string;
    trophies: number;
    donations: number;
    donations_received: number;
    wars_participated_in: number;
    wars_missed_attacks: number;
    // ......
  };
  
  export function PlayerTile({ data }: { data: PlayerData }) {
    const [showDetails, setShowDetails] = useState(false);
  
    const handleToggle = () => setShowDetails(!showDetails);
  
    return (
      <div className="card mb-4 shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
          <div>
            <strong>Level {data.level}</strong> | TH{data.town_hall} |{" "}
            <strong>{data.name}</strong>
          </div>
          <div className="text-end">
            <strong>{data.trophies}</strong> Trophies
          </div>
        </div>
  
        <div className="row mb-2">
          <div className="col-md-6">
            <p>Donated: <strong>{data.donations}</strong></p>
            <p>Donations Received: <strong>{data.donations_received}</strong></p>
          </div>
          <div className="col-md-6">
            <p>Wars Participated In: <strong>{data.wars_participated_in}</strong></p>
            <p># of Wars Missed Attacks: <strong>{data.wars_missed_attacks}</strong></p>
          </div>
        </div>
  
        <p className="mb-2"># of past 10 wars participated in: <strong>TBD</strong></p>
  
        <div className="mb-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handleToggle}>
            {showDetails ? "Hide" : "Show"} Past 5 Wars
          </button>
        </div>
  
        {showDetails && (
          <div className="border rounded p-3 bg-light">
            {/* {data.past_5_attacks.map((attack, index) => (
              <p key={index} className="mb-1">
                <strong>Attack {index + 1}:</strong>{" "}
                {"★".repeat(attack.stars)}{"☆".repeat(3 - attack.stars)} -{" "}
                {attack.destruction}%
              </p>
            ))} */}
          </div>
        )}
      </div>
    );
  }
  