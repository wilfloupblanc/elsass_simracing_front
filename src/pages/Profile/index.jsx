import "./Profile.scss"
import {useCancelSubscriptionMutation, useGetMySubscriptionQuery, useReactivateSubscriptionMutation} from "../../store/ApiSlice/subscriptionApiSlice.js";
import {useAuthenticated} from "../../hooks/useAuthenticated.js";
import {Modale} from "../../components/Modale/index.jsx";
import {Alert} from "../../components/Alert/index.jsx";
import {useGetAllOrdersQuery} from "../../store/ApiSlice/orderApiSlice.js";
import {useState} from "react";
import {DeleteAccount} from "../../components/DeleteAccount/index.jsx";
import {EditPassword} from "../../components/EditPassword/index.jsx";
import {EditEmail} from "../../components/EditEmail/index.jsx";
import {NavLink} from "react-router";
import {useGetFreeSessionQuery} from "../../store/ApiSlice/giftVoucherApiSlice.js";
import {useGetAllPlansQuery} from "../../store/ApiSlice/planApiSlice.js";
import {useGetMyBookingsQuery, useCancelBookingMutation} from "../../store/ApiSlice/bookingApiSlice.js";

export const Profile = () => {
    const {user} = useAuthenticated()
    const initials = user ? `${user.firstname?.[0]}${user.lastname?.[0]}`.toUpperCase() : ""
    const {data: subscriptionData} = useGetMySubscriptionQuery(undefined, { skip: !user || user?.is_member !== 1 })
    const subscription = subscriptionData?.subscription
    const [cancelSubscription] = useCancelSubscriptionMutation()
    const [reactivateSubscription] = useReactivateSubscriptionMutation()
    const {data: ordersData} = useGetAllOrdersQuery()
    const [showAll, setShowAll] = useState(false)
    const orders = ordersData?.orders ?? []
    const displayedOrders = showAll ? orders : orders.slice(0, 5)
    const {data: freeSessionData} = useGetFreeSessionQuery(undefined, { skip: user?.is_member !== 1 })
    const freeSession = freeSessionData?.giftVoucher
    const {data: plansData} = useGetAllPlansQuery()
    const currentPlan = plansData?.plans?.find(p => p.plan === subscription?.plan)
    const pendingPlan = plansData?.plans?.find(p => p.plan === subscription?.pending_plan)
    const renewalPlan = pendingPlan ?? currentPlan
    const {data: bookingsData, refetch: refetchBookings} = useGetMyBookingsQuery(undefined, { skip: !user })
    const bookings = bookingsData?.bookings ?? []
    const [cancelBooking] = useCancelBookingMutation()

    console.log(bookings)

    const isPendingCancellation = subscription?.status === "pending_cancellation"

    const now = new Date()

    const getBookingDateTime = (booking) => {
        const d = new Date(booking.date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return new Date(`${year}-${month}-${day}T${booking.start_time}`)
    }

    const upcomingBookings = bookings.filter(b => getBookingDateTime(b) > now)
    const pastBookings = bookings.filter(b => getBookingDateTime(b) <= now)

    const isCancellable = (booking) => {
        const bookingDateTime = getBookingDateTime(booking)
        const diffHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
        return diffHours >= 1
    }

    const handleCancelBooking = async (bookingId, onClose) => {
        try {
            await cancelBooking(bookingId).unwrap()
            onClose()
            refetchBookings()
        } catch (error) {
            console.error("Cancel booking error:", error)
            onClose()
        }
    }

    const handleCancel = async (closeAlert, onClose) => {
        await cancelSubscription().unwrap()
        closeAlert()
        onClose()
        window.location.reload()
    }

    const handleReactivate = async () => {
        await reactivateSubscription().unwrap()
        window.location.reload()
    }

    const PLAN_BENEFITS = {
        STARTER: [
            "2x 15 minutes offertes chaque mois",
            "Tarifs membres réduits au bar",
            "Accès aux services membres exclusifs",
            "Accès aux soirées privées et événements spécial membre",
        ],
        PLUS: [
            "4x 15 minutes offertes chaque mois",
            "Tarifs membres réduits au bar",
            "Tarifs membres réduits sur toutes les sessions",
            "Accès aux services membres exclusifs",
            "Accès aux soirées privées et événements spécial membre",
        ],
        ULTRA: [
            "8x 15 minutes offertes chaque mois",
            "Tarifs membres réduits au bar",
            "Tarifs membres réduits sur toutes les sessions",
            "Accès aux services membres exclusifs",
            "Accès aux soirées privées et événements spécial membre",
        ],
    }

    const formatDate = (date) => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return new Date(`${year}-${month}-${day}T12:00:00`).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTime = (time) => time?.slice(0, 5)

    return (
        <main className="profile">
            <section className="profile__header">
                <article className="profile__header--card bg-third">
                    <span className="profile__header--avatar bg-primary text-secondary">{initials}</span>
                    <div>
                        <p className="profile__header--name">{user?.firstname} {user?.lastname}</p>
                        {user?.is_member === 1
                            ? <p className="profile__header--badge">⭐ Membre Club SimRacing</p>
                            : <p className="profile__header--non-member">Non membre</p>
                        }
                    </div>
                </article>
            </section>

            <section className="profile__section">
                <p className="profile__section--label">Informations personnelles</p>
                <article className="profile__card bg-third">
                    <p className="profile__card--row"><span>Prénom</span><span>{user?.firstname}</span></p>
                    <p className="profile__card--row"><span>Nom</span><span>{user?.lastname}</span></p>
                    <p className="profile__card--row"><span>Email</span><span>{user?.email}</span></p>
                    <p className="profile__card--row"><span>Mot de passe</span><span>••••••••</span></p>
                    <EditEmail btnClassName="profile__edit-btn" />
                    <EditPassword btnClassName="profile__edit-btn" />
                </article>
            </section>

            <section className="profile__section">
                <p className="profile__section--label">Abonnement</p>
                <article className="profile__card bg-third">
                    {user?.is_member === 1 && subscription ? (
                        <>
                            <p className="profile__card--row">
                                <span>Abonnement</span>
                                <span className="text-success">{currentPlan?.plan}</span>
                            </p>

                            <p className="profile__card--row">
                                <span>Sessions gratuites restantes</span>
                                <span className="text-success">{subscription?.free_sessions_remaining ?? 0} disponible{subscription?.free_sessions_remaining > 1 ? 's' : ''}</span>
                            </p>

                            {subscription?.pending_plan && (
                                <p className="profile__card--row">
                                    <span>Changement prévu</span>
                                    <span className="text-primary">
                                        Passage en {subscription.pending_plan} le {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                                    </span>
                                </p>
                            )}

                            {isPendingCancellation ? (
                                <p className="profile__card--row">
                                    <span>Statut</span>
                                    <span className="text-error">
                                        Annulation prévue le {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                                    </span>
                                </p>
                            ) : (
                                <p className="profile__card--row">
                                    <span>Renouvellement</span>
                                    <span>
                                        {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')} à {renewalPlan?.price.toFixed(2)}€/mois
                                    </span>
                                </p>
                            )}

                            {freeSession &&
                                <p className="profile__card--row">
                                    <span>Session offerte</span>
                                    <span className="text-success">15 min disponible — expire le {new Date(freeSession.expires_at).toLocaleDateString('fr-FR')}</span>
                                </p>
                            }

                            {isPendingCancellation ? (
                                <Alert openBtnText="Reprendre mon abonnement" btnClassName="profile__edit-btn">
                                    {({ onClose }) => (
                                        <>
                                            <p>Votre abonnement sera réactivé et continuera de se renouveler normalement.</p>
                                            <button onClick={onClose}>Annuler</button>
                                            <button onClick={async () => { await handleReactivate(); onClose() }} className="bg-primary text-secondary">
                                                Confirmer la réactivation
                                            </button>
                                        </>
                                    )}
                                </Alert>
                            ) : (
                                <Modale openBtnText="Annuler l'abonnement" btnClassName="profile__cancel-btn">
                                    {({ onClose }) => (
                                        <>
                                            <h3>Vous allez perdre tous vos avantages membres :</h3>
                                            <ul>
                                                {PLAN_BENEFITS[subscription?.plan]?.map((benefit, i) => (
                                                    <li key={i}>{benefit}</li>
                                                ))}
                                            </ul>
                                            <p>Vous conserverez vos avantages jusqu'au {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}.</p>
                                            <p>Êtes-vous sûr de vouloir continuer ?</p>
                                            <button onClick={onClose} className="bg-primary text-secondary">Conserver mon abonnement</button>
                                            <Alert openBtnText="Continuer l'annulation">
                                                {({ onClose: closeAlert }) => (
                                                    <>
                                                        <p>Votre abonnement ne sera pas renouvelé. Vous gardez vos avantages jusqu'au {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}.</p>
                                                        <button onClick={closeAlert}>Annuler</button>
                                                        <button onClick={() => handleCancel(closeAlert, onClose)} className="bg-error text-secondary">Confirmer l'annulation</button>
                                                    </>
                                                )}
                                            </Alert>
                                        </>
                                    )}
                                </Modale>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="profile__card--row">
                                <span>Statut</span>
                                <span>Non membre</span>
                            </p>
                            <NavLink to="/subscriptions" className="profile__edit-btn" style={{textAlign: "center", display: "block"}}>
                                Rejoindre le Club SimRacing
                            </NavLink>
                        </>
                    )}
                </article>
            </section>

            <section className="profile__section">
                <p className="profile__section--label">Mes réservations</p>
                <article className="profile__card bg-third">
                    {upcomingBookings.length > 0 ? (
                        <>
                            <p className="profile__section--sublabel">À venir</p>
                            {upcomingBookings.map(booking => (
                                <div key={booking.id} className="profile__booking">
                                    <div className="profile__booking--info">
                                        <p className="profile__booking--date">{formatDate(booking.date)}</p>
                                        <p className="profile__booking--details">
                                            {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                                            {booking.session_name && ` — ${booking.session_name}`}
                                            {booking.pilots > 1 && ` — ${booking.pilots} pilotes`}
                                        </p>
                                        <p className="profile__booking--price">{booking.price_paid?.toFixed(2)}€</p>
                                    </div>
                                    {isCancellable(booking) && (
                                        <Alert openBtnText="Annuler" btnClassName="profile__cancel-btn profile__cancel-btn--small">
                                            {({ onClose }) => (
                                                <>
                                                    <p>Annuler la réservation du {formatDate(booking.date)} à {formatTime(booking.start_time)} ?</p>
                                                    <p>Vous serez remboursé intégralement.</p>
                                                    <button onClick={onClose}>Conserver</button>
                                                    <button onClick={() => handleCancelBooking(booking.id, onClose)} className="bg-error text-secondary">
                                                        Confirmer l'annulation
                                                    </button>
                                                </>
                                            )}
                                        </Alert>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="profile__card--row">Aucune réservation à venir</p>
                    )}

                    {pastBookings.length > 0 && (
                        <>
                            <p className="profile__section--sublabel" style={{marginTop: "16px"}}>Passées</p>
                            {pastBookings.slice(0, 3).map(booking => (
                                <div key={booking.id} className="profile__booking profile__booking--past">
                                    <div className="profile__booking--info">
                                        <p className="profile__booking--date">{formatDate(booking.date)}</p>
                                        <p className="profile__booking--details">
                                            {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                                            {booking.session_name && ` — ${booking.session_name}`}
                                            {booking.pilots > 1 && ` — ${booking.pilots} pilotes`}
                                        </p>
                                        <p className="profile__booking--price">{booking.price_paid?.toFixed(2)}€</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </article>
            </section>

            <section className="profile__section">
                <p className="profile__section--label">Historique des commandes</p>
                <article className="profile__card bg-third">
                    {orders.length > 0 ? (
                        <>
                            {displayedOrders.map(order => (
                                <p key={order.id} className="profile__card--row">
                                    <span>#{order.number}</span>
                                    <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                                    <span>{order.amount.toFixed(2)}€</span>
                                </p>
                            ))}
                            {orders.length > 5 &&
                                <button onClick={() => setShowAll(!showAll)} className="profile__show-more">
                                    {showAll ? "Voir moins" : `Voir tout (${orders.length})`}
                                </button>
                            }
                        </>
                    ) : (
                        <p className="profile__card--row">Aucune commande</p>
                    )}
                </article>
            </section>

            <section className="profile__section">
                <p className="profile__section--label">Zone dangereuse</p>
                <article className="profile__card bg-third">
                    <Alert openBtnText="Supprimer mon compte" btnClassName="profile__cancel-btn">
                        {({onClose}) => (
                            <DeleteAccount onClose={onClose} />
                        )}
                    </Alert>
                </article>
            </section>
        </main>
    )
}