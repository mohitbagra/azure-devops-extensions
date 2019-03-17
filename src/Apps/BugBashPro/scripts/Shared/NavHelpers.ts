import { setHash } from "Common/ServiceWrappers/HostNavigationService";
import { getContributionHubUrlAsync } from "Common/Utilities/UrlHelper";
import { AppView } from "./Constants";

export function navigateToDirectory() {
    setHash({ view: AppView.ACTION_ALL });
}

export function switchToDirectory() {
    setHash({ view: AppView.ACTION_ALL }, true);
}

export function navigateToBugBashItemsList(bugBashId: string) {
    setHash({ view: AppView.ACTION_LIST, id: bugBashId });
}

export function navigateToBugBashItemsCharts(bugBashId: string) {
    setHash({ view: AppView.ACTION_CHARTS, id: bugBashId });
}

export function navigateToBugBashItemsBoard(bugBashId: string) {
    setHash({ view: AppView.ACTION_BOARD, id: bugBashId });
}

export function navigateToBugBashItem(bugBashId: string, bugBashItemId: string) {
    setHash({ view: AppView.ACTION_ITEM, bugBashId, bugBashItemId });
}

export async function getBugBashDirectoryUrlAsync(): Promise<string> {
    const hubUrl = await getContributionHubUrlAsync();
    return `${hubUrl}#view=${AppView.ACTION_ALL}`;
}

export async function getBugBashViewUrlAsync(bugBashId: string, viewMode: AppView): Promise<string> {
    const hubUrl = await getContributionHubUrlAsync();
    return `${hubUrl}#view=${viewMode}&id=${bugBashId}`;
}

export async function getBugBashItemsListUrlAsync(bugBashId: string): Promise<string> {
    const hubUrl = await getContributionHubUrlAsync();
    return `${hubUrl}#view=${AppView.ACTION_LIST}&id=${bugBashId}`;
}

export async function getBugBashItemsChartsUrlAsync(bugBashId: string): Promise<string> {
    const hubUrl = await getContributionHubUrlAsync();
    return `${hubUrl}#view=${AppView.ACTION_CHARTS}&id=${bugBashId}`;
}

export async function getBugBashItemsBoardUrlAsync(bugBashId: string): Promise<string> {
    const hubUrl = await getContributionHubUrlAsync();
    return `${hubUrl}#view=${AppView.ACTION_BOARD}&id=${bugBashId}`;
}

export async function getBugBashItemUrlAsync(bugBashId: string, bugBashItemId: string): Promise<string> {
    const hubUrl = await getContributionHubUrlAsync();
    return `${hubUrl}#view=${AppView.ACTION_ITEM}&bugBashId=${bugBashId}&bugBashItemId=${bugBashItemId}`;
}
