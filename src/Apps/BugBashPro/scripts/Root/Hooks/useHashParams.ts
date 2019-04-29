import { AppView } from "BugBashPro/Shared/Constants";
import { switchToDirectory } from "BugBashPro/Shared/NavHelpers";
import { attachNavigate } from "Common/ServiceWrappers/HostNavigationService";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";

interface IHashParams {
    view: AppView;
    bugBashId?: string;
    bugBashItemId?: string;
}

export function useHashParams(): IHashParams | undefined {
    const [hashParams, setHashParams] = React.useState<IHashParams | undefined>(undefined);

    function onHashChange(queryParams: { [key: string]: string }) {
        const viewMode = resolveNullableMapKey(queryParams.view);

        if (viewMode === AppView.ACTION_ALL) {
            setHashParams({
                view: AppView.ACTION_ALL
            });
        } else if (
            (viewMode === AppView.ACTION_LIST || viewMode === AppView.ACTION_CHARTS || viewMode === AppView.ACTION_BOARD) &&
            !isNullOrWhiteSpace(queryParams.id)
        ) {
            setHashParams({
                view: viewMode,
                bugBashId: queryParams.id,
                bugBashItemId: queryParams.bugBashItemId
            });
        } else {
            switchToDirectory();
        }
    }

    React.useEffect(() => {
        attachNavigate(onHashChange, true);
    }, []);

    return hashParams;
}
