import {NavLink} from "react-router";
import "./Cancel.scss"

export const Cancel = () => {

    return(
        <main className="cancelMain">
            <h1 className="cancelTitle">Paiement annulé</h1>

            <h2 className="cancelSubtitle">Pas de panique votre panier n'a pas été modifié ou supprimé</h2>

            <div className="cancelButtons">
                <NavLink to="/reservation" className="button bg-third text-secondary">Retourner aux réservations</NavLink>
                <NavLink to="/order/checkout" className="button bg-third text-secondary">Réessayer le paiement</NavLink>
            </div>
        </main>
    )
}