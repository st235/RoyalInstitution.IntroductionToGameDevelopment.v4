import "@components/drag-handler/DragHandler.css";

type DragHandlerProps = {
    variant: "expanded" | "collapsed";
}

function DragHandler(props: DragHandlerProps) {
    return (
        <div className="drag-handler">
            <div className={`background ${props.variant}`} />
        </div>
    );
}

export default DragHandler;
export type { DragHandlerProps };
