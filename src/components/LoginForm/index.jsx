import {useEffect, useState} from 'react';
import {Input} from "../Input"
import {useSignInMutation} from "../../store/ApiSlice/authApiSlice.js";
import './LoginForm.scss'
import {resetLoggedOut} from "@store/slice/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {showToast} from "@store/slice/toastSlice.js";
import {NavLink, useNavigate} from "react-router";
import {clearPendingReservation} from "../../store/slice/authSlice.js";
import {useSyncCart} from "../../hooks/useSyncCart.js";

export const LoginForm = ({toggle, onClose}) => {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [loginUser, {data, isLoading, isSuccess, isError}] = useSignInMutation()
    const dispatch = useDispatch()
    const {pendingReservation} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const { syncCart, isLocalCart } = useSyncCart()

    useEffect(() => {
        if (!isLoading && isSuccess && data?.user) {
            dispatch(resetLoggedOut())
            dispatch(showToast({ message: "Vous êtes bien authentifié !", type: "success" }))
            const hasLocalCart = isLocalCart.length > 0
            if (hasLocalCart) syncCart()

            if (pendingReservation?.type === 'event') {
                dispatch(clearPendingReservation())
                onClose()
                navigate("/events")
                dispatch(showToast({ message: "Vous pouvez maintenant vous inscrire à l'événement !", type: "success" }))
            } else if (pendingReservation || hasLocalCart) {
                navigate("/order/checkout", { state: pendingReservation })
                dispatch(clearPendingReservation())
                onClose()
            } else {
                onClose()
            }
        }
        if (!isLoading && isError) {
            dispatch(showToast({ message: "Une erreur est survenue, veuillez réessayer !", type: "error" }))
        }
    }, [isSuccess, isError])


    return (
        <article className="modal-content">

            <h2>Connexion</h2>

            <form
                action=""
                onSubmit={(e) => {
                    e.preventDefault()
                    loginUser({email: loginEmail, password: loginPassword})
                    setLoginEmail("")
                    setLoginPassword("")
                }}
                className="login-form"
            >
                <Input
                    inputName="email"
                    value={loginEmail}
                    inputType="email"
                    labelText="Email"
                    inputComplete="email"
                    onChange={(e) => setLoginEmail(e.target.value)}
                />

                <Input
                    inputName="password"
                    value={loginPassword}
                    inputType="password"
                    labelText="Mot de passe"
                    inputComplete="off"
                    onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button type="submit" className="submit">Confirmer</button>
            </form>

            <div className="pratique">
                <button type="button" onClick={() => {toggle()}} className="text-secondary">Pas encore Inscrit ?</button>
                <NavLink to="/forgot-password" onClick={onClose} className="text-secondary">Mot de passe oublié ?</NavLink>
            </div>

        </article>
    )
}