import "./Events.scss"
import { useGetEventsQuery } from "../../store/ApiSlice/eventApiSlice.js"
import { useAuthenticated } from "../../hooks/useAuthenticated.js"
import { EventCard } from "../../components/EventCard/index.jsx"

export const Events = () => {
    const { user, isAuth } = useAuthenticated()
    const { data: eventsData } = useGetEventsQuery()
    const events = eventsData?.events ?? []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const visibleEvents = events.filter(e => {
        const eventDate = new Date(e.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
    }).sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
        <main className="events">
            <section className="events__hero">
                <h1 className="events__hero--title">Événements</h1>
            </section>

            <section className="events__list">
                {visibleEvents.length === 0 ? (
                    <p className="events__empty">Aucun événement à venir pour le moment.</p>
                ) : (
                    visibleEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            user={user}
                            isAuth={isAuth}
                            today={today}
                        />
                    ))
                )}
            </section>
        </main>
    )
}