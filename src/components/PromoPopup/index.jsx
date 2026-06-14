import { useState } from 'react'

import "./PromoPopup.scss"

export function PromoPopup({ promo, onDismiss }) {
    const [copied, setCopied] = useState(false)

    if (!promo) return null

    const handleCopy = () => {
        navigator.clipboard.writeText(promo.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const label = promo.type === 'percent'
        ? `${promo.value}% de réduction`
        : `${promo.value}€ de réduction`

    return (
        <div className="promo-overlay" onClick={onDismiss}>
            <div className="promo-popup" onClick={e => e.stopPropagation()}>
                <button className="promo-popup__close" onClick={onDismiss} aria-label="Fermer">✕</button>

                <p className="promo-popup__eyebrow">Offre limitée</p>
                <h2 className="promo-popup__title">Code promo disponible !</h2>
                <p className="promo-popup__desc">
                    Profitez de <strong>{label}</strong> sur votre prochaine session.
                    {promo.expires_at && (
                        <> Valable jusqu'au {new Date(promo.expires_at).toLocaleDateString('fr-FR')}.</>
                    )}
                </p>

                <div className="promo-popup__code">
                    <span>{promo.code}</span>
                    <button onClick={handleCopy}>{copied ? '✓ Copié' : 'Copier'}</button>
                </div>

                <button className="promo-popup__dismiss" onClick={onDismiss}>
                    Ne plus afficher
                </button>
            </div>
        </div>
    )
}