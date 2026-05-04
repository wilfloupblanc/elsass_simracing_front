import {Modale} from "../Modale/index.jsx"
import {useEffect, useRef, useState} from "react"
import {useUpdateEmailMutation} from "../../store/ApiSlice/userApiSlice.js"
import {useDispatch} from "react-redux"
import {showToast} from "../../store/slice/toastSlice.js"

import "../EditPassword/EditPassword.scss"

export const EditEmail = ({btnClassName}) => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [updateEmail, {isLoading, isSuccess, isError}] = useUpdateEmailMutation()
    const dispatch = useDispatch()
    const onCloseRef = useRef(null)

    useEffect(() => {
        if (isSuccess) {
            dispatch(showToast({message: "Email modifié avec succès !", type: "success"}))
            onCloseRef.current?.()
        }
        if (isError) {
            setError("Cet email est déjà utilisé.")
        }
    }, [isSuccess, isError])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email) {
            setError("Veuillez saisir un email.")
            return
        }
        updateEmail({ email })
    }

    return (
        <Modale openBtnText="Modifier l'email" btnClassName={btnClassName}>
            {({onClose}) => {
                onCloseRef.current = onClose
                return (
                    <form onSubmit={handleSubmit} className="edit-password">
                        <div className="edit-password__field">
                            <label>Nouvel email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError("") }}
                            />
                            {error && <p className="edit-password__error">{error}</p>}
                        </div>
                        <button type="submit" className="bg-primary text-secondary" style={{border: "none"}} disabled={isLoading}>
                            Valider
                        </button>
                    </form>
                )
            }}
        </Modale>
    )
}