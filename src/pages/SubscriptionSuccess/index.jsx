import { useGetMySubscriptionQuery } from "../../store/ApiSlice/subscriptionApiSlice"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { SubscriptionPdf } from "../../components/SubscriptionPdf"

export const SubscriptionSuccess = () => {
    const { data, isLoading } = useGetMySubscriptionQuery()
    const subscription = data?.subscription ?? null

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })

    return (
        <main>
            <h1>Abonnement confirmé</h1>

            {!isLoading && subscription && (
                <section>
                    <p>Formule : {subscription.plan}</p>
                    <p>Statut : {subscription.status === "active" ? "Actif" : subscription.status}</p>
                    <p>Prix mensuel : {parseFloat(subscription.price).toFixed(2)} €</p>
                    <p>Sessions offertes restantes : {subscription.free_sessions_remaining}</p>
                    <p>Début de période : {formatDate(subscription.current_period_start)}</p>
                    <p>Fin de période : {formatDate(subscription.current_period_end)}</p>
                </section>
            )}

            {!isLoading && subscription && (
                <PDFDownloadLink
                    document={<SubscriptionPdf subscription={subscription} />}
                    fileName={`abonnement-${subscription.plan}-${subscription.stripe_subscription_id}.pdf`}
                >
                    <p>Télécharger ma confirmation d'abonnement</p>
                </PDFDownloadLink>
            )}
        </main>
    )
}