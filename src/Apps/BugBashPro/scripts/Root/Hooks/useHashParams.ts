import * as React from "react";
import { AppView } from "BugBashPro/Shared/Constants";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { switchToDirectory } from "BugBashPro/Shared/NavHelpers";
import { attachNavigate } from "Common/ServiceWrappers/HostNavigationService";
import { isNullOrWhiteSpace } from "Common/Utilities/String";

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
        } else if (viewMode === AppView.ACTION_ITEM && !isNullOrWhiteSpace(queryParams.bugBashId) && !isNullOrWhiteSpace(queryParams.bugBashItemId)) {
            setHashParams({
                view: AppView.ACTION_ITEM,
                bugBashId: queryParams.bugBashId,
                bugBashItemId: queryParams.bugBashItemId
            });
        } else if ((viewMode === AppView.ACTION_LIST || viewMode === AppView.ACTION_CHARTS) && !isNullOrWhiteSpace(queryParams.id)) {
            setHashParams({
                view: viewMode,
                bugBashId: queryParams.id
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
