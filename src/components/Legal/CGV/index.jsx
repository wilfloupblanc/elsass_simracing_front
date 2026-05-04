import CGV_CONTENT from "../../../constants/cgv.js";
import "../LegalPage.scss";

const CGV = () => {
    return (
        <main className="legal-page">
            <section
                className="legal-page__content"
                dangerouslySetInnerHTML={{ __html: CGV_CONTENT }}
            />
        </main>
    );
};

export default CGV;