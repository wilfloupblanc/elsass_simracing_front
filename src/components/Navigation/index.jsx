import {NavLink, useLocation} from "react-router";
import {HouseIcon, IdentificationBadgeIcon, ListIcon, TicketIcon, CalendarDotsIcon} from "@phosphor-icons/react";

import "./Navigation.scss"
import {useEffect, useState} from "react";
import {useAuthenticated} from "../../hooks/useAuthenticated.js";

export const Navigation = () => {

    const [open, setOpen] = useState(false)
    const {isAuth} = useAuthenticated()
    const location = useLocation()

    useEffect(() => {
        setOpen(false)
    }, [location.pathname])


    return (
        <section className="navigation bg-third">
            <article className="navigation__left">
                <div className="navigation__left__icons">
                    <NavLink to="/">
                        <HouseIcon size={32} />
                        Accueil
                    </NavLink>
                </div>
                <div className="navigation__left__icons">
                    <NavLink to="/tickets">
                        <TicketIcon size={32} />
                        Bon Cadeau
                    </NavLink>
                </div>
            </article>
            <div className="navigation__before">
                <NavLink to="/reservations">
                    <CalendarDotsIcon size={32} />
                    Réserver
                </NavLink>
            </div>
            <article className="navigation__right">
                <div className="navigation__right__icons">
                    <NavLink to="/subscriptions">
                        <IdentificationBadgeIcon size={32} />
                        Abonnement
                    </NavLink>
                </div>
                <div className="navigation__right__icons">
                    <button
                        onClick={() => setOpen(!open)}
                    >
                        <ListIcon size={32} />
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
            </article>
        </section>
    )
}