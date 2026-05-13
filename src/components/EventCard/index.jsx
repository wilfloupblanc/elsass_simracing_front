import { useState } from "react"
import { NavLink } from "react-router"
import { useDispatch } from "react-redux"
import { setIsModalOpen, setPendingReservation } from "../../store/slice/authSlice.js"
import { Modale } from "../Modale/index.jsx"
import { EventRegistrationForm } from "../EventRegistrationForm/index.jsx"
import { useGetEventRegistrationsQuery } from "../../store/ApiSlice/eventApiSlice.js"
import "./EventCard.scss"

export const EventCard = ({ event, user, isAuth, today }) => {
    const dispatch = useDispatch()
    const { data: registrationsData } = useGetEventRegistrationsQuery(event.id)
    const registrationsCount = registrationsData?.count ?? 0
    const isFull = registrationsCount >= event.simulators_count

    const vehicles = event.vehicles ? JSON.parse(event.vehicles) : []
    const categories = event.vehicle_categories ? JSON.parse(event.vehicle_categories) : []
    const isMembersOnly = event.access === 'members'
    const canRegister = !isMembersOnly || user?.is_member === 1

    const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0] ?? null)

    const isToday = () => {
        const d = new Date(event.date)
        d.setHours(0, 0, 0, 0)
        return d.getTime() === today.getTime()
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/Paris'
        })
    }

    const bannerColors = [
        'linear-gradient(135deg,#1a2a3a,#0d1f2d)',
        'linear-gradient(135deg,#1a2d1a,#0d2010)',
        'linear-gradient(135deg,#2a1a2a,#1d0d1d)',
        'linear-gradient(135deg,#2a2a1a,#1d1d0d)',
        'linear-gradient(135deg,#2a1a1a,#1d0d0d)',
        'linear-gradient(135deg,#1a1a2a,#0d0d1d)',
    ]

    const bannerEmojis = ['🏁', '🏆', '🚗', '⚡', '🔥', '🎯']
    const bannerIndex = event.id % bannerColors.length

    return (
        <article className="events__card bg-third">
            <div
                className="events__card--banner"
                style={{ background: event.banner_image ? 'transparent' : bannerColors[bannerIndex] }}
            >
                {event.banner_image
                    ? <img src={event.banner_image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span className="events__card--emoji">{bannerEmojis[bannerIndex]}</span>
                }
                <div className="events__card--badges">
                    {isToday() && (
                        <span className="events__badge events__badge--today">Aujourd'hui</span>
                    )}
                    {isMembersOnly && (
                        <span className="events__badge events__badge--member">⭐ Membres</span>
                    )}
                    {isFull && (
                        <span className="events__badge events__badge--full">Complet</span>
                    )}
                </div>
            </div>

            <div className="events__card--body">
                <h2 className="events__card--title">{event.title}</h2>

                {event.description && (
                    <p className="events__card--desc">{event.description}</p>
                )}

                <div className="events__card--infos">
                    <p>📅 {formatDate(event.date)}</p>
                    <p>🕐 {event.start_time?.slice(0, 5)} — {event.end_time?.slice(0, 5)}</p>
                    <p>🖥️ {event.simulators_count} simulateur{event.simulators_count > 1 ? 's' : ''}</p>
                    <p>💶 {event.price} € / simulateur</p>
                </div>

                {categories.length > 0 && (
                    <div className="events__card--tags">
                        {categories.map((cat, i) => (
                            <span key={i} className="events__tag events__tag--category">{cat}</span>
                        ))}
                    </div>
                )}

                {vehicles.length > 0 && (
                    <div className="events__card--tags">
                        {vehicles.map((v, i) => (
                            <span key={i} className="events__tag events__tag--vehicle">{v}</span>
                        ))}
                    </div>
                )}

                {isFull ? (
                    <div className="events__card--full">
                        <span>Événement complet</span>
                    </div>
                ) : canRegister ? (
                    <div className="events__card--actions">
                        {vehicles.length > 0 && (
                            <select
                                value={selectedVehicle}
                                onChange={e => setSelectedVehicle(e.target.value)}
                                className="events__vehicle-select bg-secondary text-secondary"
                                aria-label="vehicle select"
                            >
                                {vehicles.map((v, i) => (
                                    <option key={i} value={v}>{v}</option>
                                ))}
                            </select>
                        )}

                        {Array.from({ length: event.pilots_per_simulator }, (_, i) => i + 1).map(count => (
                            <Modale
                                key={count}
                                openBtnText={`${count} pilote${count > 1 ? 's' : ''}`}
                                btnClassName="events__register-btn bg-primary text-secondary"
                                onOpen={() => {
                                    if (!isAuth) {
                                        dispatch(setPendingReservation({ type: 'event', event_id: event.id, pilots: count }))
                                        dispatch(setIsModalOpen({ isModalOpen: true }))
                                        return false
                                    }
                                }}
                            >
                                {({ onClose }) => (
                                    <EventRegistrationForm
                                        event={event}
                                        pilotsCount={count}
                                        onClose={onClose}
                                        user={user}
                                        selectedVehicle={selectedVehicle}
                                    />
                                )}
                            </Modale>
                        ))}
                    </div>
                ) : (
                    <NavLink to="/subscriptions" className="events__member-cta bg-primary text-secondary">
                        Devenir membre pour s'inscrire
                    </NavLink>
                )}
            </div>
        </article>
    )
}