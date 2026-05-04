import {Input} from "../../components/Input/index.jsx";
import {useState} from "react";
import {useSendMailMutation} from "../../store/ApiSlice/contactApiSlice.js";
import {useLocation} from "react-router";

import "./Contact.scss"

export const Contact = () => {
    const location = useLocation()
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        subject: location.state?.subject || "Contact",
        message: ""
    })

    const [sendMail, {isLoading}] = useSendMailMutation()
    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await sendMail(formData).unwrap()
            setFormData({firstname: "", lastname: "", email: "", phone: "", subject: "", message: ""})
        } catch (error) {
            console.log("Erreur lors de l'envoi:", error)
        }
    }

    return(
        <main className="contact">
            <section className="contact__title">
                <h1 className="text-secondary">Contact</h1>
            </section>

            <form onSubmit={handleSubmit}>
                <div className="name-row">
                    <Input
                        inputName="firstname"
                        labelText="Prénom"
                        inputType="text"
                        inputComplete="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />

                    <Input
                        inputName="lastname"
                        labelText="Nom"
                        inputType="text"
                        inputComplete="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                </div>

                <Input
                    inputName="email"
                    labelText="E-mail"
                    inputType="email"
                    inputComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <Input
                    inputName="phone"
                    labelText="N° de téléphone"
                    inputType="tel"
                    inputComplete="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <div className="subject-row text-secondary">
                    <label>Objet :</label>

                    <label>
                        <input
                            type="radio"
                            name="subject"
                            value="Contact"
                            checked={formData.subject === "Contact"}
                            onChange={handleChange}
                        />
                        Contact
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="subject"
                            value="Privatisation"
                            checked={formData.subject === "Privatisation"}
                            onChange={handleChange}
                        />
                        Privatisation
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="subject"
                            value="Coaching"
                            checked={formData.subject === "Coaching"}
                            onChange={handleChange}
                        />
                        Coaching
                    </label>
                </div>

                <label htmlFor="message" className="text-secondary">Message</label>
                <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                ></textarea>

                <button className="bg-third border-third text-secondary submit" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Envoyer Message"}
                </button>
            </form>
        </main>
    )
}