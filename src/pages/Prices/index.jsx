import {useState} from "react";
import {createPortal} from "react-dom";
import {useNavigate} from "react-router";
import {useGetAllSessionsQuery} from "../../store/ApiSlice/sessionApiSlice.js";
import simugt from "../../assets/images/simugt.jpg"
import "./Prices.scss"

export const Prices = () => {
    const navigate = useNavigate()
    const {data} = useGetAllSessionsQuery()
    const sessions = data?.sessions ?? []
    const [selectedSession, setSelectedSession] = useState(null)

    const handleReserve = (duration, id) => {
        navigate("/reservations", { state: { duration, sessionId: id } })
    }

    const handleOpenModal = (session) => {
        setSelectedSession(session)
        document.body.style.overflow = 'hidden'
    }

    const handleCloseModal = () => {
        setSelectedSession(null)
        document.body.style.overflow = ''
    }

    const LEVEL_CLASSES = {
        "Découverte": "level-decouverte",
        "Initiation": "level-initiation",
        "Confirmé": "level-confirme",
        "Expert": "level-expert",
    }

    return (
        <main className="prices">
            <section className="prices__top">
                <article className="prices__top--intro">
                    <p>Plongez dans l'univers du pilotage et vivez des sensations uniques sur simulateur, accessible dès 11 ans et à partir de 1m50. Que ce soit pour découvrir, progresser ou simplement vous faire plaisir, chaque session est pensée pour vous offrir une expérience immersive et intense.</p>
                </article>
                <article className="prices__top--title">
                    <img src={simugt} alt="image simulateur GT"/>
                    <h1>Formules et tarifs</h1>
                </article>
            </section>

            <section className="prices__sessions">
                {sessions.map((session) => (
                    <article key={session.id} className="prices__sessions--card">
                        <div className="prices__sessions--card-img">
                            <img src={`/assets/images/${session.image}`} alt={session.name} />
                            <span className={`prices__sessions--card-level ${LEVEL_CLASSES[session.level] ?? ''}`}>
                                {session.level}
                            </span>
                            <span className="prices__sessions--card-badge">à partir de {session.min_age} ans</span>
                        </div>

                        <div className="prices__sessions--card-body">
                            <p className="prices__sessions--card-title">{session.name}</p>
                            <div className="prices__sessions--card-divider" />
                            <div className="prices__sessions--card-meta">
                                <span>⏱ {session.duration_minutes} min</span>
                                <span>€ {session.price_normal.toFixed(2)}€</span>
                                <span>👤 {session.min_pilots === session.max_pilots ? session.min_pilots : `${session.min_pilots} à ${session.max_pilots}`} pilote{session.max_pilots > 1 ? 's' : ''}</span>
                                <span>↕ {session.min_height}</span>
                            </div>
                        </div>

                        <div className="prices__sessions--card-footer">
                            <button
                                className="prices__sessions--card-detail"
                                onClick={() => handleOpenModal(session)}
                            >
                                Voir plus
                            </button>
                            <button
                                className="prices__sessions--card-btn text-secondary"
                                onClick={() => handleReserve(session.duration_minutes, session.id)}
                            >
                                Réserver
                            </button>
                        </div>
                    </article>
                ))}
            </section>

            {selectedSession && createPortal(
                <div className="prices__modal-overlay" onClick={handleCloseModal}>
                    <div className="prices__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="prices__modal--img">
                            <img src={`/assets/images/${selectedSession.image}`} alt={selectedSession.name} />
                            <span className={`prices__modal--level ${LEVEL_CLASSES[selectedSession.level] ?? ''}`}>
                                {selectedSession.level}
                            </span>
                            <div className="prices__modal--title">
                                <h2>{selectedSession.name}</h2>
                                <p>Durée totale sur place : {selectedSession.total_duration}</p>
                            </div>
                        </div>

                        <div className="prices__modal--body">
                            <div className="prices__modal--meta">
                                <div className="prices__modal--meta-pill">
                                    <span>Durée pilotage</span>
                                    <span>{selectedSession.duration_minutes} min</span>
                                </div>
                                <div className="prices__modal--meta-pill">
                                    <span>Âge minimum</span>
                                    <span>{selectedSession.min_age} ans</span>
                                </div>
                                <div className="prices__modal--meta-pill">
                                    <span>Taille minimum</span>
                                    <span>{selectedSession.min_height}</span>
                                </div>
                                <div className="prices__modal--meta-pill">
                                    <span>Pilotes</span>
                                    <span>{selectedSession.min_pilots} à {selectedSession.max_pilots}</span>
                                </div>
                            </div>

                            <div className="prices__modal--divider" />

                            <div className="prices__modal--steps">
                                <p className="prices__modal--section-title">Déroulé de la session</p>
                                <div className="prices__modal--step">
                                    <span className="prices__modal--step-dot">1</span>
                                    <div>
                                        <p>Accueil et configuration — 10 min</p>
                                        <span>{selectedSession.intro}</span>
                                    </div>
                                </div>
                                <div className="prices__modal--step">
                                    <span className="prices__modal--step-dot">2</span>
                                    <div>
                                        <p>Session de pilotage — {selectedSession.duration_minutes} min</p>
                                        <span>{selectedSession.details}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prices__modal--divider" />

                            <div className="prices__modal--prices">
                                <div className="prices__modal--price-card">
                                    <p>Tarif normal</p>
                                    <p>{selectedSession.price_normal.toFixed(2)}€</p>
                                </div>
                                <div className="prices__modal--price-card member">
                                    <p>Tarif membre</p>
                                    <p>{selectedSession.price_member.toFixed(2)}€</p>
                                </div>
                            </div>

                            <p className="prices__modal--tagline">{selectedSession.tagline}</p>
                        </div>

                        <div className="prices__modal--footer">
                            <button
                                className="prices__modal--close"
                                onClick={handleCloseModal}
                            >
                                Fermer
                            </button>
                            <button
                                className="prices__modal--reserve text-secondary"
                                onClick={() => {
                                    handleCloseModal()
                                    handleReserve(selectedSession.duration_minutes, selectedSession.id)
                                }}
                            >
                                Réserver cette session →
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </main>
    )
}