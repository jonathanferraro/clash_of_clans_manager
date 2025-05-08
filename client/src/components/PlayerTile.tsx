import { useEffect, useState } from "react";
import { fetchPlayerLastTenWarsCount, fetchPlayerLastFiveWars } from "../supabaseAPI"; // Assuming this path is correct

// Type definitions ---
type PlayerWar = {
    war_id: number;
    attacks: WarAttack[];
};
type WarAttack = {
    stars: number;
    destruction_percentage: number;
};

type PlayerData = {
    created_at: string;
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

// --- Helper Function ---
function renderStars(stars: number) {
    const totalStars = 3;
    return (
        <>
            {[...Array(stars)].map((_, i) => <i key={`filled-${i}`} className="bi bi-star-fill text-warning"></i>)}
            {[...Array(totalStars - stars)].map((_, i) => <i key={`empty-${i}`} className="bi bi-star text-warning"></i>)}
        </>
    );
}

// --- Component ---
export function PlayerTile({ data }: { data: PlayerData }) {
    const [showDetails, setShowDetails] = useState(false);
    const [playerLast10WarsCount, setPlayerLast10WarsCount] = useState<number | null>(null);
    const [playerLast5Wars, setPlayerLast5Wars] = useState<PlayerWar[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = () => setShowDetails(!showDetails);

    function formatDateDifference(dateString: string): number {
        try {
            const inputDate = new Date(dateString);
            if (isNaN(inputDate.getTime())) {
                console.error("Invalid date provided:", dateString);
                return 0; 
            }
            const now = new Date();
            const diffTime = now.getTime() - inputDate.getTime();
            const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))); 
            return diffDays;
        } catch (e) {
            console.error("Error formatting date:", e);
            return 0; 
        }
    }

    useEffect(() => {
        if (!data.player_tag) return;

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const [count, wars] = await Promise.all([
                    fetchPlayerLastTenWarsCount(data.player_tag),
                    fetchPlayerLastFiveWars(data.player_tag)
                ]);

                if (isMounted) {
                    setPlayerLast10WarsCount(count);
                    setPlayerLast5Wars(wars);
                }
            } catch (err) {
                console.error("Failed to fetch player war data:", err);
                if (isMounted) {
                    setError("Could not load war details.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [data.player_tag]); 

    const daysInClan = formatDateDifference(data.created_at);

    return (
        <div className="card mb-4 shadow border-light" style={{ backgroundColor: 'var(--bs-card-bg)', transition: 'box-shadow 0.3s ease-in-out' }}>
            <div className="card-header bg-body-tertiary d-flex justify-content-between align-items-center py-3 px-4 border-bottom-0">
                <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0 text-primary fw-bold">{data.name}</h5>
                    <span className="badge text-bg-secondary text-uppercase px-2 py-1">{data.role === 'admin' ? 'elder' : data.role}</span>
                </div>
                <div className="d-flex align-items-center gap-3 text-muted small">
                    <span><i className="bi bi-star-fill me-1"></i>Level {data.level}</span>
                    <span><i className="bi bi-house-fill me-1"></i>TH{data.town_hall}</span>
                    <span><i className="bi bi-trophy-fill me-1 text-warning"></i>{data.trophies}</span>
                </div>
            </div>

            <div className="card-body p-4">
                <div className="row gy-3">
                    {/* Stats Column 1 */}
                    <div className="col-md-6">
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2 d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-calendar-event me-2 text-info"></i>Days in Clan:</span>
                                <span className="fw-medium">{daysInClan}</span>
                            </li>
                            <li className="mb-2 d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-arrow-up-circle-fill me-2 text-success"></i>Donated:</span>
                                <span className="fw-medium">{data.donations?.toLocaleString()}</span>
                            </li>
                            <li className="d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-arrow-down-circle-fill me-2 text-danger"></i>Received:</span>
                                <span className="fw-medium">{data.donations_received?.toLocaleString()}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Stats Column 2 */}
                    <div className="col-md-6">
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2 d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-shield-shaded me-2 text-primary"></i>Wars Participated:</span>
                                <span className="fw-medium">{data.wars_participated_in}</span>
                            </li>
                             <li className="mb-2 d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>Missed War Attacks:</span>
                                <span className={`fw-medium ${data.wars_missed_attacks > 0 ? 'text-danger' : ''}`}>{data.wars_missed_attacks}</span>
                            </li>
                            <li className="d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-hammer me-2 text-secondary"></i>Capital Raids:</span>
                                <span className="fw-medium">{data.capital_raids_participated_in}</span>
                            </li>

                        </ul>
                    </div>
                </div>

                <hr className="my-4" />

                {/* Recent War Stats */}
                 <div className="mb-3 d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-clock-history me-2 text-info"></i>Wars (Last 10):</span>
                     {isLoading && <div className="spinner-border spinner-border-sm text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>}
                    {error && <span className="text-danger small">{error}</span>}
                    {playerLast10WarsCount !== null && !isLoading && !error && <span className="fw-medium">{playerLast10WarsCount} / 10</span>}
                </div>

                {/* Toggle Button */}
                <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center"
                    onClick={handleToggle}
                    aria-controls={`player-war-details-${data.player_tag}`} 
                    aria-expanded={showDetails}
                >
                    {showDetails ? "Hide" : "Show"} Past 5 War Attacks
                    <i className={`bi ${showDetails ? 'bi-chevron-up' : 'bi-chevron-down'} ms-2`}></i>
                </button>

                {/* Collapsible Details */}
                <div className={`collapse ${showDetails ? 'show' : ''}`} id={`player-war-details-${data.player_tag}`}>
                    <div className="mt-3">
                        {isLoading && (
                             <div className="d-flex justify-content-center p-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading war details...</span>
                                </div>
                            </div>
                        )}
                        {error && <div className="alert alert-danger alert-sm py-2">{error}</div>}
                        {playerLast5Wars && playerLast5Wars.length > 0 && !isLoading && !error && (
                            <div className="list-group list-group-flush">
                                {playerLast5Wars.map((war, index) => (
                                    <div key={war.war_id || index} className="list-group-item bg-light px-3 py-2 mb-2 rounded border">
                                        {/* <h6 className="mb-2 small text-muted">War #{index + 1}</h6> */}
                                        {war.attacks && war.attacks.length > 0 ? (
                                            <>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="small fw-medium">Attack 1:</span>
                                                    <div>
                                                        <span className="me-2">{renderStars(war.attacks[0].stars)}</span>
                                                        <span className="badge bg-secondary rounded-pill">{war.attacks[0].destruction_percentage}%</span>
                                                    </div>
                                                </div>
                                                {war.attacks.length > 1 && (
                                                     <div className="d-flex justify-content-between align-items-center">
                                                        <span className="small fw-medium">Attack 2:</span>
                                                        <div>
                                                            <span className="me-2">{renderStars(war.attacks[1].stars)}</span>
                                                            <span className="badge bg-secondary rounded-pill">{war.attacks[1].destruction_percentage}%</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Handle case of missing second attack if needed */}
                                                {war.attacks.length === 1 && (
                                                     <div className="d-flex justify-content-between align-items-center text-muted">
                                                        <span className="small fst-italic">Attack 2: N/A</span>
                                                     </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="mb-0 text-muted small fst-italic">No attack data recorded for this war.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                         {playerLast5Wars?.length === 0 && !isLoading && !error && (
                              <p className="text-muted fst-italic mt-3">No recent war attack data found.</p>
                         )}
                    </div>
                </div>
            </div> {/* End card-body */}
        </div> // End card
    );
}