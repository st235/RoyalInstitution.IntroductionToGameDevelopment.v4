import "@components/html-content-card/HtmlContentCard.css";

import { useMemo } from "react";
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

    function generateHash(value: string): number {
        let hash = 0;
        for (const char of value) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0;
        }
        return hash;
    }

    const htmlContent = useMemo(() => sanitizeHtmlContent(props.description),
        [props.description]);

    const key = useMemo(() => generateHash(props.description),
        [props.description]);

    return (
        <div className="html-content-card">
            <div className="row-heading">
                <span className="id">{props.id}</span>
                {props.title && <h1 className="title">{props.title}</h1>}
            </div>
            <div className="description"
                key={key}
                dangerouslySetInnerHTML={htmlContent}
            />
        </div>
    );
}

export default HtmlContentCard;
export type { HtmlContentCardProps };
