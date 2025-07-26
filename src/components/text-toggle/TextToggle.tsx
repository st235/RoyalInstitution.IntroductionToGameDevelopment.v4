import "@components/text-toggle/TextToggle.css";

type TextToggleProps = {
    text: string;
    variant: "primary" | "secondary" | "accent";
    isChecked?: boolean;
    background?: string;
    onToggle?: (check: boolean) => void;
};

function TextToggle(props: TextToggleProps) {
    const backgroundCssProperties: React.CSSProperties = {};
    if (props.background) {
        backgroundCssProperties.backgroundImage = `url("${props.background}")`;
    }

    return (
        <div
            className={`text-toggle ${props.variant} ${props.isChecked ? "checked" : ""}`}
            onClick={() => props.onToggle?.(!props.isChecked)}>
            <span className="content">{props.text}</span>
            <div className="background" style={backgroundCssProperties} />
        </div>
    );
}

export default TextToggle;
