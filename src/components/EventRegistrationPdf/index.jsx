import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import logo from "../../assets/images/logoSite2.png"

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica" },
    logoContainer: { backgroundColor: "#1a1a1a", padding: 10, marginBottom: 20, alignSelf: "center", borderRadius: 8 },
    logo: { width: 120, marginBottom: 20, alignSelf: "center" },
    title: { fontSize: 22, textAlign: "center", marginBottom: 6 },
    subtitle: { fontSize: 13, textAlign: "center", marginBottom: 20, color: "#555" },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, marginBottom: 8, borderBottom: "1px solid #000", paddingBottom: 4 },
    row: { fontSize: 11, marginBottom: 4 },
    total: { fontSize: 14, marginTop: 10, fontWeight: "bold" },
    qrCode: { width: 120, height: 120 },
    qrSection: { alignItems: "center", marginTop: 24 },
    qrLabel: { fontSize: 10, marginTop: 6, textAlign: "center", color: "#555" },
})

export const EventRegistrationPdf = ({ eventReservation, order, qrUrl }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image src={logo} style={styles.logo} />
                </View>
                <Text style={styles.title}>Elsass SimRacing</Text>
                <Text style={styles.subtitle}>Confirmation d'inscription événement</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations commande</Text>
                    <Text style={styles.row}>Commande n°: {order?.order_number}</Text>
                    <Text style={styles.row}>Date: {new Date(order?.created_at).toLocaleDateString('fr-FR')}</Text>
                    <Text style={styles.row}>Client: {order?.firstname} {order?.lastname}</Text>
                    <Text style={styles.row}>Statut: {order?.is_member === 1 ? "Membre" : "Non membre"}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Événement</Text>
                    <Text style={styles.row}>Événement : {eventReservation?.event_title}</Text>
                    <Text style={styles.row}>
                        Date : {new Date(eventReservation?.event_date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}
                    </Text>
                    <Text style={styles.row}>
                        Horaires : {eventReservation?.event_start_time?.slice(0, 5)} – {eventReservation?.event_end_time?.slice(0, 5)}
                    </Text>
                    <Text style={styles.row}>Pilotes : {eventReservation?.quantity}</Text>
                </View>
                <Text style={styles.total}>Total : {order?.amount?.toFixed(2)} €</Text>
                {qrUrl &&
                    <View style={styles.qrSection}>
                        <Image src={qrUrl} style={styles.qrCode} />
                        <Text style={styles.qrLabel}>Scanner à l'accueil le jour de l'événement</Text>
                    </View>
                }
            </Page>
        </Document>
    )
}