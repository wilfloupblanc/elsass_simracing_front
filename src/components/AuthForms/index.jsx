import {Modale} from "@components/Modale";
import {UserCircleIcon} from "@phosphor-icons/react";
import {LoginForm} from "@components/LoginForm";
import {RegisterForm} from "@components/RegisterForm";
import {useDispatch, useSelector} from "react-redux";
import {setIsLoginModal, setIsModalOpen, toggleIsLoginModal} from "../../store/slice/authSlice.js";

export const AuthForms = () => {
    const {isLoginModal: login} = useSelector(state => state.auth);
    const {isModalOpen} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    return (
        <Modale forceOpen={isModalOpen} onClose={() => dispatch(setIsModalOpen({isModalOpen: false}))} onOpen={() => dispatch(setIsLoginModal({isLoginModal: true}))} openBtnText={<UserCircleIcon size={32} aria-label="button-connection" className="text-secondary"/>}>
            {({ onClose }) => (
                <>
                    {login && <LoginForm toggle={() => dispatch(toggleIsLoginModal())} onClose={onClose} />}
                    {!login && <RegisterForm toggle={() => dispatch(toggleIsLoginModal())} onClose={onClose} />}
                </>
            )}
        </Modale>
    )
}