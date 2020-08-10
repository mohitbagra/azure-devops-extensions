import * as React from "react";

import { Image } from "azure-devops-ui/Image";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";

import { useWorkItemType } from "../Hooks/useWorkItemType";
import { getWorkItemTypeModule } from "../Redux/Module";

interface IWorkItemTypeIconProps extends IBaseProps {
    workItemTypeName: string;
    width?: number;
}

function WorkItemTypeIconInternal(props: IWorkItemTypeIconProps) {
    const { workItemTypeName, width, className } = props;
    const { workItemType } = useWorkItemType(workItemTypeName);

    if (workItemType && workItemType.icon) {
        return (
            <Tooltip text={workItemType.name}>
                {Image({
                    className: className,
                    src: workItemType.icon.url,
                    alt: workItemType.name,
                    containImage: true,
                    width: width || 14
                })}
            </Tooltip>
        );
    }

    return null;
}

export function WorkItemTypeIcon(props: IWorkItemTypeIconProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeModule()]}>
            <WorkItemTypeIconInternal {...props} />
        </DynamicModuleLoader>
    );
}
