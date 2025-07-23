import "@components/text-toggle/TextToggle.css";

type TextToggleProps = {
    text: string;
    variant: "primary" | "secondary" | "accent";
    isSelected?: boolean;
    background?: string;
    onClick?: () => void;
};

function TextToggle(props: TextToggleProps) {
    return (
        <span
            className={`text-toggle ${props.variant} ${props.isSelected ? "selected" : ""}`}
            onClick={props.onClick}>
            <span className="content">{props.text}</span>
            <div className="background" style={{backgroundImage: `url("${props.background}")`,}} />
        </span>
    );
}

export default TextToggle;
