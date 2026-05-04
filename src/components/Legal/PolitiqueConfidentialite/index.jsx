import POLITIQUE_CONFIDENTIALITE_CONTENT from "../../../constants/politiqueConfidentialite.js";
import "../LegalPage.scss";

const PolitiqueConfidentialite = () => {
    return (
        <main className="legal-page">
            <section
                className="legal-page__content"
                dangerouslySetInnerHTML={{ __html: POLITIQUE_CONFIDENTIALITE_CONTENT }}
            />
        </main>
    );
};

export default PolitiqueConfidentialite;