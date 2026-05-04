import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {hideToast} from "@store/slice/toastSlice.js";
import './Toast.scss'

export const Toast = () => {
    const {isVisible, message, type} = useSelector( state => state.toast)
    const dispatch = useDispatch()

    useEffect(() => {
        if(isVisible) {
            setTimeout(() => {
                dispatch(hideToast())
            }, 3000)
        }
    }, [isVisible]);

    return (
        <>
            {isVisible && <span className={"toast toast-" + type}>{message}</span>}
        </>
    )
}