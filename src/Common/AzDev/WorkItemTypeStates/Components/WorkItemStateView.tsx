import "./WorkItemStateView.scss";

import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import * as React from "react";
import { useWorkItemTypeStateColor } from "../Hooks/useWorkItemTypeStateColor";
import { getWorkItemTypeStateModule } from "../Redux";

interface IWorkItemStateViewProps extends IBaseProps {
    stateName: string;
    workItemTypeName: string;
}

function WorkItemStateViewInternal(props: IWorkItemStateViewProps) {
    const { className, workItemTypeName, stateName } = props;
    const color = useWorkItemTypeStateColor(workItemTypeName, stateName);
    let stateColor;

    if (color) {
        stateColor = `#${color.substring(color.length - 6)}`;
    } else {
        stateColor = "#000000";
    }

    return (
        <div className={css("work-item-state-view flex-row flex-center", className)}>
            <span
                className="work-item-type-state-color"
                style={{
                    backgroundColor: stateColor,
                    borderColor: stateColor
                }}
            />
            <Tooltip overflowOnly={true}>
                <span className="state-name flex-grow text-ellipsis">{stateName}</span>
            </Tooltip>
        </div>
    );
}

export function WorkItemStateView(props: IWorkItemStateViewProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeStateModule()]}>
            <WorkItemStateViewInternal {...props} />
        </DynamicModuleLoader>
    );
}
