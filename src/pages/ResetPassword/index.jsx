import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { useResetPasswordMutation } from "../../store/ApiSlice/authApiSlice.js"
import "./ResetPassword.scss"

export const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token") ?? ""
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [clientError, setClientError] = useState("")

    const [resetPassword, { isLoading, isSuccess, isError }] = useResetPasswordMutation()

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => navigate("/"), 2000)
        }
    }, [isSuccess])

    const handleSubmit = async () => {
        setClientError("")
        if (!token) return setClientError("Lien invalide.")
        if (password.length < 8) return setClientError("Le mot de passe doit faire au moins 8 caractères.")
        if (password !== confirm) return setClientError("Les mots de passe ne correspondent pas.")
        await resetPassword({ token, password })
    }

    if (!token) {
        return <p className="reset-password__error">Lien de réinitialisation invalide ou manquant.</p>
    }

    return (
        <main className="reset-password">
            <div className="reset-password__card bg-third">
                <h1 className="reset-password__title">Nouveau mot de passe</h1>

                {isSuccess ? (
                    <p className="reset-password__success text-success">
                        Mot de passe mis à jour ! Redirection en cours...
                    </p>
                ) : (
                    <div className="reset-password__form">
                        <input
                            className="reset-password__input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                        />
                        <input
                            className="reset-password__input"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Confirmer le mot de passe"
                        />
                        {clientError && <p className="reset-password__error">{clientError}</p>}
                        {isError && (
                            <p className="reset-password__error text-error">
                                Token invalide ou expiré. Refais une demande.
                            </p>
                        )}
                        <button
                            className="reset-password__btn bg-primary text-secondary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Mise à jour..." : "Valider"}
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}