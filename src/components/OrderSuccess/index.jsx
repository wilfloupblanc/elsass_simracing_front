import {useGetLastOrderQuery} from "../../store/ApiSlice/orderApiSlice.js"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderPdf } from "../OrderPdf"
import {useLocation} from "react-router"
import {GiftVoucherPdf} from "../GiftVoucherPdf/index.jsx"
import {FreeSessionPdf} from "../FreeSessionPdf/index.jsx"
import {EventRegistrationPdf} from "../EventRegistrationPdf/index.jsx";
import {BookingConfirmationPdf} from "../BookingConfirmationPdf/index.jsx";
import {useEffect, useState, useMemo} from "react";
import QRCode from "qrcode/lib/browser"

export const OrderSuccess = () => {
    const {data, isLoading} = useGetLastOrderQuery()
    const lastOrderId = data?.orders?.[0]?.order_id
    const {state: locationState} = useLocation()
    const isPayOnSite = locationState?.pay_on_site ?? false
    const isFreeSession = locationState?.use_free_session ?? false
    const freeSessionData = locationState?.free_session_data ?? null
    const bookingData = locationState?.booking_data
        ? { ...locationState.booking_data, booking_id: locationState.booking_id }
        : null
    const isEvent = !isPayOnSite && data?.orders?.some(o => o.event_id !== null && o.order_id === lastOrderId)
    const eventReservation = data?.orders?.find(o => o.event_id !== null && o.order_id === lastOrderId)
    const reservation = !isEvent && !isPayOnSite
        ? data?.orders?.find(o => o.booking_id !== null && o.order_id === lastOrderId)
        : null
    const vouchers = useMemo(() => {
        return !isEvent && !isPayOnSite
            ? data?.orders?.filter(o => o.booking_id === null && o.order_id === lastOrderId)
            : []
    }, [data, isEvent, isPayOnSite, lastOrderId])

    const [reservationQrUrl, setReservationQrUrl] = useState(null)
    const [qrUrls, setQrUrls] = useState({})
    const [eventQrUrl, setEventQrUrl] = useState(null)
    const [bookingQrUrl, setBookingQrUrl] = useState(null)
    const [freeSessionQrUrl, setFreeSessionQrUrl] = useState(null)

    useEffect(() => {
        if (isLoading || !reservation?.booking_id) return
        QRCode.toDataURL(`${import.meta.env.VITE_APP_URL}/admin/booking/${reservation.booking_id}`)
            .then(url => setReservationQrUrl(url))
    }, [reservation, isLoading])

    useEffect(() => {
        if (isLoading || !vouchers?.length) return
        vouchers.forEach(v => {
            if (!v.gift_voucher_qr_code) return
            QRCode.toDataURL(v.gift_voucher_qr_code).then(url => {
                setQrUrls(prev => ({ ...prev, [v.gift_voucher_qr_code]: url }))
            })
        })
    }, [vouchers, isLoading])

    useEffect(() => {
        if (isLoading || !eventReservation?.booking_id) return
        QRCode.toDataURL(`${import.meta.env.VITE_APP_URL}/admin/booking/${eventReservation.booking_id}`)
            .then(url => setEventQrUrl(url))
    }, [eventReservation, isLoading])

    useEffect(() => {
        if (isLoading || !bookingData?.booking_id) return
        QRCode.toDataURL(`${import.meta.env.VITE_APP_URL}/admin/booking/${bookingData.booking_id}`)
            .then(url => setBookingQrUrl(url))
    }, [bookingData, isLoading])

    useEffect(() => {
        if (isLoading || !freeSessionData?.booking_id) return
        QRCode.toDataURL(`${import.meta.env.VITE_APP_URL}/admin/booking/${freeSessionData.booking_id}`)
            .then(url => setFreeSessionQrUrl(url))
    }, [freeSessionData, isLoading])

    const freeSessionPdfDoc = useMemo(() => (
        <FreeSessionPdf freeSessionData={freeSessionData} user={locationState?.user} qrUrl={freeSessionQrUrl} />
    ), [freeSessionQrUrl])

    const orderPdfDoc = useMemo(() => (
        <OrderPdf orders={data?.orders} reservation={reservation} vouchers={vouchers} qrUrl={reservationQrUrl} />
    ), [reservationQrUrl, data?.orders, reservation, vouchers])

    const eventPdfDoc = useMemo(() => (
        <EventRegistrationPdf eventReservation={eventReservation} order={data?.orders?.[0]} qrUrl={eventQrUrl} />
    ), [eventQrUrl])

    const bookingPdfDoc = useMemo(() => (
        <BookingConfirmationPdf bookingData={bookingData} user={locationState?.user} qrUrl={bookingQrUrl} />
    ), [bookingQrUrl])

    const voucherPdfDocs = useMemo(() => (
        vouchers?.map(v => ({
            voucher: v,
            doc: <GiftVoucherPdf voucher={v} order={data?.orders?.[0]} qrUrl={qrUrls[v.gift_voucher_qr_code]} />
        }))
    ), [qrUrls, vouchers])

    return (
        <>
            {!isLoading && !isFreeSession && !isPayOnSite && data?.orders?.[0] &&
                <section>
                    <p>Commande n°: {data.orders[0].order_number}</p>
                    <p>Date de commande: {new Date(data.orders[0].created_at).toLocaleDateString('fr-FR')}</p>
                    <p>Total: {data.orders[0].amount.toFixed(2)} €</p>
                    <p>{data.orders[0].firstname} {data.orders[0].lastname}</p>
                </section>
            }

            {isFreeSession && freeSessionData &&
                <section>
                    <p>Réservation confirmée</p>
                    <p>Date: {freeSessionData.date}</p>
                    <p>Heure: {freeSessionData.time}</p>
                    <p>Durée: {freeSessionData.duration} minutes</p>
                    <p>Nombre de pilote(s): {freeSessionData.pilots}</p>
                    <p>Session membre offerte – Gratuit</p>
                </section>
            }

            {isPayOnSite && bookingData &&
                <section>
                    <h2>Réservation confirmée</h2>
                    <p>Date: {bookingData.date}</p>
                    <p>Heure: {bookingData.time}</p>
                    <p>Durée: {bookingData.duration} minutes</p>
                    <p>Nombre de pilote(s): {bookingData.pilots}</p>
                    <p>Prix: {bookingData.price.toFixed(2)} €</p>
                    <p>Paiement sur place</p>
                </section>
            }

            {isEvent && eventReservation && (
                <section>
                    <h2>Inscription événement</h2>
                    <p>Événement : {eventReservation.event_title}</p>
                    <p>Date : {new Date(eventReservation.event_date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
                    <p>Horaires : {eventReservation.event_start_time?.slice(0, 5)} – {eventReservation.event_end_time?.slice(0, 5)}</p>
                    <p>Total : {data.orders[0].amount.toFixed(2)} €</p>
                </section>
            )}

            {!isEvent && !isPayOnSite && reservation &&
                <section>
                    <h2>Réservation</h2>
                    <p>Date: {new Date(reservation.date).toLocaleDateString('fr-FR', {timeZone: 'Europe/Paris'})}</p>
                    <p>Heure: {reservation.start_time}</p>
                    <p>Durée: {reservation.duration_minutes} minutes</p>
                    <p>Nombre de pilote(s): {reservation.quantity}</p>
                    <p>Prix: {reservation.price_each.toFixed(2)} €</p>
                </section>
            }

            {isFreeSession && freeSessionData &&
                <PDFDownloadLink
                    document={freeSessionPdfDoc}
                    fileName={`session-gratuite-${freeSessionData.date}.pdf`}
                >
                    {({ loading }) => (
                        <p>{loading || !freeSessionQrUrl ? "Génération en cours..." : "Télécharger mon bon de session gratuite"}</p>
                    )}
                </PDFDownloadLink>
            }

            {!isEvent && !isPayOnSite && !isFreeSession && voucherPdfDocs?.length > 0 && voucherPdfDocs.map((item, index) =>
                <PDFDownloadLink
                    key={index}
                    document={item.doc}
                    fileName={`bon-cadeau-${item.voucher.recipient_name}-${item.voucher.gift_voucher_qr_code}.pdf`}
                >
                    {({ loading }) => (
                        <p>{loading || !qrUrls[item.voucher.gift_voucher_qr_code] ? "Génération en cours..." : `Télécharger le bon cadeau – ${item.voucher.recipient_name}`}</p>
                    )}
                </PDFDownloadLink>
            )}

            {!isEvent && !isPayOnSite && !isLoading && data?.orders?.[0] &&
                <PDFDownloadLink
                    document={orderPdfDoc}
                    fileName={`facture-${data.orders[0].order_number}`}
                >
                    {({ loading }) => (
                        <p>{loading || (reservation && !reservationQrUrl) ? "Génération en cours..." : "Télécharger la facture"}</p>
                    )}
                </PDFDownloadLink>
            }

            {isEvent && eventReservation && !isLoading && data?.orders?.[0] && (
                <PDFDownloadLink
                    document={eventPdfDoc}
                    fileName={`inscription-evenement-${eventReservation.event_title}-${data.orders[0].order_number}.pdf`}
                >
                    {({ loading }) => (
                        <p>{loading || !eventQrUrl ? "Génération en cours..." : "Télécharger ma confirmation d'inscription"}</p>
                    )}
                </PDFDownloadLink>
            )}

            {isPayOnSite && !isFreeSession && bookingData &&
                <PDFDownloadLink
                    document={bookingPdfDoc}
                    fileName={`reservation-${bookingData.date}-${bookingData.time}.pdf`}
                >
                    {({ loading }) => (
                        <p>{loading || !bookingQrUrl ? "Génération en cours..." : "Télécharger ma confirmation de réservation"}</p>
                    )}
                </PDFDownloadLink>
            }
        </>
    )
}