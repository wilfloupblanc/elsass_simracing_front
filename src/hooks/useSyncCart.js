import {useDispatch, useSelector} from "react-redux";
import {useAddCartItemsMutation} from "@store/ApiSlice/cartApiSlice.js";
import {clearCart} from "@store/slice/cartSlice.js";

export const useSyncCart = () => {
    const isLocalCart = useSelector(state => state.disconnectedCart.items)
    const [addCartItems] = useAddCartItemsMutation()
    const dispatch = useDispatch()
    const syncCart = () => {
        isLocalCart.forEach(item => {
            addCartItems({ session_id: item.id, quantity: item.quantity })
        })
        dispatch(clearCart())
    }

    return{
        addCartItems,
        isLocalCart,
        syncCart
    }
}