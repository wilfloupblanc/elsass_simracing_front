import {useGetAuthenticatedUserQuery} from "../store/ApiSlice/authApiSlice.js";

export const useAuthenticated = () => {
    const {data, isLoading, isFetching, isSuccess, isError, refetch} = useGetAuthenticatedUserQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    })
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