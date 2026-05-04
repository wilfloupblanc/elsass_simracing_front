import MENTIONS_LEGALES_CONTENT from "../../../constants/mentionsLegales.js";
import "../LegalPage.scss";

const MentionsLegales = () => {
    return (
        <main className="legal-page">
            <section
                className="legal-page__content"
                dangerouslySetInnerHTML={{ __html: MENTIONS_LEGALES_CONTENT }}
            />
        </main>
    );
};

export default MentionsLegales;