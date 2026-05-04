import { useState } from "react"
import { useNavigate } from "react-router"

import "./EventRegistrationForm.scss"

export const EventRegistrationForm = ({ event, pilotsCount, onClose, user }) => {
    const navigate = useNavigate()
    const [pilots, setPilots] = useState(
        Array.from({ length: pilotsCount }, (_, i) =>
            i === 0
                ? { firstname: user?.firstname ?? '', lastname: user?.lastname ?? '' }
                : { firstname: '', lastname: '' }
        )
    )

    const handleChange = (index, field, value) => {
        const updated = [...pilots]
        updated[index] = { ...updated[index], [field]: value }
        setPilots(updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onClose()
        navigate('/order/checkout', {
            state: {
                type: 'event',
                event_id: event.id,
                event_title: event.title,
                event_date: event.date,
                event_start_time: event.start_time,
                event_end_time: event.end_time,
                event_price: event.price,
                pilots_count: pilotsCount,
                pilots_list: pilots,
            }
        })
    }

    return (
        <div className="events__form">
            <h3 className="events__form--title">S'inscrire — {event.title}</h3>
            <p className="events__form--subtitle">
                {pilotsCount} pilote{pilotsCount > 1 ? 's' : ''} · {event.price} €
            </p>
            <form onSubmit={handleSubmit}>
                {pilots.map((pilot, i) => (
                    <div key={i} className="events__form--pilot">
                        <p className="events__form--pilot-label">Pilote {i + 1}</p>
                        <input
                            type="text"
                            placeholder="Prénom"
                            value={pilot.firstname}
                            onChange={e => handleChange(i, 'firstname', e.target.value)}
                            required
                            className="bg-secondary text-secondary"
                        />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={pilot.lastname}
                            onChange={e => handleChange(i, 'lastname', e.target.value)}
                            required
                            className="bg-secondary text-secondary"
                        />
                    </div>
                ))}
                <button type="submit" className="bg-primary text-secondary">
                    Procéder au paiement
                </button>
            </form>
        </div>
    )
}