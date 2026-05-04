import {useAuthenticated} from "../../hooks/useAuthenticated.js";
import {Outlet, useLocation, useNavigate} from "react-router";
import {useGetRefreshTokenMutation} from "@store/ApiSlice/authApiSlice.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {resetLoggedOut} from "@store/slice/authSlice.js";

export const ProtectedRoutes = () => {
    const navigate = useNavigate()
    const [refreshToken] = useGetRefreshTokenMutation()
    const isLoggedOut = useSelector(state => state.auth.isLoggedOut)
    const dispatch = useDispatch()
    const location = useLocation()
    const {isAuth, isLoading, isFetching} = useAuthenticated()

    useEffect(() => {
        if(isLoading || isFetching) return
        if(!isAuth && !isLoggedOut) {
            refreshToken()
        }
        if(!isAuth && isLoggedOut) {
            dispatch(resetLoggedOut())
            navigate("/")
            return;
        }
    }, [isAuth, isLoading, isFetching, location])

    return <Outlet />
}