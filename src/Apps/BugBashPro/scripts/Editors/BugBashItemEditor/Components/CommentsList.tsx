import "./CommentsList.scss";

import * as React from "react";

import { ago } from "azure-devops-ui/Utilities/Date";
import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { useComments } from "BugBashPro/Shared/Hooks/useComments";
import { IdentityView } from "Common/Components/IdentityView";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";

interface ICommentsListProps {
    bugBashItemId: string;
}

export function CommentsList(props: ICommentsListProps) {
    const { bugBashItemId } = props;
    const { comments, status } = useComments(bugBashItemId);

    if (!comments || status === LoadStatus.Loading) {
        return <Loading />;
    } else if (comments.length === 0) {
        return null;
    } else {
        return <div className="comments-container">{comments.map(renderComment)}</div>;
    }
}

function renderComment(item: IBugBashItemComment): JSX.Element {
    const { createdBy, createdDate, content } = item;
    return (
        <div className="comment-item flex-row" key={`comment_${item.id!}`}>
            <div className="flex-noshrink comment-identity">
                <IdentityView value={createdBy} avatarOnly={true} size={"medium"} />
            </div>
            <div className="flex-column flex-grow comment-content">
                <div className="flex-noshrink flex-row">
                    <span className="comment-created-by font-size font-weight-semibold">{createdBy.displayName}</span>
                    <span className="comment-created-date font-size-s">commented {ago(createdDate)}</span>
                </div>
                <div className="flex-grow comment-text" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}
