import {NavLink} from "react-router";
import "./Footer.scss"
import {CopyrightIcon, EnvelopeIcon, PhoneIcon} from "@phosphor-icons/react";

export const Footer = () => {
    return (
        <footer className="footer bg-primary">
            <div className="footer__content">
                <section className="footer__contact container bg-third">
                    <h2 className="text-primary">Contact</h2>
                    <div className="footer__links">
                        <NavLink
                            to="https://www.google.com/maps/place/Elsass+Simracing+Haguenau/@48.8157744,7.7911357,17z/data=!3m1!4b1!4m6!3m5!1s0x4796eb564df70ebb:0x4de1a49a3104eae1!8m2!3d48.8157744!4d7.7937106!16s%2Fg%2F11xp6ns6l5?entry=ttu&g_ep=EgoyMDI2MDQyOS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            11 rue des Dominicains 67500 Haguenau
                        </NavLink>
                        <a href="mailto:Elsass.Simracing@gmail.com"
                        >
                            <EnvelopeIcon size={22} />
                            Elsass.Simracing@gmail.com
                        </a>
                        <a href="tel:+33640583619">
                            <PhoneIcon size={22} />
                            06.40.58.36.19
                        </a>
                    </div>
                </section>
                <section className="footer__link container bg-third">
                    <h2 className="text-primary">Lien</h2>
                    <div className="footer__links">
                        <NavLink to="/events">Évènements à venir</NavLink>
                    </div>
                </section>
                <section className="footer__explore container bg-third">
                    <h2 className="text-primary">Explorer</h2>
                    <div className="footer__links">
                        <NavLink to="/cgu">C.G.U</NavLink>
                        <NavLink to="/cgv">C.G.V</NavLink>
                        <NavLink to="/mentions-legales">Mentions Légales</NavLink>
                        <NavLink to="/politique-confidentialite">Politique de Confidentialité</NavLink>
                        <NavLink to="/politique-cookies">Politique Cookies</NavLink>
                    </div>
                </section>
            </div>
            <div className="footer__copyright bg-third">
                <p className="text-secondary">
                    <CopyrightIcon size={20} />
                    ZAUG Julien - Tous droits Réservés
                </p>
            </div>
        </footer>
    )
}