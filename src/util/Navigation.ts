function getHomeUrl(): string {
    return "/default";
}

function isHomePage(pageId?: string): boolean {
    return pageId?.toLowerCase() === "default";
}

export { getHomeUrl, isHomePage };
