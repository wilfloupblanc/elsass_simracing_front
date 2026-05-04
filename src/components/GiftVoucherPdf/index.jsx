import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import QRCode from "qrcode/lib/browser"
import { useEffect, useState } from "react"
import logo from "../../assets/images/logo_e_simracing.png"

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica" },
    title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
    subtitle: { fontSize: 14, textAlign: "center", marginBottom: 30, color: "#666" },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, marginBottom: 8, borderBottom: "1px solid #000", paddingBottom: 4 },
    row: { fontSize: 12, marginBottom: 6 },
    qrCode: { width: 150, height: 150 },
    qrSection: { alignItems: "center", marginTop: 30 },
    qrLabel: { fontSize: 10, marginTop: 8, textAlign: "center", color: "#666" },
    logoContainer: { backgroundColor: "#1a1a1a", padding: 10, marginBottom: 20, alignSelf: "center", borderRadius: 8 },
    logo: { width: 120, marginBottom: 20, alignSelf: "center" }
})

export const GiftVoucherPdf = ({ voucher, order }) => {
    const [qrUrl, setQrUrl] = useState(null)

    useEffect(() => {
        if (!voucher?.gift_voucher_qr_code) return
        QRCode.toDataURL(voucher.gift_voucher_qr_code).then(url => setQrUrl(url))
    }, [voucher])

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image src={logo} style={styles.logo} />
                </View>
                <Text style={styles.title}>Elsass SimRacing</Text>
                <Text style={styles.subtitle}>Bon cadeau</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Destinataire</Text>
                    <Text style={styles.row}>Nom: {voucher?.recipient_name}</Text>
                    <Text style={styles.row}>Email: {voucher?.recipient_email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Session</Text>
                    <Text style={styles.row}>Durée: {voucher?.duration_minutes} minutes</Text>
                    <Text style={styles.row}>Valeur: {voucher?.price_each?.toFixed(2)}€</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Offert par</Text>
                    <Text style={styles.row}>{order?.firstname} {order?.lastname}</Text>
                    <Text style={styles.row}>Le: {new Date(order?.created_at).toLocaleDateString('fr-FR')}</Text>
                </View>

                {qrUrl &&
                    <View style={styles.qrSection}>
                        <Image src={qrUrl} style={styles.qrCode} />
                        <Text style={styles.qrLabel}>À présenter à l'accueil le jour de la session</Text>
                    </View>
                }
            </Page>
        </Document>
    )
}