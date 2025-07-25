import "@components/text-toggle/TextToggle.css";

type TextToggleProps = {
    text: string;
    variant: "primary" | "secondary" | "accent";
    isChecked?: boolean;
    background?: string;
    onToggle?: (check: boolean) => void;
};

function TextToggle(props: TextToggleProps) {
    return (
        <div
            className={`text-toggle ${props.variant} ${props.isChecked ? "checked" : ""}`}
            onClick={() => props.onToggle?.(!props.isChecked)}>
            <span className="content">{props.text}</span>
            <div className="background" style={{backgroundImage: `url("${props.background}")`,}} />
        </div>
    );
}

export default TextToggle;
