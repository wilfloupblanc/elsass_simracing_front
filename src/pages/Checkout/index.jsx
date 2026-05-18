import {useLocation, useNavigate} from "react-router";
import {useGetAllSessionsQuery} from "../../store/ApiSlice/sessionApiSlice.js";
import {useGetAuthenticatedUserQuery} from "../../store/ApiSlice/authApiSlice.js";
import {useDeleteCartItemsMutation, useGetCartQuery} from "../../store/ApiSlice/cartApiSlice.js";

import "./Checkout.scss"
import {useCheckoutMutation} from "../../store/ApiSlice/orderApiSlice.js";
import {useCreateBookingMutation} from "../../store/ApiSlice/bookingApiSlice.js";
import {useEffect, useMemo, useState} from "react";
import {useAddRecipientMutation} from "../../store/ApiSlice/cartItemRecipientApiSlice.js";
import {useGetFreeSessionQuery} from "../../store/ApiSlice/giftVoucherApiSlice.js";

export const Checkout = () => {

    const {state} = useLocation()
    const {data: cart} = useGetCartQuery()
    const {data: sessions} = useGetAllSessionsQuery()
    const {data: authUser} = useGetAuthenticatedUserQuery()
    const [checkout, {isLoading}] = useCheckoutMutation()
    const session = state ? sessions?.sessions?.find(s => s.duration_minutes === state.duration) : null
    const [createBooking, {isLoading: isLoadingBooking}] = useCreateBookingMutation()
    const navigate = useNavigate()
    const [recipients, setRecipients] = useState({})
    const [saveRecipient] = useAddRecipientMutation()
    const { data: freeSessionData } = useGetFreeSessionQuery(undefined, { skip: authUser?.is_member !== 1 })
    const freeSession = freeSessionData?.freeSessionsRemaining > 0
    const [useFreeSession, setUseFreeSession] = useState(false)
    const isEvent = state?.type === 'event'
    const hasMemberPrice = authUser?.is_member === 1 && authUser?.plan !== "STARTER"
    const price = isEvent
        ? state?.event_price ?? 0
        : state
            ? (hasMemberPrice
                ? session ? (session.price_member + (state.pilots - 1) * session.price_normal) : 0
                : session ? session.price_normal * state.pilots : 0)
            : 0
    const cartTotal = cart?.reduce((acc, item) => acc + (hasMemberPrice ? item.price_member : item.price_normal) * item.quantity, 0) ?? 0
    const totalCheckout = price + cartTotal
    const [deleteCartItem] = useDeleteCartItemsMutation()

    const recipientsFilled = !cart || cart.length === 0 || cart.every(item =>
        (recipients[item.id] ?? []).length >= item.quantity &&
        recipients[item.id].every(r => r.firstname.trim() && r.lastname.trim() && r.email.trim())
    )

    const removeItem = (cartItemId) => {
        deleteCartItem(cartItemId)
    }

    const addRecipient = (cartItemId) => {
        setRecipients(prev => ({
            ...prev,
            [cartItemId]: [...(prev[cartItemId] ?? [{ firstname: "", lastname: "", email: "" }]), { firstname: "", lastname: "", email: "" }]
        }))
    }

    const updateRecipient = (cartItemId, index, field, value) => {
        setRecipients(prev => ({
            ...prev,
            [cartItemId]: prev[cartItemId].map((r, i) => i === index ? { ...r, [field]: value } : r)
        }))
    }

    const removeRecipient = (cartItemId, index) => {
        setRecipients(prev => ({
            ...prev,
            [cartItemId]: prev[cartItemId].filter((_, i) => i !== index)
        }))
    }

    const initialRecipients = useMemo(() => {
        if (!cart) return {}
        return Object.fromEntries(
            cart.map(item => [item.id, [{ firstname: "", lastname: "", email: "" }]])
        )
    }, [cart])

    useEffect(() => {
        setRecipients(initialRecipients)
    }, [initialRecipients])

    const handleBooking = async () => {
        if (cart) {
            for (const item of cart) {
                for (const recipient of recipients[item.id] ?? []) {
                    await saveRecipient({
                        cart_item_id: item.id,
                        firstname: recipient.firstname,
                        lastname: recipient.lastname,
                        email: recipient.email
                    })
                }
            }
        }

        const result = await checkout({
            availability_id: isEvent ? null : state?.slot?.id ?? null,
            session_id: isEvent ? null : session?.id ?? null,
            pilots: isEvent ? null : state?.pilots ?? null,
            event_id: isEvent ? state?.event_id ?? null : null,
            event_price: isEvent ? state?.event_price ?? null : null,
            event_title: isEvent ? state?.event_title ?? null : null,
            pilots_count: isEvent ? state?.pilots_count ?? null : null,
            selected_vehicle: isEvent ? state?.selected_vehicle ?? null : null,
        })
        window.location.assign(result.data.url)
    }

    const handlePayOnSite = async () => {
        if (isEvent) {
            console.log('Paiement sur place événement', state)
            return
        }

        const result = await createBooking({
            availability_id: state?.slot?.id ?? null,
            session_id: useFreeSession ? null : session?.id ?? null,
            pilots: state?.pilots ?? 1,
            gift_voucher_id: null,
            pay_on_site: !useFreeSession,
            use_free_session: useFreeSession
        }).unwrap()

        navigate("/order/success", {
            state: {
                pay_on_site: true,
                booking_id: result.savedBooking.id,
                use_free_session: useFreeSession,
                free_session_data: useFreeSession ? {
                    date: state.date,
                    time: state.slot.time,
                    duration: 15,
                    pilots: state.pilots ?? 1,
                    booking_id: result.savedBooking.id
                } : null,
                booking_data: !useFreeSession ? {
                    date: state.date,
                    time: state.slot.time,
                    duration: state.duration,
                    pilots: state.pilots ?? 1,
                    price: price
                } : null,
                user: authUser
            }
        })
    }

    return (
        <main className="checkout">

            <h1>Résumé de la commande</h1>

            <section className="checkout__items">
                {state && !isEvent && (
                    <>
                        <h2>Réservation :</h2>
                        <article className="checkout__items--reservation">
                            <p>Date: {state.date}</p>
                            <p>Heure de début de session: {state.slot.time}</p>
                            <p>Durée de la session: {state.duration} Minutes</p>
                            <p>Nombre de pilote(s): {state.pilots}</p>
                            {hasMemberPrice ? (
                                state.pilots > 1 ? (
                                    <>
                                        <p>1 pilote (membre) : {session?.price_member.toFixed(2)} €</p>
                                        <p>{state.pilots - 1} pilote(s) x {session?.price_normal.toFixed(2)} € : {((state.pilots - 1) * session?.price_normal).toFixed(2)} € TTC</p>
                                    </>
                                ) : (
                                    <p>1 pilote (membre) : {session?.price_member.toFixed(2)} € TTC</p>
                                )
                            ) : (
                                <p>{state.pilots} x {session?.price_normal.toFixed(2)} € : {price.toFixed(2)} € TTC</p>
                            )}
                            <h3>Total réservations: {price.toFixed(2)} € TTC</h3>
                        </article>
                    </>
                )}

                {state && isEvent && (
                    <>
                        <h2>Inscription événement :</h2>
                        <article className="checkout__items--reservation">
                            <p>Événement : {state.event_title}</p>
                            <p>Date : {new Date(state.event_date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
                            <p>Horaires : {state.event_start_time?.slice(0, 5)} — {state.event_end_time?.slice(0, 5)}</p>
                            <p>Pilotes : {state.pilots_count}</p>
                            {state.selected_vehicle && (
                                <p>Véhicule : {state.selected_vehicle}</p>
                            )}
                            {state.pilots_list?.map((p, i) => (
                                <p key={i}>Pilote {i + 1} : {p.firstname} {p.lastname}</p>
                            ))}
                            <h3>Total : {state.event_price} € TTC</h3>
                        </article>
                    </>
                )}
                {cart && cart.length > 0 &&
                    <>
                        <h2>Bons Cadeaux :</h2>
                        {cart.map(item => (
                            <article key={item.id} className="checkout__items--ticket">
                                <p>Ticket {item.duration_minutes} minutes</p>
                                <p>{item.quantity} x {(item.price_normal).toFixed(2)} €</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="checkout__remove-item"
                                >
                                    Supprimer
                                </button>

                                {recipients[item.id]?.map((recipient, index) => (
                                    <div key={index} className="checkout__items--recipient">
                                        <p>Destinataire {index + 1}</p>
                                        <input
                                            type="text"
                                            placeholder="Prénom"
                                            value={recipient.firstname}
                                            onChange={e => updateRecipient(item.id, index, "firstname", e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            value={recipient.lastname}
                                            onChange={e => updateRecipient(item.id, index, "lastname", e.target.value)}
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={recipient.email}
                                            onChange={e => updateRecipient(item.id, index, "email", e.target.value)}
                                        />
                                        {index > 0 &&
                                            <button
                                                className="checkout__remove-recipient"
                                                onClick={() => removeRecipient(item.id, index)}
                                            >
                                                Supprimer
                                            </button>
                                        }
                                    </div>
                                ))}

                                {recipients[item.id]?.length < item.quantity &&
                                    <button onClick={() => addRecipient(item.id)} className="checkout__add-recipient">
                                        + Ajouter un destinataire
                                    </button>
                                }
                            </article>
                        ))}
                        <h3>Total bons cadeaux: {cart.reduce((acc, item) => acc + (item.price_normal) * item.quantity, 0).toFixed(2)} € TTC</h3>
                    </>
                }

                <h3>Total: {totalCheckout.toFixed(2)} € TTC</h3>

                {state && (!cart || cart.length === 0) && freeSession && !isEvent &&
                    <button
                        onClick={() => setUseFreeSession(!useFreeSession)}
                        className={useFreeSession ? "bg-primary text-secondary submit" : "checkout__pay-on-site"}
                    >
                        {useFreeSession
                            ? "✓ Session gratuite sélectionnée"
                            : `Utiliser une session gratuite (${freeSessionData.freeSessionsRemaining} restante(s))`
                        }
                    </button>
                }

                {state && (!cart || cart.length === 0) && !isEvent && !useFreeSession &&
                    <button
                        onClick={handlePayOnSite}
                        disabled={isLoadingBooking}
                        className="checkout__pay-on-site"
                    >
                        {isLoadingBooking ? "Chargement..." : "Payer sur place"}
                    </button>
                }

                <button
                    onClick={useFreeSession ? handlePayOnSite : handleBooking}
                    disabled={isLoading || isLoadingBooking || !recipientsFilled}
                    className="bg-third text-secondary submit"
                >
                    {useFreeSession ? "Confirmer la session gratuite" : "Procéder au paiement"}
                </button>

                {cart && cart.length > 0 && !recipientsFilled && (
                    <p className="checkout__warning text-error">
                        Veuillez renseigner tous les destinataires de bons cadeaux avant de procéder au paiement.
                    </p>
                )}
                <p className="checkout-infos">✔ Aucun paiement débité avant confirmation</p>
                <p className="checkout-infos">
                    🔒 Paiement sécurisé vous serez redirigé vers Stripe pour finaliser votre paiement
                </p>
            </section>
        </main>
    )
}