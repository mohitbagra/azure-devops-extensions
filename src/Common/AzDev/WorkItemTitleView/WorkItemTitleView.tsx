import "./WorkItemTitleView.scss";

import * as React from "react";

import { css } from "azure-devops-ui/Util";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { IBaseProps } from "Common/Components/Contracts";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";

import { WorkItemTypeIcon } from "../WorkItemTypes/Components/WorkItemTypeIcon";

interface IWorkItemTitleViewProps extends IBaseProps {
    linkClassName?: string;
    workItemId: number;
    title: string;
    workItemTypeName: string;
    hideId?: boolean;
    hideTitle?: boolean;
    onClick?(e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>): void;
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
    const { workItemId, title, workItemTypeName, hideId = false, hideTitle = false, className, linkClassName, onClick } = props;

    return (
        <div className={css("work-item-title-view flex-row flex-center", className)}>
            <WorkItemTypeIcon workItemTypeName={workItemTypeName} className="flex-noshrink" />
            {!hideId && <span className="work-item-id">{workItemId}</span>}
            {!hideTitle && (
                <AsyncLinkComponent
                    key={workItemId}
                    className={css("title-link flex-grow text-ellipsis", linkClassName)}
                    getHrefAsync={getWorkItemUrlPromise(workItemId)}
                    title={title}
                    onClick={onClick && onLinkClick(onClick)}
                />
            )}
        </div>
    );
}
