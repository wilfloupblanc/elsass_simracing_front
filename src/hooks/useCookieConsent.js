import { useState, useEffect } from "react";

export const useCookieConsent = () => {
    const [consent, setConsent] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("cookie_consent");
        if (stored) setConsent(stored);
    }, []);

    const accept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setConsent("accepted");
    };

    const reject = () => {
        localStorage.setItem("cookie_consent", "rejected");
        setConsent("rejected");
    };

    return { consent, accept, reject };
};