import { useCookieConsent } from "../../hooks/useCookieConsent";
import "./CookieBanner.scss";

export const CookieBanner = () => {
    const { consent, accept, reject } = useCookieConsent();

    if (consent !== null) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-banner__content">
                <p>
                    🍪 On utilise des cookies pour améliorer ton expérience.
                    Les cookies nécessaires au fonctionnement du site sont toujours actifs.
                </p>
                <div className="cookie-banner__actions">
                    <button className="cookie-banner__btn cookie-banner__btn--reject" onClick={reject}>
                        Refuser
                    </button>
                    <button className="cookie-banner__btn cookie-banner__btn--accept" onClick={accept}>
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
};

