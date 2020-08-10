import "./Root.scss";

import * as React from "react";

import * as SDK from "azure-devops-extension-sdk";
import * as BugBashDirectory_Async from "BugBashPro/Hubs/BugBashDirectory";
import * as BugBashView_Async from "BugBashPro/Hubs/BugBashView";
import { AppView } from "BugBashPro/Shared/Constants";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { Loading } from "Common/Components/Loading";

import { useHashParams } from "../Hooks/useHashParams";

const bugBashDirectoryLoader = async () => import("BugBashPro/Hubs/BugBashDirectory");
const bugBashViewLoader = async () => import("BugBashPro/Hubs/BugBashView");

export function RootComponent() {
    const hashParams = useHashParams();

    React.useEffect(() => {
        SDK.init({ applyTheme: true });
    }, []);

    if (!hashParams) {
        return <Loading />;
    }

    let view: JSX.Element;

    if (!hashParams || !hashParams.view) {
        view = <Loading />;
    } else {
        switch (hashParams.view) {
            case AppView.ACTION_ALL:
                view = (
                    <AsyncComponent loader={bugBashDirectoryLoader} key="directory">
                        {(m: typeof BugBashDirectory_Async) => <m.BugBashDirectory />}
                    </AsyncComponent>
                );
                break;
            case AppView.ACTION_LIST:
            case AppView.ACTION_CHARTS:
            case AppView.ACTION_BOARD:
                view = (
                    <AsyncComponent loader={bugBashViewLoader} key="bugbashview">
                        {(m: typeof BugBashView_Async) => (
                            <m.BugBashView bugBashId={hashParams.bugBashId!} view={hashParams.view} bugBashItemId={hashParams.bugBashItemId} />
                        )}
                    </AsyncComponent>
                );
                break;
            default:
                view = <Loading />;
        }
    }

    return <div className="page-container flex-column flex-grow">{view}</div>;
}
