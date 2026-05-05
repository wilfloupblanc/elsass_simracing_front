import video_promo from "../../assets/videos/video_promo.mov"
//import video_desktop from "../../assets/videos/video_test-desktop.mp4"
import wheel from "../../assets/images/volant.png"
import sim from "../../assets/images/sim.webp"
import gt3 from "../../assets/images/gt3.png"
import formula from "../../assets/images/formula.png"
import hypercar from "../../assets/images/hypercar.png"
import drift from "../../assets/images/drift.png"
import "./Home.scss"
import {ArrowCircleDownIcon, GreaterThanIcon} from "@phosphor-icons/react";
import {NavLink} from "react-router";

export const Home = () => {

    return (
        <main className="home">
            <section className="videomobile">
                <video src={video_promo} autoPlay={true} loop={true} muted={true}></video>
                <a href="#promotion" aria-label="descends vers la section de promotion du SimRacing">
                    <ArrowCircleDownIcon size={50} className="text-secondary"/>
                </a>
            </section>
            <section className="videodesktop">
                {/*<video src={video_desktop} autoPlay={true} loop={true} muted={true}></video>*/}
                <img src={wheel} alt="image d'un volant de simulateur"/>
            </section>
            <section className="promotion" id="promotion">
                <img src={sim} alt="Image simulateur noir et blanc"/>
                <div className="infos">
                    <h2 className="text-secondary">Une nouvelle génération de sport automobile !</h2>
                    <p className="text-secondary">
                        Plongez au cœur du simracing et vivez l’émotion de la course comme jamais auparavant. Grâce à nos simulateurs professionnels dernière génération, chaque virage, chaque accélération et chaque dépassement vous offrent des sensations dignes des plus grands circuits.
                    </p>
                    <p className="text-secondary">
                        Que vous soyez débutant ou pilote confirmé, venez relever le défi en solo, entre amis ou lors de nos événements spéciaux avec lots à gagner ! Un loisir accessible à tous, alliant compétition, immersion et convivialité.
                    </p>
                    <p className="text-secondary">
                        Rejoignez-nous et découvrez l’avenir du sport automobile… aujourd’hui.
                    </p>

                    <NavLink to="/prices" className="prices-button">Tarifs <GreaterThanIcon size={16} /></NavLink>
                </div>

            </section>

            <section className="categories bg-third">
                <div className="car">
                    <img src={gt3} alt="image GT3 car"/>
                    <p className="text-primary">GT</p>
                </div>
                <div className="car">
                    <img src={formula} alt="image formula car"/>
                    <p className="text-primary">Formula</p>
                </div>
                <div className="car">
                    <img src={hypercar} alt="image hypercar car"/>
                    <p className="text-primary">LMDH</p>
                </div>
                <div className="car">
                    <img src={drift} alt="image drift car"/>
                    <p className="text-primary">Drift</p>
                </div>
            </section>
        </main>
    )
}