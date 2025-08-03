import "@/pages/base/RootNavigator.css";

import { useParams, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

import { selectPage } from "@/reducers/pagesSlice";
import PlaythroughPage from "@/pages/PlaythroughPage";
import InfoFooter from "@/pages/base/components/info-footer/InfoFooter";
import LogoPopup from "@/pages/base/components/logo-popup/LogoPopup";
import MinScreenSizeOverlay from "@/components/min-screen-size-overlay/MinScreenSizeOverlay";
import NavigationRail from "@/components/navigation-rail/NavigationRail";
import PageList from "@/pages/base/components/page-list/PageList";
import SideBarLayout from "@/components/sidebar-layout/SideBarLayout";
import type { StatefulPage } from "@/models/Page";
import WindowSizeWarning from "@/pages/base/components/window-size-warning/WindowSizeWarning";
import { useEffect } from "react";

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
                pages={props.pages.filter(page => !page.isHidden)}
                onPageSelected={props.onPageSelected}/>
        </NavigationRail>
    );
}

function RootNavigator() {
    const params = useParams();
    const navigate = useNavigate();
    const navigationPageId = params.pageId;

    const dispatch = useAppDispatch();
    const pagesState = useAppSelector(state => state.pagesState);

    const selectedPage = pagesState.pagesLookup[pagesState.selectedPageId];

    useEffect(() => {
        if (navigationPageId === "default" || 
            (navigationPageId && (
                !pagesState.pagesLookup[navigationPageId] || 
                pagesState.pagesLookup[navigationPageId].state === "locked")
            )
        ) {
            navigate(`/${pagesState.selectedPageId}`);
            return;
        }

        if (navigationPageId && pagesState.selectedPageId !== navigationPageId) {
            dispatch(selectPage(navigationPageId));
        }
    }, [dispatch, navigate, navigationPageId, pagesState.pagesLookup, pagesState.selectedPageId, selectedPage, selectedPage.state]);

    function onPageSelected(e: StatefulPage) {
        if (e.state === "locked" || e.id === pagesState.selectedPageId) {
            return;
        }

        navigate(`/${e.id}`);
    }

    return (
        <div id="root-navigator">
            <MinScreenSizeOverlay><WindowSizeWarning /></MinScreenSizeOverlay>
            <SideBarLayout
                sidebar={
                    <SidebarRail
                        selectedPageId={params.pageId ?? pagesState.selectedPageId}
                        pages={Object.values(pagesState.pagesLookup)}
                        onPageSelected={onPageSelected} />
                }>
                <PlaythroughPage page={selectedPage} />
            </SideBarLayout>
        </div>
    );
}

export default RootNavigator;
