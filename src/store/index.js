import {configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {authApiSlice} from "./ApiSlice/authApiSlice.js";
import {userApiSlice} from "./ApiSlice/userApiSlice.js";
import {authSlice} from "./slice/authSlice.js";
import {toastSlice} from "./slice/toastSlice.js";
import {availabilityApiSlice} from "./ApiSlice/availabilityApiSlice.js";
import {sessionApiSlice} from "./ApiSlice/sessionApiSlice.js";
import {cartSlice} from "./slice/cartSlice.js";
import {cartApiSlice} from "./ApiSlice/cartApiSlice.js";
import {contactApiSlice} from "./ApiSlice/contactApiSlice.js";
import {bookingApiSlice} from "./ApiSlice/bookingApiSlice.js";
import {orderApiSlice} from "./ApiSlice/orderApiSlice.js";
import {cartItemRecipientApiSlice} from "./ApiSlice/cartItemRecipientApiSlice.js";
import {subscriptionApiSlice} from "./ApiSlice/subscriptionApiSlice.js";
import {giftVoucherApiSlice} from "./ApiSlice/giftVoucherApiSlice.js";
import {planApiSlice} from "./ApiSlice/planApiSlice.js";
import {eventApiSlice} from "./ApiSlice/eventApiSlice.js";
import {discountApiSlice} from "./ApiSlice/discountApiSlice.js";

const persistConfig = {
    key: "disconnectedCart",
    storage,
}
const persistAuthConfig = {
    key: "auth",
    storage,
    whitelist: ["isLoggedOut"]
}

const persistedAuthReducer = persistReducer(persistAuthConfig, authSlice.reducer)
const persistedCartReducer = persistReducer(persistConfig, cartSlice.reducer)

const store = configureStore({
    reducer: {
        authApi: authApiSlice.reducer,
        userApi: userApiSlice.reducer,
        auth: persistedAuthReducer,
        toast: toastSlice.reducer,
        availability: availabilityApiSlice.reducer,
        session: sessionApiSlice.reducer,
        disconnectedCart: persistedCartReducer,
        cartApi: cartApiSlice.reducer,
        contactApi: contactApiSlice.reducer,
        bookingApi: bookingApiSlice.reducer,
        orderApi: orderApiSlice.reducer,
        cartItemRecipientApi: cartItemRecipientApiSlice.reducer,
        subscriptionApi: subscriptionApiSlice.reducer,
        giftVoucherApi: giftVoucherApiSlice.reducer,
        planApi: planApiSlice.reducer,
        eventApi: eventApiSlice.reducer,
        discountApi: discountApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(authApiSlice.middleware, userApiSlice.middleware, availabilityApiSlice.middleware, sessionApiSlice.middleware, cartApiSlice.middleware, contactApiSlice.middleware, bookingApiSlice.middleware, orderApiSlice.middleware, cartItemRecipientApiSlice.middleware, subscriptionApiSlice.middleware, giftVoucherApiSlice.middleware, planApiSlice.middleware, eventApiSlice.middleware, discountApiSlice.middleware),
})

export const persistor = persistStore(store)
export default store