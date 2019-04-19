import { ZeroData } from "azure-devops-ui/ZeroData";
import { Resources } from "BugBashPro/Resources";
import { AppView } from "BugBashPro/Shared/Constants";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import * as React from "react";
import { BugBashViewContext } from "../Constants";
import { useBugBashViewMode } from "../Hooks/useBugBashViewMode";
import { useFilteredBugBashItems } from "../Hooks/useFilteredBugBashItems";
import { IBugBashItemProviderParams } from "../Interfaces";
import { BugBashViewMode } from "../Redux/Contracts";

interface IBugBashItemProviderProps {
    view: AppView;
    children: (params: IBugBashItemProviderParams) => JSX.Element;
}

export function BugBashItemProvider(props: IBugBashItemProviderProps) {
    const { view, children } = props;
    const bugBash = React.useContext(BugBashViewContext);
    const { filteredBugBashItems, workItemsMap, status, filterData } = useFilteredBugBashItems(bugBash.id!);
    const { viewMode, setViewMode } = useBugBashViewMode();

    React.useEffect(() => {
        if (view === AppView.ACTION_BOARD && viewMode !== BugBashViewMode.All) {
            setViewMode(BugBashViewMode.All);
        }
    }, [view]);

    if (view === AppView.ACTION_BOARD && viewMode !== BugBashViewMode.All) {
        return null;
    }

    if (!filteredBugBashItems || status === LoadStatus.NotLoaded) {
        return <Loading />;
    }
    if (filteredBugBashItems.length === 0) {
        return <ZeroData className="flex-grow" imagePath="../images/nodata.png" imageAltText="" primaryText={Resources.ZeroDataText} />;
    }

    return children({ filteredBugBashItems, workItemsMap, status, filterData });
}
