import { useParams } from "react-router"
import { useGetBookingByIdQuery } from "../../store/ApiSlice/bookingApiSlice.js"
import { useGetAuthenticatedUserQuery } from "../../store/ApiSlice/authApiSlice.js"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { BookingConfirmationPdf } from "../../components/BookingConfirmationPdf/index.jsx"

export const BookingConfirmation = () => {
    const { id } = useParams()
    const { data, isLoading } = useGetBookingByIdQuery(id)
    const { data: authUser } = useGetAuthenticatedUserQuery()
    const booking = data?.booking

    const bookingData = booking ? {
        booking_id: booking.id,
        date: new Date(booking.date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }),
        time: booking.start_time,
        duration: booking.session?.duration_minutes,
        pilots: booking.pilots,
        price: booking.price_paid
    } : null

    if (isLoading) return <p>Chargement...</p>
    if (!booking) return <p>Réservation introuvable</p>

    return (
        <main>
            <h1>Confirmation de réservation</h1>
            <section>
                <p>Date : {bookingData?.date}</p>
                <p>Heure : {bookingData?.time}</p>
                <p>Durée : {bookingData?.duration} minutes</p>
                <p>Pilotes : {bookingData?.pilots}</p>
                <p>Prix : {booking.price_paid === 0 ? 'Gratuit' : `${booking.price_paid?.toFixed(2)} €`}</p>
                <p>Statut : {booking.status === 'pending_payment' ? 'Paiement sur place' : booking.status === 'confirmed' ? 'Confirmée' : booking.status}</p>
            </section>
            {bookingData && authUser &&
                <PDFDownloadLink
                    document={<BookingConfirmationPdf bookingData={bookingData} user={authUser} />}
                    fileName={`reservation-${bookingData.date}.pdf`}
                >
                    <p>Télécharger ma confirmation</p>
                </PDFDownloadLink>
            }
        </main>
    )
}