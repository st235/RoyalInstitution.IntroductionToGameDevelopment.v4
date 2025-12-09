import "@/pages/base/RootNavigator.css";

import { useParams, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

import { isHomePage } from "@/util/Navigation";
import { selectPage } from "@/reducers/pagesSlice";
import { useLayoutEffect } from "react";
import InfoFooter from "@/pages/base/components/info-footer/InfoFooter";
import LogoPopup from "@/pages/base/components/logo-popup/LogoPopup";
import MinScreenSizeOverlay from "@/components/min-screen-size-overlay/MinScreenSizeOverlay";
import NavigationRail from "@/components/navigation-rail/NavigationRail";
import PageList from "@/pages/base/components/page-list/PageList";
import PlaythroughPage from "@/pages/PlaythroughPage";
import SideBarLayout from "@/components/sidebar-layout/SideBarLayout";
import type { StatefulPageDescriptor } from "@/models/PageDescriptor";
import WindowSizeWarning from "@/pages/base/components/window-size-warning/WindowSizeWarning";

type SidebarRailProps = {
  selectedPageId: string;
  pages: StatefulPageDescriptor[];
  onPageSelected: (page: StatefulPageDescriptor) => void;
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

    useLayoutEffect(() => {
        if (isHomePage(navigationPageId) || 
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

    function onPageSelected(e: StatefulPageDescriptor) {
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
