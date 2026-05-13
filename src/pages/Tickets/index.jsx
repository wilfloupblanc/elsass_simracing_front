import {TicketItem} from "../../components/TicketItem/index.jsx";
import {addItem} from "@store/slice/cartSlice.js"
import {useGetAllSessionsQuery} from "../../store/ApiSlice/sessionApiSlice.js";
import {useState} from "react";
import {useDispatch} from "react-redux";
import "./Tickets.scss"
import {useAddCartItemsMutation} from "../../store/ApiSlice/cartApiSlice.js";
import {useAuthenticated} from "../../hooks/useAuthenticated.js";
import {showToast} from "@store/slice/toastSlice.js";

export const Tickets = () => {
    const {data: sessions, isLoading} = useGetAllSessionsQuery()
    const dispatch = useDispatch();
    const [quantities, setQuantities] = useState({})
    const {isAuth} = useAuthenticated()
    const [addCartItems] = useAddCartItemsMutation()

    const handleQuantityChange = (id, value) => {
        setQuantities({...quantities, [id]: value})
    }

    const hasItems = Object.values(quantities).some(q => q > 0)

    const handleAddToCart = async () => {
        try {
            sessions?.sessions?.forEach(s => {
                if(quantities[s.id] > 0) {
                    if(isAuth) {
                        addCartItems({ session_id: s.id, quantity: quantities[s.id] })
                    } else {
                        dispatch(addItem({
                            id: s.id,
                            label: `Ticket ${s.duration_minutes} minutes`,
                            price: s.price_normal,
                            quantity: quantities[s.id]
                        }))
                    }
                }
            })
            setQuantities({})
            dispatch(showToast({ message: "Bons cadeaux ajoutés au panier !", type: "success" }))
        } catch {
            dispatch(showToast({ message: "Une erreur est survenue, veuillez réessayer !", type: "error" }))
        }
    }

    return (
        <main className="tickets">
            <section className="tickets__title">
                <h1>Nos Bons Cadeaux</h1>
            </section>
            <section className="tickets__infos">
                <p>Offrez l'adrénaline au volant — 15, 30, 45 ou 60 minutes de sensations pures sur nos simulateurs de course professionnels. Nos bons cadeaux nominatifs sont disponibles sans limite de quantité : parfaits pour les anniversaires, Noël, ou juste parce que certains méritent de mordre la piste. Choisissez la durée, on s'occupe du reste.</p>
            </section>
            <section className="tickets__card">
                {isLoading ? (
                    <>
                        <div className="ticket-skeleton" />
                        <div className="ticket-skeleton" />
                        <div className="ticket-skeleton" />
                        <div className="ticket-skeleton" />
                    </>
                ) : (
                    sessions?.sessions?.map((ticket) => (
                        <TicketItem
                            key={ticket.id}
                            label={`Ticket ${ticket.duration_minutes} minutes`}
                            price={`${ticket.price_normal.toFixed(2)}`}
                            quantity={quantities[ticket.id] || 0}
                            setQuantity={(value) => handleQuantityChange(ticket.id, value)}
                        />
                    ))
                )}
                <div className="addToCart">
                    <button disabled={!hasItems} onClick={handleAddToCart} className={`bg-primary text-secondary ${!hasItems ? `disabled` : ``}`}>Ajouter au panier</button>
                </div>
            </section>
        </main>
    )
}

