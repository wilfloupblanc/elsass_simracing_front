import {NavLink} from "react-router";

export const SubscriptionCancel = () => {
    return (
        <main className="cancelMain">
            <h1 className="cancelTitle">Paiement annulé</h1>
            <h2 className="cancelSubtitle">Pas de panique, aucun abonnement n'a été souscrit</h2>
            <div className="cancelButtons">
                <NavLink to="/subscriptions" className="button bg-third text-secondary">Retourner aux abonnements</NavLink>
                <NavLink to="/subscriptions" className="button bg-third text-secondary">Réessayer</NavLink>
            </div>
        </main>
    )
}