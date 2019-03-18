import "./WorkItemStateView.scss";

import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { getWorkItemTypeStateColor, getWorkItemTypeStateModule, IWorkItemTypeStateAwareState, WorkItemTypeStateActions } from "../Redux";

interface IWorkItemStateViewOwnProps extends IBaseProps {
    stateName: string;
    workItemTypeName: string;
}

interface IWorkItemStateViewStateProps {
    color?: string;
}

const Actions = { loadWorkItemTypeStates: WorkItemTypeStateActions.loadRequested };

function WorkItemStateViewInternal(props: IWorkItemStateViewOwnProps) {
    const { className, workItemTypeName, stateName } = props;
    const mapStateToProps = React.useCallback(
        (state: IWorkItemTypeStateAwareState): IWorkItemStateViewStateProps => {
            return {
                color: getWorkItemTypeStateColor(state, workItemTypeName, stateName)
            };
        },
        [workItemTypeName, stateName]
    );
    const { color } = useMappedState(mapStateToProps);
    const { loadWorkItemTypeStates } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!color) {
            loadWorkItemTypeStates(workItemTypeName);
        }
    }, []);

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

export function WorkItemStateView(props: IWorkItemStateViewOwnProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeStateModule()]}>
            <WorkItemStateViewInternal {...props} />
        </DynamicModuleLoader>
    );
}
