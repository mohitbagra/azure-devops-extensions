import "./CommentsList.scss";

import { ago } from "azure-devops-ui/Utilities/Date";
import { useComments } from "BugBashPro/Hooks/useComments";
import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { IdentityView } from "Common/Components/IdentityView";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import * as React from "react";

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
        <div className="comment-item flex-row h-scroll-hidden" key={`comment_${item.id!}`}>
            <div className="flex-noshrink comment-identity">
                <IdentityView value={createdBy} avatarOnly={true} size={"medium"} />
            </div>
            <div className="flex-column flex-grow comment-content">
                <div className="flex-noshrink flex-row">
                    <span className="comment-created-by fontSize fontWeightSemiBold">{createdBy.displayName}</span>
                    <span className="comment-created-date fontSizeS">commented {ago(createdDate)}</span>
                </div>
                <div className="flex-grow comment-text" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}
