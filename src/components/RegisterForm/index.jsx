import {Input} from "@components/Input/index.jsx";
import {authApiSlice, useSignUpMutation} from "../../store/ApiSlice/authApiSlice.js";
import {useEffect, useState} from "react";
import './RegisterForm.scss'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {clearPendingReservation} from "../../store/slice/authSlice.js";
import {useSyncCart} from "../../hooks/useSyncCart.js";

export const RegisterForm = ({toggle, onClose}) => {

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerUser, {isLoading, isSuccess, isError}] = useSignUpMutation()
    const dispatch = useDispatch()
    const {pendingReservation} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const { syncCart, isLocalCart } = useSyncCart()

    useEffect(() => {
        if (!isLoading && isSuccess) {
            const hasLocalCart = isLocalCart.length > 0
            if (hasLocalCart) syncCart()
            dispatch(authApiSlice.util.invalidateTags(["auth"]))

            if (pendingReservation?.type === 'event') {
                dispatch(clearPendingReservation())
                onClose()
                setTimeout(() => {
                    navigate("/events")
                }, 500)
            } else {
                setTimeout(() => {
                    if (pendingReservation || hasLocalCart) {
                        navigate("/order/checkout", { state: pendingReservation })
                    }
                }, 500)
                dispatch(clearPendingReservation())
                onClose()
            }
        }
    }, [isSuccess, isError])


    return (
        <section className="modale-content">
            <h2>Inscription</h2>

            <form
                action=""
                onSubmit={(e) => {
                    e.preventDefault()
                    registerUser({firstname, lastname, email, password, confirm_password: confirmPassword}),
                        setFirstname(""),
                        setLastname(""),
                        setEmail(""),
                        setPassword(""),
                        setConfirmPassword("")
                }}
                className="register-form"
            >
                <Input inputName="firstname" value={firstname} inputType="firstname" labelText="Prénom" onChange={(e) => setFirstname(e.target.value)}/>
                <Input inputName="lastname" value={lastname} inputType="lastname" labelText="Nom de Famille" onChange={(e) => setLastname(e.target.value)}/>
                <Input inputName="email" value={email} inputType="email" labelText="Email" inputComplete="email" onChange={(e) => setEmail(e.target.value)}/>
                <Input inputName="password" value={password} inputType="password" labelText="Mot de passe" inputComplete="off" onChange={(e) => setPassword(e.target.value)}/>
                <Input inputName="confirm_password" value={confirmPassword} inputType="password" labelText="Confirmer mot de passe" inputComplete="off" onChange={(e) => setConfirmPassword(e.target.value)}/>

                <button
                    type="submit"
                    className="submit"
                >
                    S'inscrire
                </button>
            </form>

            <div className="pratique-register">
                <button type="button" onClick={() => {toggle()}} className="text-secondary">Déjà Inscrit ?</button>
            </div>

        </section>
    )
}