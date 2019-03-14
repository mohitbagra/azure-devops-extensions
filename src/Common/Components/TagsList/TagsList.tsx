import "./TagsList.scss";

import * as React from "react";
import { LabelGroup } from "azure-devops-ui/Components/LabelGroup/LabelGroup";
import { WrappingBehavior } from "azure-devops-ui/Label";
import { css } from "azure-devops-ui/Util";

interface ITagsListProps {
    className?: string;
    tags: string[];
    wrappingBehavior?: WrappingBehavior;
}

export function TagsList(props: ITagsListProps) {
    const { tags, className, wrappingBehavior } = props;

    return (
        <div className={css("tags-list", className)}>
            <LabelGroup labelProps={tags.map(tag => ({ content: tag }))} wrappingBehavior={wrappingBehavior} fadeOutOverflow={true} />
        </div>
    );
}
