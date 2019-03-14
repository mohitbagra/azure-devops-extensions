import "./WorkItemTitleView.scss";

import * as React from "react";
import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { Image } from "azure-devops-ui/Image";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    getWorkItemType, getWorkItemTypeModule, IWorkItemTypeAwareState, WorkItemTypeActions
} from "Common/Redux/WorkItemTypes";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";

interface IWorkItemTitleViewOwnProps extends IBaseProps {
    linkClassName?: string;
    workItemId: number;
    title: string;
    workItemTypeName: string;
    showId?: boolean;
    onClick?(e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>): void;
}

interface IWorkItemTitleViewStateProps {
    workItemType?: WorkItemType;
}

const Actions = { loadWorkItemTypes: WorkItemTypeActions.loadRequested };

function WorkItemTitleViewInternal(props: IWorkItemTitleViewOwnProps) {
    const { workItemId, title, workItemTypeName, showId, className, linkClassName, onClick } = props;
    const mapStateToProps = React.useCallback(
        (state: IWorkItemTypeAwareState): IWorkItemTitleViewStateProps => {
            return {
                workItemType: getWorkItemType(state, workItemTypeName)
            };
        },
        [workItemTypeName]
    );
    const { workItemType } = useMappedState(mapStateToProps);
    const { loadWorkItemTypes } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!workItemType) {
            loadWorkItemTypes();
        }
    }, []);

    const witIcon = workItemType ? workItemType.icon : null;
    const witIconUrl = witIcon && witIcon.id ? witIcon.url : null;

    return (
        <div className={css("work-item-title-view flex-row flex-center", className)}>
            {witIconUrl && workItemType && (
                <Tooltip text={workItemType.name}>
                    {Image({
                        src: witIconUrl,
                        alt: workItemType.name
                    })}
                </Tooltip>
            )}
            {showId && <span className="work-item-id">{workItemId}</span>}
            <AsyncLinkComponent
                key={workItemId}
                className={css("title-link flex-grow text-ellipsis", linkClassName)}
                getHrefAsync={getWorkItemUrlPromise(workItemId)}
                title={title}
                onClick={onClick && onLinkClick(onClick)}
            />
        </div>
    );
}

function getWorkItemUrlPromise(workItemId: number): () => Promise<string> {
    return async () => getWorkItemUrlAsync(workItemId);
}

function onLinkClick(onClick: (ev: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void) {
    return (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
        if (onClick && !e.ctrlKey) {
            e.preventDefault();
            onClick(e);
        }
    };
}

export function WorkItemTitleView(props: IWorkItemTitleViewOwnProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeModule()]}>
            <WorkItemTitleViewInternal {...props} />
        </DynamicModuleLoader>
    );
}
