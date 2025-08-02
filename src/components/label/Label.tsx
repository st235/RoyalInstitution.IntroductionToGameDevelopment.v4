import "@components/label/Label.css";

type LabelVariant = "primary" | "secondary" | "caption";

type LabelProps = {
    title: string;
    variant: LabelVariant;
};

function Label(props: LabelProps) {
    switch (props.variant) {
    case "primary": return (<h1 className="label">{props.title}</h1>);
    case "secondary": return (<h2 className="label">{props.title}</h2>);
    case "caption": return (<p className="label">{props.title}</p>);
    }
}

export default Label;
export type { LabelProps, LabelVariant, };
