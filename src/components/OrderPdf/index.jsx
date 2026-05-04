import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import QRCode from "qrcode/lib/browser"
import { useEffect, useState } from "react"
import logo from "../../assets/images/logo_e_simracing.png"

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica" },
    title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, marginBottom: 8, borderBottom: "1px solid #000", paddingBottom: 4 },
    row: { fontSize: 11, marginBottom: 4 },
    total: { fontSize: 14, marginTop: 10 },
    qrCode: { width: 100, height: 100 },
    qrSection: { alignItems: "center", marginTop: 20 },
    qrLabel: { fontSize: 10, marginTop: 6, textAlign: "center" },
    logoContainer: { backgroundColor: "#1a1a1a", padding: 10, marginBottom: 20, alignSelf: "center", borderRadius: 8 },
    logo: { width: 120, marginBottom: 20, alignSelf: "center" }
})

export const OrderPdf = ({ orders, reservation, vouchers }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null)
    const order = orders?.[0]

    useEffect(() => {
        if (!reservation) return
        const qrData = `${import.meta.env.VITE_APP_URL}/admin/booking/${reservation.booking_id}`
        QRCode.toDataURL(qrData).then(url => setQrCodeUrl(url))
    }, [reservation])

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image src={logo} style={styles.logo} />
                </View>
                <Text style={styles.title}>Elsass SimRacing</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations commande</Text>
                    <Text style={styles.row}>Commande n°: {order?.order_number}</Text>
                    <Text style={styles.row}>Date: {new Date(order?.created_at).toLocaleDateString('fr-FR')}</Text>
                    <Text style={styles.row}>Client: {order?.firstname} {order?.lastname}</Text>
                    <Text style={styles.row}>Statut: {order?.is_member === 1 ? "Membre" : "Non membre"}</Text>
                </View>

                {reservation &&
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Réservation</Text>
                        <Text style={styles.row}>Date: {new Date(reservation.date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}</Text>
                        <Text style={styles.row}>Heure: {reservation.start_time}</Text>
                        <Text style={styles.row}>Durée: {reservation.duration_minutes} minutes</Text>
                        <Text style={styles.row}>Pilotes: {reservation.quantity}</Text>
                        <Text style={styles.row}>Prix: {reservation.price_each?.toFixed(2)}€</Text>
                    </View>
                }

                {vouchers?.length > 0 &&
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Bons cadeaux</Text>
                        {vouchers.map((v, index) =>
                            <View key={index}>
                                <Text style={styles.row}>Destinataire: {v.recipient_name}</Text>
                                <Text style={styles.row}>Durée: {v.duration_minutes} minutes — Prix: {v.price_each?.toFixed(2)}€</Text>
                            </View>
                        )}
                    </View>
                }

                <Text style={styles.total}>Total: {order?.amount?.toFixed(2)}€</Text>

                {qrCodeUrl &&
                    <View style={styles.qrSection}>
                        <Image src={qrCodeUrl} style={styles.qrCode} />
                        <Text style={styles.qrLabel}>Scanner à l'accueil</Text>
                    </View>
                }
            </Page>
        </Document>
    )
}