import "./Maintenance.scss"

export const Maintenance = () => {
    return (
        <main className="maintenance">
            <div className="maintenance__spinner" />
            <h1 className="maintenance__title">Site en maintenance</h1>
            <p className="maintenance__text">Nous effectuons des travaux. Revenez bientôt !</p>
        </main>
    )
}