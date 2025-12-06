import "@components/spinner/Spinner.css";

type SpinnerProps = {
    size: "small" | "medium" | "large";
    variant: "primary" | "secondary";
}

function Spinner(props: SpinnerProps) {
    return (
        <div className={`spinner ${props.size} ${props.variant}`} />
    );
}

export default Spinner;
export type { SpinnerProps };
