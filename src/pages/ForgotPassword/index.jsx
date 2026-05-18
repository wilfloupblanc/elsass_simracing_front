import { useState } from "react"
import { NavLink } from "react-router"
import { useForgotPasswordMutation } from "../../store/ApiSlice/authApiSlice.js"
import "./ForgotPassword.scss"

export const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [forgotPassword, { isLoading, isSuccess, isError }] = useForgotPasswordMutation()

    const handleSubmit = async () => {
        if (!email) return
        await forgotPassword({ email })
    }

    return (
        <main className="forgot-password">
            <div className="forgot-password__card bg-third">
                <h1 className="forgot-password__title">Mot de passe oublié</h1>

                {isSuccess ? (
                    <div className="forgot-password__success">
                        <p className="forgot-password__success-message text-success">
                            Si cet email est reconnu, un lien de réinitialisation a été envoyé.
                        </p>
                        <NavLink to="/" className="forgot-password__back-link">
                            Retour à la connexion
                        </NavLink>
                    </div>
                ) : (
                    <div className="forgot-password__form">
                        <p className="forgot-password__hint">
                            Saisis ton adresse email pour recevoir un lien de réinitialisation.
                        </p>
                        <input
                            className="forgot-password__input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ton adresse email"
                        />
                        {isError && (
                            <p className="forgot-password__error text-error">
                                Une erreur est survenue, réessaie.
                            </p>
                        )}
                        <button
                            className="forgot-password__btn bg-primary text-secondary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Envoi..." : "Envoyer le lien"}
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}