import "@/pages/base/RootNavigator.css";

import { useParams } from "react-router";
import { useNavigateWithLocale } from "@/hooks/useNavigationWithLocale";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

import { getHomeUrl, isHomePage, isLanguageSupportedForNavigation } from "@/util/Navigation";
import { selectLanguage } from "@/reducers/localeSlice";
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
    const lang = params.lang;
    const navigationPageId = params.pageId;

    const dispatch = useAppDispatch();
    const pagesState = useAppSelector(state => state.pagesState);
    const localeState = useAppSelector(state => state.localeState);

    const navigate = useNavigateWithLocale(localeState.defaultLanguage,
        localeState.selectedLanguage);

    const selectedPage = pagesState.pagesLookup[pagesState.selectedPageId];

    useLayoutEffect(() => {
        if (lang) {
            if (!isLanguageSupportedForNavigation(lang,
                localeState.supportedLanguages)) {
                // If the selected language is unsupported,
                // let's bring user back.
                navigate(getHomeUrl());
                return;
            }

            if (localeState.selectedLanguage !== lang.toLowerCase()) {
                // If navigation is supported,
                // let's change to state.
                dispatch(selectLanguage(lang));
            }
        }

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
