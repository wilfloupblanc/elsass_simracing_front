import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import logo from "../../assets/images/logoSite2.png"

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica" },
    logoContainer: { backgroundColor: "#1a1a1a", padding: 10, marginBottom: 20, alignSelf: "center", borderRadius: 8 },
    logo: { width: 120 },
    title: { fontSize: 22, textAlign: "center", marginBottom: 6 },
    subtitle: { fontSize: 14, textAlign: "center", marginBottom: 30, color: "#666" },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, marginBottom: 8, borderBottom: "1px solid #000", paddingBottom: 4 },
    row: { fontSize: 12, marginBottom: 6 },
    badge: { fontSize: 12, textAlign: "center", color: "#245e97", marginBottom: 20 },
    qrCode: { width: 150, height: 150 },
    qrSection: { alignItems: "center", marginTop: 30 },
    qrLabel: { fontSize: 10, marginTop: 8, textAlign: "center", color: "#666" }
})

export const FreeSessionPdf = ({ freeSessionData, user, qrUrl }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image src={logo} style={styles.logo} />
                </View>
                <Text style={styles.title}>Elsass SimRacing</Text>
                <Text style={styles.subtitle}>Session offerte – Membre Club SimRacing</Text>
                <Text style={styles.badge}>Avantage membre mensuel</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Détails de la session</Text>
                    <Text style={styles.row}>Date : {freeSessionData?.date}</Text>
                    <Text style={styles.row}>Heure : {freeSessionData?.time}</Text>
                    <Text style={styles.row}>Durée : {freeSessionData?.duration} minutes</Text>
                    <Text style={styles.row}>Pilotes : {freeSessionData?.pilots}</Text>
                    <Text style={styles.row}>Prix : Gratuit</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Membre</Text>
                    <Text style={styles.row}>{user?.firstname} {user?.lastname}</Text>
                    <Text style={styles.row}>{user?.email}</Text>
                </View>
                {qrUrl &&
                    <View style={styles.qrSection}>
                        <Image src={qrUrl} style={styles.qrCode} />
                        <Text style={styles.qrLabel}>Scanner à l'accueil le jour de la session</Text>
                    </View>
                }
            </Page>
        </Document>
    )
}