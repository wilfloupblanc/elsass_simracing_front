import CGU_CONTENT from "../../../constants/cgu.js";
import "../LegalPage.scss";

const CGU = () => {
    return (
        <main className="legal-page">
            <section
                className="legal-page__content"
                dangerouslySetInnerHTML={{ __html: CGU_CONTENT }}
            />
        </main>
    );
};

export default CGU;