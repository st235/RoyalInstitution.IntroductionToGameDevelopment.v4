import "@components/button/Button.css";

type ButtonProps = {
    text: string;
    variant: "primary" | "secondary";
    leftIcon?: string;
    onClick?: () => void;
}

function Button(props: ButtonProps) {
    return (
        <button className={`button ${props.variant}`} onClick={props.onClick}>
            {props.leftIcon && <img className="left-icon" src={props.leftIcon} />}
            {props.text}
        </button>
    );
}

export default Button;
export type { ButtonProps };
