import "@/pages/base/RootNavigator.css";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";

import { selectPage } from "@/reducers/pagesSlice";
import DefaultPage from "@/pages/base/DefaultPage";
import InfoFooter from "@/pages/base/components/info-footer/InfoFooter";
import LogoPopup from "@/pages/base/components/logo-popup/LogoPopup";
import MinScreenSizeOverlay from "@/components/min-screen-size-overlay/MinScreenSizeOverlay";
import NavigationRail from "@/components/navigation-rail/NavigationRail";
import PageList from "@/pages/base/components/page-list/PageList";
import SideBarLayout from "@/components/sidebar-layout/SideBarLayout";
import type { StatefulPage } from "@/models/Page";
import WindowSizeWarning from "@/pages/base/components/window-size-warning/WindowSizeWarning";

type SidebarRailProps = {
  selectedPageId: string;
  pages: StatefulPage[];
  onPageSelected: (page: StatefulPage) => void;
};

function SidebarRail(props: SidebarRailProps) {
    return (
        <NavigationRail
            header={<LogoPopup />}
            footer={<InfoFooter />}>
            <PageList
                selectedPageId={props.selectedPageId}
                pages={props.pages}
                onPageSelected={props.onPageSelected}/>
        </NavigationRail>
    );
}

function RootNavigator() {
    const dispatch = useAppDispatch();
    const pagesState = useAppSelector(state => state.pagesState);

    function onPageSelected(e: StatefulPage) {
        if (e.state === "locked" || e.id === pagesState.selectedPageId) {
            return;
        }

        dispatch(selectPage(e.id));
    }

    return (
        <div id="root-navigator">
            <MinScreenSizeOverlay><WindowSizeWarning /></MinScreenSizeOverlay>
            <SideBarLayout
                sidebar={
                    <SidebarRail
                        selectedPageId={pagesState.selectedPageId}
                        pages={Object.values(pagesState.pagesLookup)}
                        onPageSelected={onPageSelected} />
                }>
                <DefaultPage />
            </SideBarLayout>
        </div>
    );
}

export default RootNavigator;
