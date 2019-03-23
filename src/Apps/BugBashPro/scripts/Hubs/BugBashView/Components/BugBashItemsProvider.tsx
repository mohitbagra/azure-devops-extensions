import { ZeroData } from "azure-devops-ui/ZeroData";
import { Resources } from "BugBashPro/Resources";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import * as React from "react";
import { useFilteredBugBashItems } from "../Hooks/useFilteredBugBashItems";
import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "../Interfaces";

interface IBugBashItemProviderProps extends IBugBashViewBaseProps {
    children: (params: IBugBashItemProviderParams) => JSX.Element;
}

export function BugBashItemProvider(props: IBugBashItemProviderProps) {
    const { bugBash, children } = props;
    const { filteredBugBashItems, workItemsMap, status, filterData } = useFilteredBugBashItems(bugBash.id!);

    if (!filteredBugBashItems || status === LoadStatus.NotLoaded) {
        return <Loading />;
    }
    if (filteredBugBashItems.length === 0) {
        return <ZeroData className="flex-grow" imagePath="../images/nodata.png" imageAltText="" primaryText={Resources.ZeroDataText} />;
    }

    return children({ filteredBugBashItems, workItemsMap, status, filterData });
}
