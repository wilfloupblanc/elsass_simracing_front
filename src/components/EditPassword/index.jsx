import {Modale} from "../Modale/index.jsx"
import {useEffect, useRef, useState} from "react"
import {useUpdatePasswordMutation} from "../../store/ApiSlice/userApiSlice.js"
import {useDispatch} from "react-redux"
import {showToast} from "../../store/slice/toastSlice.js"
import "./EditPassword.scss"

export const EditPassword = ({btnClassName}) => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })
    const [errors, setErrors] = useState({})
    const [updatePassword, {isLoading, isSuccess, isError, error}] = useUpdatePasswordMutation()
    const dispatch = useDispatch()
    const onCloseRef = useRef(null)

    useEffect(() => {
        if (!isLoading && isSuccess && !error) {
            dispatch(showToast({message: "Mot de passe modifié avec succès !", type: "success"}))
            onCloseRef.current?.()
        }
        if (!isLoading && isError && error) {
            if (error?.status === 401) {
                setErrors({oldPassword: "Mot de passe actuel incorrect."})
            } else {
                dispatch(showToast({message: "Une erreur est survenue, veuillez réessayer !", type: "error"}))
            }
        }
    }, [isSuccess, isError])

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
        setErrors(prev => ({...prev, [e.target.name]: ""}))
    }

    const validate = () => {
        const newErrors = {}
        if (formData.newPassword === formData.oldPassword) {
            newErrors.newPassword = "Le nouveau mot de passe doit être différent de l'ancien"
        }
        if (formData.confirmNewPassword !== formData.newPassword) {
            newErrors.confirmNewPassword = "Les mots de passe ne correspondent pas"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return
        updatePassword({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        })
    }

    return (
        <Modale openBtnText="Modifier le mot de passe" btnClassName={btnClassName}>
            {({onClose}) => {
                onCloseRef.current = onClose
                return (
                    <form onSubmit={handleSubmit} className="edit-password">
                        <div className="edit-password__field">
                            <label>Mot de passe actuel</label>
                            <input type="password" name="oldPassword" onChange={handleChange} />
                            {errors.oldPassword && <p className="edit-password__error">{errors.oldPassword}</p>}
                        </div>
                        <div className="edit-password__field">
                            <label>Nouveau mot de passe</label>
                            <input type="password" name="newPassword" onChange={handleChange} />
                            {errors.newPassword && <p className="edit-password__error">{errors.newPassword}</p>}
                        </div>
                        <div className="edit-password__field">
                            <label>Confirmer le nouveau mot de passe</label>
                            <input type="password" name="confirmNewPassword" onChange={handleChange} />
                            {errors.confirmNewPassword && <p className="edit-password__error">{errors.confirmNewPassword}</p>}
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