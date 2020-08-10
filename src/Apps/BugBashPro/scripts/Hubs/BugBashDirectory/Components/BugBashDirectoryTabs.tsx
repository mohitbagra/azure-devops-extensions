import * as React from "react";

import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { Resources } from "BugBashPro/Resources";

import { useBugBashesSelectedTab } from "../Hooks/useBugBashesSelectedTab";
import { useFilteredBugBashes } from "../Hooks/useFilteredBugBashes";
import { BugBashDirectoryTabId } from "../Redux/Contracts";
import { BugBashDirectoryFilterBar } from "./BugBashDirectoryFilterBar";

const renderFilterBar = () => <BugBashDirectoryFilterBar />;

export function BugBashDirectoryTabs(): JSX.Element {
    const { selectedTab, setSelectedTab } = useBugBashesSelectedTab();
    const { bugBashCounts } = useFilteredBugBashes();

    return (
        <TabBar
            className="bugbash-page-tabbar"
            selectedTabId={selectedTab}
            tabSize={TabSize.Tall}
            onSelectedTabChanged={setSelectedTab}
            renderAdditionalContent={renderFilterBar}
        >
            <Tab name={Resources.InProgress} id={BugBashDirectoryTabId.Ongoing} badgeCount={(bugBashCounts && bugBashCounts.ongoing) || 0} />
            <Tab name={Resources.Scheduled} id={BugBashDirectoryTabId.Upcoming} badgeCount={(bugBashCounts && bugBashCounts.upcoming) || 0} />
            <Tab name={Resources.Completed} id={BugBashDirectoryTabId.Past} badgeCount={(bugBashCounts && bugBashCounts.past) || 0} />
        </TabBar>
    );
}
