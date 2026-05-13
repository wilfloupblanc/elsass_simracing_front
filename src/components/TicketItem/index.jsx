import {MinusIcon, PlusIcon} from "@phosphor-icons/react";

import "./TicketItem.scss"

export const TicketItem = ({label, price, quantity, setQuantity}) => {

    return (
        <article className="ticket-item">
            <h2>{label}</h2>
            <span>{price} €</span>
            <div className="ticket-item__quantity">
                <button
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity === 0}
                    aria-label="Minus button"
                >
                    <MinusIcon size={32} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Plus button">
                    <PlusIcon size={32} />
                </button>
            </div>
        </article>
    )
}