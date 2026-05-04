import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: []
}

export const cartSlice = createSlice({
    name: "disconnectedCart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if(existingItem){
                existingItem.quantity++
            } else {
                state.items.push(action.payload)
            }
        },
        decrementitem: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if(existingItem){
                if(existingItem.quantity - 1 === 0){
                    state.items = state.items.filter(item => item.id !== action.payload.id)
                } else {
                    existingItem.quantity--
                }
            } else {
                state.items.push(action.payload)
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id)
        },
        clearCart: (state) => {
            state.items = []
        }
    }
})

export const {addItem, removeItem, clearCart, decrementitem} = cartSlice.actions
export default cartSlice.reducer