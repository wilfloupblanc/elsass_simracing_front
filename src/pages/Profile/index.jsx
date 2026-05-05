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

    const isPendingCancellation = subscription?.status === "pending_cancellation"

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
                                        {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')} à {currentPlan?.price.toFixed(2)}€/mois
                                    </span>
                                </p>
                            )}

                            {freeSession &&
                                <p className="profile__card--row">
                                    <span>Session offerte</span>
                                    <span className="text-success">15 min disponible – expire le {new Date(freeSession.expires_at).toLocaleDateString('fr-FR')}</span>
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