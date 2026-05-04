import POLITIQUE_COOKIES_CONTENT from "../../../constants/politiqueCookies";
import "../LegalPage.scss";

const PolitiqueCookies = () => {
    return (
        <main className="legal-page">
            <section
                className="legal-page__content"
                dangerouslySetInnerHTML={{ __html: POLITIQUE_COOKIES_CONTENT }}
            />
        </main>
    );
};

export default PolitiqueCookies;