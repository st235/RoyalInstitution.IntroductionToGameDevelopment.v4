import "@components/panels-layout/PanelsLayout.css";

import React, { createRef, useState } from "react";

import Panel from "@/components/panels-layout/Panel";
import ResizeHandler from "@/components/panels-layout/ResizeHandler";

type DraggingInfo = {
  resizerId: number;
  area: {
    left: number;
    right: number;
  }
};

type ColumnLayout = {
  id: number;
  minWidth: number;
  overwriteWidth?: number;
  ref: React.RefObject<HTMLDivElement>;
};

type ColumnInfo = {
  content: React.ReactNode;
  minWidth?: number;
  defaultWeight: number;
  resizeable?: boolean;
};

type PanelsLayoutProps = {
  columns: ColumnInfo[];
  resizer?: React.ReactNode;
  shouldCancelOnLeavel?: boolean;
};

function PanelsLayout(props: PanelsLayoutProps) {
    const columns = props.columns;
    const shouldCancelOnLeavel = props.shouldCancelOnLeavel;

    const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | null>(null);
    const [columnLayouts, setColumnLayouts] = useState<Array<ColumnLayout>>(
        Array.from(props.columns.map((column, index) => ({ 
            id: index, minWidth: column.minWidth ?? 0, ref: createRef() 
        } as ColumnLayout)))
    );

    const handleStartDragging = (resizerId: number, e: React.PointerEvent) => {
        e.preventDefault();

        const isColumnResizeable = columns[resizerId].resizeable ?? true;
        if (!isColumnResizeable) {
            return;
        }

        const leftColumnId = resizerId;
        const draggingColumnId = resizerId + 1;

        const leftColumnLayout = columnLayouts[leftColumnId];
        const draggingColumnLayout = columnLayouts[draggingColumnId];

        const leftColumnRect = leftColumnLayout.ref.current.getBoundingClientRect();
        const draggingColumnRect = draggingColumnLayout.ref.current.getBoundingClientRect();

        setDraggingInfo({ 
            resizerId,
            area: {
                left: leftColumnRect.left,
                right: draggingColumnRect.right,
            },
        });
    };

    const handleDragging = (e: React.PointerEvent) => {
        if (draggingInfo == null) {
            return;
        }

        const dx = e.movementX;

        const leftColumnId = draggingInfo.resizerId;
        const draggingColumnId = draggingInfo.resizerId + 1;

        const leftColumnLayout = columnLayouts[leftColumnId];
        const draggingColumnLayout = columnLayouts[draggingColumnId];

        const leftColumnRect = leftColumnLayout.ref.current.getBoundingClientRect();
        const draggingColumnRect = draggingColumnLayout.ref.current.getBoundingClientRect();

        const leftColumnLeft = leftColumnRect.left;
        const draggingColumnRight = draggingColumnRect.right;

        let leftColumnRight = leftColumnRect.right;
        let draggingColumnLeft = draggingColumnRect.left;

        if (dx < 0) { // Shrinking left column, expanding right.
            const newLeftColumnRight = Math.max(
                draggingInfo.area.left + leftColumnLayout.minWidth,
                leftColumnRect.right + dx,
            );

            // If left shrinked, expanding right.
            const rdx = Math.abs(newLeftColumnRight - leftColumnRight);
            if (rdx > 0.5) {
                leftColumnRight = newLeftColumnRight;
                draggingColumnLeft -= rdx;
            }
        } else { // Expanding left column, shrinking right.
            const newDraggingColumnLeft = Math.min(
                draggingInfo.area.right - draggingColumnLayout.minWidth,
                draggingColumnRect.left + dx,
            );

            const rdx = Math.abs(newDraggingColumnLeft - draggingColumnLeft);
            if (rdx > 0.5) {
                leftColumnRight += rdx;
                draggingColumnLeft = newDraggingColumnLeft;
            }
        }

        const leftColumnWidth = Math.floor(leftColumnRight - leftColumnLeft);
        const draggingColumnWidth = Math.floor(draggingColumnRight - draggingColumnLeft);

        const newColumnLayouts = columnLayouts.map(oldColumnLayout => {
            let currentColumnWidth = oldColumnLayout.overwriteWidth;
            if (oldColumnLayout.id == leftColumnLayout.id) {
                currentColumnWidth = leftColumnWidth;
            } else if (oldColumnLayout.id == draggingColumnLayout.id) {
                currentColumnWidth = draggingColumnWidth;
            }

            return {
                id: oldColumnLayout.id,
                overwriteWidth: currentColumnWidth,
                minWidth: oldColumnLayout.minWidth,
                ref: oldColumnLayout.ref,
            } as ColumnLayout;
        });

        setColumnLayouts(newColumnLayouts);
    };

    const handleDraggingStop = (e: React.PointerEvent) => {
        e.preventDefault();
        setDraggingInfo(null);
    };

    return (
        <div className="panels-container"
            onPointerMove={handleDragging}
            onPointerUp={handleDraggingStop}
            onPointerCancel={handleDraggingStop}
            onPointerLeave={ shouldCancelOnLeavel ? handleDraggingStop : undefined }>
            {columns.map((column, index) =>
                <React.Fragment key={index}>
                    <Panel
                        ref={columnLayouts[index].ref}
                        overwriteWidth={columnLayouts[index].overwriteWidth}
                        defaultWeight={column.defaultWeight}
                        minWidth={columnLayouts[index].minWidth}>
                        {column.content}
                    </Panel>

                    {index < columns.length - 1 &&
                    <ResizeHandler id={index}
                        onStartDragging={handleStartDragging}>
                        {props.resizer}
                    </ResizeHandler>
                    }
                </React.Fragment>
            )}
        </div>
    );
}

export default PanelsLayout;
export type { PanelsLayoutProps, ColumnInfo as ColumnConfig };
