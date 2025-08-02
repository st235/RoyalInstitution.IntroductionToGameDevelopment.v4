import "@components/html-content-card/HtmlContentCard.css";

import DOMPurify from "dompurify";

const baseUrlAlias = "@public";

type RawHtmlString = string;

type HtmlContentCardProps = {
    id: string;
    title?: string;
    description: RawHtmlString;
};

function HtmlContentCard(props: HtmlContentCardProps) {
    function sanitizeHtmlContent(htmlContent: RawHtmlString): { __html: string } {
        const baseUrl = import.meta.env.BASE_URL;
        const baseUrlAliasSubstitutedContent = htmlContent.replaceAll(baseUrlAlias, baseUrl);
        return {__html: DOMPurify.sanitize(baseUrlAliasSubstitutedContent)};
    }

    return (
        <div className="html-content-card">
            <div className="row-heading">
                <span className="id">{props.id}</span>
                {props.title && <h1 className="title">{props.title}</h1>}
            </div>
            <p className="description"
                dangerouslySetInnerHTML={sanitizeHtmlContent(props.description)}
            />
        </div>
    );
}

export default HtmlContentCard;
export type { HtmlContentCardProps };
