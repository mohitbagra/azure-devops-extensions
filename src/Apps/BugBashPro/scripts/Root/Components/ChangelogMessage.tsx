import "./Root.scss";

import * as React from "react";
import { Link } from "azure-devops-ui/Link";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { useChangeVersion } from "../Hooks/useChangeVersion";

export function ChangelogMessage() {
    const [changeVersion, setChangelogVersionToLatest] = useChangeVersion();

    if (changeVersion) {
        return (
            <div className="flex-column flex-noshrink">
                <MessageCard className="changelog-message" onDismiss={setChangelogVersionToLatest} severity={MessageCardSeverity.Info}>
                    {`Extension upgraded to version ${changeVersion}.`}&nbsp;
                    <Link target="_blank" href="https://marketplace.visualstudio.com/items?itemName=mohitbagra.bugbashpro#changelog">
                        View the changelog.
                    </Link>
                </MessageCard>
            </div>
        );
    }
    return null;
}
