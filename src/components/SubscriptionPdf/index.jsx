import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff",
    },
    header: {
        marginBottom: 30,
        borderBottom: "2px solid #245E97",
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontFamily: "Helvetica-Bold",
        color: "#245E97",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 11,
        color: "#666666",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: "#1a1a2e",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottom: "1px solid #f0f0f0",
    },
    label: {
        fontSize: 10,
        color: "#666666",
    },
    value: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#1a1a2e",
    },
    badge: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        padding: "4 10",
        borderRadius: 4,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        alignSelf: "flex-start",
    },
    planBadge: {
        backgroundColor: "#e63946",
        color: "#ffffff",
        padding: "6 14",
        borderRadius: 4,
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        alignSelf: "flex-start",
        marginBottom: 16,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 9,
        color: "#aaaaaa",
        borderTop: "1px solid #eeeeee",
        paddingTop: 12,
    },
})

export const SubscriptionPdf = ({ subscription, user }) => {
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Elsass SimRacing</Text>
                    <Text style={styles.subtitle}>Confirmation d'abonnement</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Formule souscrite</Text>
                    <Text style={styles.planBadge}>{subscription.plan}</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Statut</Text>
                        <Text style={[styles.value, { color: "#2e7d32" }]}>
                            {subscription.status === "active" ? "Actif" : subscription.status}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Prix mensuel</Text>
                        <Text style={styles.value}>{parseFloat(subscription.price).toFixed(2)} €</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Sessions offertes restantes</Text>
                        <Text style={styles.value}>{subscription.free_sessions_remaining}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Période en cours</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Début</Text>
                        <Text style={styles.value}>{formatDate(subscription.current_period_start)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fin</Text>
                        <Text style={styles.value}>{formatDate(subscription.current_period_end)}</Text>
                    </View>
                </View>

                {user && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Titulaire</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nom</Text>
                            <Text style={styles.value}>{user.firstname} {user.lastname}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Référence</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>ID Stripe</Text>
                        <Text style={styles.value}>{subscription.stripe_subscription_id}</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Elsass SimRacing — Haguenau, Alsace — Ce document fait foi de votre abonnement actif.
                </Text>
            </Page>
        </Document>
    )
}