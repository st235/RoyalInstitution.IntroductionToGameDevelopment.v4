import "@components/icon/Icon.css";

type IconProps = {
    icon: string;
};

function Icon(props: IconProps) {
    return (
        <img className="icon square" src={props.icon} />
    );
}

export default Icon;
