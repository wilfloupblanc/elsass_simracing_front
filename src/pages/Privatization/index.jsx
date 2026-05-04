import {NavLink} from "react-router";
import {GreaterThanIcon} from "@phosphor-icons/react";
import enterprise from "@assets/images/entreprises.png"
import particular from "@assets/images/particuliers.jpg"

import "./Privatization.scss"

export const Privatization = () => {

    return (
        <main className="privatization">
            <section className="privatization__title">
                <h1>Pourquoi privatiser un centre de simulation pour vos soirées</h1>
            </section>

            <section className="privatization__enterprise">
                <h2>Entreprise</h2>

                <article className="privatization__enterprise--infos">
                    <p>La privatisation de notre centre de simulation vous permet d’offrir à vos collaborateurs une expérience unique et mémorable. Transformez vos événements professionnels en véritables moments forts : team building, challenges, incentives ou soirées d’entreprise.</p>
                    <p>Dans un environnement immersif et dynamique, chacun peut prendre le volant, se dépasser et partager des sensations intenses, quel que soit son niveau. Une activité originale, conviviale et fédératrice, idéale pour renforcer la cohésion d’équipe et marquer durablement les esprits.</p>

                    <NavLink to="/contact" state={{ subject: "Privatisation" }}>Obtenir un devis <GreaterThanIcon size={22}/> </NavLink>
                </article>

                <img src={enterprise} alt="image privatisation entreprise"/>
            </section>

            <section className="privatization__particular">
                <h2>Particulier</h2>

                <article className="privatization__particular--infos">
                    <p>La privatisation de notre centre de simulation vous permet de vivre un moment unique entre amis ou en famille. Anniversaire, enterrement de vie de célibataire ou simple envie de partager une expérience originale : transformez votre événement en souvenir inoubliable.</p>
                    <p>Dans une ambiance immersive et conviviale, chacun peut prendre le volant, se challenger et profiter de sensations fortes, quel que soit son niveau. Une activité ludique et accessible, parfaite pour passer un moment hors du commun et créer des souvenirs mémorables.</p>

                    <NavLink to="/contact" state={{ subject: "Privatisation" }}>Obtenir un devis <GreaterThanIcon size={22}/> </NavLink>
                </article>

                <img src={particular} alt="image privatisation particulier"/>
            </section>
        </main>
    )
}