import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLoggedOut: true,
    isLoginModal: true,
    isModalOpen: false,
    pendingReservation: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoggedOut: (state) => {
            state.isLoggedOut = false
        },
        resetLoggedOut: (state) => {
            state.isLoggedOut = false
        },
        toggleIsLoginModal: (state) => {
            state.isLoginModal = !state.isLoginModal
        },
        setIsLoginModal: (state, action) => {
            state.isLoginModal = action.payload.isLoginModal
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload.isModalOpen
        },
        setPendingReservation: (state, action) => {
            state.pendingReservation = action.payload
        },
        clearPendingReservation: (state, action) => {
            state.pendingReservation = null
        }
    }
})

export const {setLoggedOut, resetLoggedOut, toggleIsLoginModal, setIsLoginModal, setIsModalOpen, setPendingReservation, clearPendingReservation} = authSlice.actions;
export default authSlice.reducer