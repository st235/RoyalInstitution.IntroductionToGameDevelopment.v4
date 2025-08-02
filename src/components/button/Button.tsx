import "@components/button/Button.css";

type ButtonProps = {
    text: string;
    variant: "primary" | "secondary";
    leadingIcon?: string;
    onClick?: () => void;
}

function Button(props: ButtonProps) {
    return (
        <button className={`button ${props.variant}`} onClick={props.onClick}>
            {props.leadingIcon && <img className="left-icon" src={props.leadingIcon} />}
            {props.text}
        </button>
    );
}

export default Button;
export type { ButtonProps };
