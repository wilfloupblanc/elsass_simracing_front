import "./SessionCard.scss"

export const SessionCard = ({ sessions, selectedSessionId, onDurationSelect, isMember, blockedSessionIds = new Set() }) => {

    return (
        <div className="session-card">
            <h2 className="text-secondary">Type de session</h2>
            <div className="session-card__duration">
                {sessions?.map((session, index) => {
                    const isBlocked = blockedSessionIds.has(session?.id)
                    return (
                        <button
                            key={index}
                            onClick={() => !isBlocked && onDurationSelect(session?.duration_minutes, session?.id)}
                            disabled={isBlocked}
                            className={`session-card__duration-btn 
                                ${selectedSessionId === session?.id ? 'active' : ''}
                                ${isBlocked ? 'session-card__duration-btn--blocked' : ''}
                            `}
                                        >
                            <span className="session-card__duration-btn__header session-header">
                                {session?.name}
                                <span className="session-card__duration-btn__sub">{session?.duration_minutes} min</span>
                            </span>
                            <span>{isMember ? session?.price_member.toFixed(2) : session?.price_normal.toFixed(2)} €</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}