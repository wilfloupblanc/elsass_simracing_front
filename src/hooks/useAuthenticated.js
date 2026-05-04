import {useGetAuthenticatedUserQuery} from "../store/ApiSlice/authApiSlice.js";

export const useAuthenticated = () => {
    const {data, isLoading, isFetching, isSuccess, isError, refetch} = useGetAuthenticatedUserQuery()

    return {
        isLoading,
        isFetching,
        isSuccess,
        isError,
        isAuth: !! (!isFetching && !isLoading && data),
        isAdmin: (!isFetching && !isLoading && data?.role === "ROLE_ADMIN" ),
        user: data ?? null,
        reqAuthUser: refetch
    }
}