import "@/pages/base/components/page-list/PageList.css";

import IconLockFill from "@assets/icons/lock-fill.svg";
import IconCheckLg from "@assets/icons/check-lg.svg";

import TextToggle from "@components/text-toggle/TextToggle";
import type { StatefulPage } from "@/models/Page";

type PageListProps = {
    selectedPageId?: string;
    pages: StatefulPage[];
    onPageSelected: (exercise: StatefulPage) => void;
};

function PageList(props: PageListProps) {
    return (
        <div className="exercise-list">
            {props.pages.map(page => {
                const onClick = () => props.onPageSelected(page);

                let variant: "primary" | "secondary" | "accent" = "primary";
                let icon = undefined;

                if (page.state === "completed") {
                    variant = "accent";
                    icon = IconCheckLg;
                } else if (page.state == "locked") {
                    variant = "secondary";
                    icon = IconLockFill;
                }

                return (
                    <TextToggle
                        key={page.id}
                        variant={variant}
                        text={`${page.ordinal}`}
                        background={icon}
                        isChecked={props.selectedPageId == page.id}
                        onToggle={onClick}
                    />
                );
            })}
        </div>
    );
}

export default PageList;
export type { PageListProps };
