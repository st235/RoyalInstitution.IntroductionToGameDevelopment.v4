import "@components/label/Label.css";

type LabelVariant = "primary" | "secondary" | "tertiary" | "quartary" | "caption" | "body" | "footnote";

type LabelProps = {
    title: string;
    variant: LabelVariant;
};

function Label(props: LabelProps) {
    switch (props.variant) {
    case "primary": return (<h1 className="label">{props.title}</h1>);
    case "secondary": return (<h2 className="label">{props.title}</h2>);
    case "tertiary": return (<h3 className="label">{props.title}</h3>);
    case "quartary": return (<h4 className="label">{props.title}</h4>);
    case "caption": return (<p className="label caption">{props.title}</p>);
    case "body": return (<p className="label body">{props.title}</p>);
    case "footnote": return (<p className="label footnote">{props.title}</p>);
    }
}

export default Label;
export type { LabelProps, LabelVariant, };
