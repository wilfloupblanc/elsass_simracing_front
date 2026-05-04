import {useDeleteUserMutation} from "../../store/ApiSlice/userApiSlice.js"
import {useDispatch} from "react-redux"
import {useNavigate} from "react-router"
import {useEffect} from "react"
import {setLoggedOut} from "../../store/slice/authSlice.js"
import {showToast} from "../../store/slice/toastSlice.js"
import {useAuthenticated} from "../../hooks/useAuthenticated.js"
import {useSignOutMutation} from "../../store/ApiSlice/authApiSlice.js"

export const DeleteAccount = ({ onClose }) => {
    const {user} = useAuthenticated()
    const [deleteUser, {isSuccess, isError}] = useDeleteUserMutation()
    const [signOut] = useSignOutMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleDelete = () => {
        deleteUser({ id: user?.id })
    }

    useEffect(() => {
        if (isSuccess) {
            const doLogout = async () => {
                await signOut()
                dispatch(showToast({ message: "Compte supprimé avec succès !", type: "success" }))
                dispatch(setLoggedOut())
                navigate("/")
            }
            doLogout()
        }
        if (isError) {
            dispatch(showToast({ message: "Une erreur est survenue, veuillez réessayer !", type: "error" }))
        }
    }, [isSuccess, isError])

    return (
        <>
            <p>Cette action est irréversible. Toutes vos données seront supprimées.</p>
            <button className="bg-error text-secondary" style={{border: "none"}} onClick={handleDelete}>
                Oui, supprimer mon compte
            </button>
            <button onClick={onClose} style={{border: "none"}}>
                Non, annuler
            </button>
        </>
    )
}