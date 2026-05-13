import {
    MinusIcon, PlusIcon,
    ShoppingCartIcon, SignOutIcon, XCircleIcon
} from "@phosphor-icons/react";
import {NavLink, useLocation, useNavigate} from "react-router";
import logo from "../../assets/images/logoSite2.webp"
import {useEffect, useState} from "react";
import {useAuthenticated} from "../../hooks/useAuthenticated.js";
import {resetApiState, useSignOutMutation} from "../../store/ApiSlice/authApiSlice.js";
import {resetLoggedOut, setIsModalOpen, setLoggedOut} from "../../store/slice/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {AuthForms} from "../AuthForms/index.jsx";
import {
    useDeleteCartItemsMutation,
    useGetCartQuery,
    useUpdateCartItemsMutation
} from "../../store/ApiSlice/cartApiSlice.js";

import "./Header.scss"
import {showToast} from "../../store/slice/toastSlice.js";
import {addItem, decrementitem, removeItem} from "../../store/slice/cartSlice.js";

export const Header = () => {
    const [open, setOpen] = useState(false)
    const [cartOpen, setCartOpen] = useState(false);
    const {isAuth, isLoading} = useAuthenticated()
    const [signOut] = useSignOutMutation()
    const dispatch = useDispatch()
    const handleSignOut = async () => {
        await signOut()
        dispatch(setLoggedOut())
        dispatch(resetApiState())
        dispatch(resetLoggedOut())
    }
    const {data: cartItems } = useGetCartQuery(undefined, { skip: !isAuth })
    const [updateCartItems] = useUpdateCartItemsMutation()
    const [deleteCartItem, {isSuccess}] = useDeleteCartItemsMutation()
    const localCart = useSelector(state => state.disconnectedCart.items)
    const displayedCart = isAuth ? cartItems : localCart
    const totalItems = displayedCart?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if ( !isLoading && isSuccess ) {
            dispatch(showToast({message: "Produit supprimé du panier", type: "error"}))
        }
    }, [isSuccess])

    useEffect(() => {
        setOpen(false)
        setCartOpen(false)
    }, [location.pathname])

    const handleDeleteToCart = (product_id) => {
        if(isAuth){
            deleteCartItem(product_id)
        } else {
            dispatch(removeItem({id: product_id}))
            dispatch(showToast({message: "Produit supprimé du panier", type: "error"}))
        }
    }

    const handleValidate = () => {
        if(!isAuth) {
            dispatch(setIsModalOpen({isModalOpen: true}))
            setCartOpen(false)
        } else {
            navigate("/order/checkout")
        }
    }


    return (
        <header>
            <section className="top bg-third">
                <img src={logo} alt="logo Elsass SimRacing"/>
            </section>
            <section className="bottom bg-third">

                <div className=" bottom__center">
                    <NavLink to="/">Accueil</NavLink>

                    <NavLink to="/tickets">Bon Cadeau</NavLink>

                    <NavLink to="/reservations" className="reservation">Réserver</NavLink>

                    <NavLink to="/subscriptions">Abonnement</NavLink>

                    <button
                        aria-label="button-menu"
                        onClick={() => setOpen(!open)}
                        className="menu"
                    >
                        Menu
                    </button>

                    {open &&
                        <aside className={"sidebar " + (open ? "open" : "")}>
                            <NavLink to="/coaching" onClick={() => setOpen(false)}>Coaching</NavLink>
                            <NavLink to="/events" onClick={() => setOpen(false)}>Evénements</NavLink>
                            <NavLink to="/privatization" onClick={() => setOpen(false)}>Privatisation</NavLink>
                            <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
                            <NavLink to="/prices" onClick={() => setOpen(false)}>Tarifs</NavLink>
                            {isAuth &&
                                <NavLink to="/profile/profile" onClick={() => setOpen(false)}>Profil</NavLink>
                            }
                        </aside>
                    }

                </div>

                <div className="bottom__right">
                    {!isAuth && <AuthForms/>}

                    {isAuth && <SignOutIcon size={32} onClick={handleSignOut} className="text-secondary"/>}

                    <button onClick={() => setCartOpen(!cartOpen)} id="btn-cart" aria-label="button-cart">
                        <ShoppingCartIcon size={32} className="text-secondary cart" />
                        {totalItems > 0 &&
                            <span className="cart-badge">{totalItems}</span>
                        }
                    </button>
                    <aside className={"sidebar " + (cartOpen ? "open" : "") + ((!displayedCart || displayedCart.length === 0) ? " empty" : "")}  id="cart-panel">
                        {(!displayedCart || displayedCart?.length === 0) &&
                            <h2 className="text-secondary">Panier Vide</h2>
                        }
                        {displayedCart && displayedCart.length > 0 &&
                            displayedCart?.map((displayedCart) => (
                                <section key={displayedCart.id} className="cart-item-mini bg-third">

                                    <article className="cart-item-mini-details">
                                        <div className="cart-item-mini-label">
                                            <h3 className="text-light">{displayedCart.label ?? `Ticket ${displayedCart.duration_minutes} minutes`}</h3>
                                        </div>
                                        <div className="cart-item-mini-info">
                                            <span className="text-secondary price">{(displayedCart.price ?? displayedCart.price_normal)?.toFixed(2)} €</span>
                                        </div>
                                        <div className="cart-item-mini-quantity">
                                            <MinusIcon
                                                onClick={() => {
                                                    if(isAuth) {
                                                        displayedCart.quantity === 1
                                                            ? deleteCartItem(displayedCart.id)
                                                            : updateCartItems({id: displayedCart.id, quantity: displayedCart.quantity - 1})
                                                    } else {
                                                        dispatch(decrementitem({id: displayedCart.id}))
                                                    }
                                                }}
                                                size={22} className="text-secondary"
                                            />
                                            <span className="text-secondary">{displayedCart.quantity}</span>
                                            <PlusIcon
                                                onClick={() => {
                                                    if(isAuth) {
                                                        updateCartItems({id: displayedCart.id, quantity: displayedCart.quantity + 1})
                                                    } else {
                                                        dispatch(addItem({id: displayedCart.id, label: displayedCart.label, price: displayedCart.price, quantity: 1}))
                                                    }
                                                }}
                                                size={22} className="text-secondary"
                                            />
                                        </div>
                                    </article>

                                    <button className="btn-remove-mini" onClick={() => handleDeleteToCart(displayedCart.id)}>
                                        <XCircleIcon size={25} className="text-error"/>
                                    </button>
                                </section>
                            ))}
                        {displayedCart && displayedCart.length > 0 &&
                            <button onClick={handleValidate} className="validate-cart text-secondary">
                                Valider mon panier
                            </button>
                        }
                    </aside>
                </div>
            </section>
        </header>
    )
}
