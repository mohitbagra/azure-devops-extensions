import "./WorkItemTitleView.scss";

import { Image } from "azure-devops-ui/Image";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";
import { useWorkItemType } from "../Hooks/useWorkItemType";
import { getWorkItemTypeModule } from "../Redux";

interface IWorkItemTitleViewProps extends IBaseProps {
    linkClassName?: string;
    workItemId: number;
    title: string;
    workItemTypeName: string;
    showId?: boolean;
    onClick?(e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>): void;
}

function WorkItemTitleViewInternal(props: IWorkItemTitleViewProps) {
    const { workItemId, title, workItemTypeName, showId, className, linkClassName, onClick } = props;
    const { workItemType } = useWorkItemType(workItemTypeName);

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

export function WorkItemTitleView(props: IWorkItemTitleViewProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeModule()]}>
            <WorkItemTitleViewInternal {...props} />
        </DynamicModuleLoader>
    );
}
