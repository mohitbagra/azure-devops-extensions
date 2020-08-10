import * as React from "react";

import { Link } from "azure-devops-ui/Link";
import { Tooltip } from "azure-devops-ui/TooltipEx";

import { AsyncComponent } from "./AsyncComponent";

interface IAsyncLinkComponentProps {
    className?: string;
    getHrefAsync: () => Promise<string>;
    title: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void;
}

function getUnresolvedLinkComponent(title: string, className?: string): () => JSX.Element {
    return () => (
        <Tooltip overflowOnly={true}>
            <Link className={className} href="">
                {title}
            </Link>
        </Tooltip>
    );
}

export function AsyncLinkComponent(props: IAsyncLinkComponentProps) {
    const { className, getHrefAsync, title, onClick } = props;
    return (
        <AsyncComponent<string>
            loader={getHrefAsync}
            loadingComponent={getUnresolvedLinkComponent(title, className)}
            errorComponent={getUnresolvedLinkComponent(title, className)}
        >
            {(href: string) => (
                <Tooltip overflowOnly={true}>
                    <Link className={className} href={href} onClick={onClick}>
                        {title}
                    </Link>
                </Tooltip>
            )}
        </AsyncComponent>
    );
}
