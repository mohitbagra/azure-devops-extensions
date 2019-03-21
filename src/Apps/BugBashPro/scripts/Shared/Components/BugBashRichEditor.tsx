import { getClient } from "azure-devops-extension-api";
import { GitPush, GitRestClient, ItemContentType, VersionControlChangeType } from "azure-devops-extension-api/Git";
import { BugBashItemEditorErrorKey } from "BugBashPro/BugBashItemEditor/Constants";
import { getBugBashSettingsModule } from "BugBashPro/Redux/Settings";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { IRichEditorProps, RichEditor } from "Common/Components/RichEditor";

import { useProjectSetting } from "BugBashPro/Hooks/useProjectSetting";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { KeyValuePairActions } from "Common/Notifications/Redux";
import { getProjectUrlAsync } from "Common/Utilities/UrlHelper";
import { getCurrentProjectId } from "Common/Utilities/WebContext";
import * as React from "react";

interface IBugBashRichEditorProps extends IRichEditorProps {
    bugBashId: string;
}

const Actions = {
    pushError: KeyValuePairActions.pushEntry
};

function BugBashRichEditorInternal(props: IBugBashRichEditorProps) {
    const { bugBashId } = props;
    const { projectSetting, status } = useProjectSetting();
    const { pushError } = useActionCreators(Actions);

    if (!projectSetting || status === LoadStatus.Loading) {
        return <Loading />;
    }

    const uploadImage = async (file: File) => {
        return new Promise<string>(async resolve => {
            const gitMediaRepo = projectSetting && projectSetting.gitMediaRepo;
            if (gitMediaRepo) {
                const reader = new FileReader();

                reader.onload = async (event: ProgressEvent) => {
                    const imageData: string = (event.target as any).result;
                    try {
                        const dataStartIndex = imageData.indexOf(",") + 1;
                        const metaPart = imageData.substring(5, dataStartIndex - 1);
                        const dataPart = imageData.substring(dataStartIndex);

                        const extension = metaPart
                            .split(";")[0]
                            .split("/")
                            .pop();
                        const fileName = `pastedImage_${Date.now().toString()}.${extension}`;
                        const gitPath = `BugBash_${bugBashId}/pastedImages/${fileName}`;

                        const gitClient = await getClient(GitRestClient);
                        const projectId = await getCurrentProjectId();
                        const projectUrl = await getProjectUrlAsync();

                        const gitItem = await gitClient.getItem(gitMediaRepo, "/", projectId);
                        const pushModel = buildGitPush(
                            gitPath,
                            gitItem.commitId,
                            VersionControlChangeType.Add,
                            dataPart,
                            ItemContentType.Base64Encoded
                        );
                        await gitClient.createPush(pushModel, gitMediaRepo, projectId);

                        resolve(
                            `${projectUrl}/_api/_versioncontrol/itemContent?repositoryId=${gitMediaRepo}&path=${encodeURIComponent(
                                gitPath
                            )}&version=GBmaster&contentOnly=true`
                        );
                    } catch (e) {
                        pushError(BugBashItemEditorErrorKey, `Image copy failed. Error: ${e.message}`);
                        resolve("");
                    }
                };
                reader.readAsDataURL(file);
            } else {
                resolve("");
            }
        });
    };

    const richEditorProps: IRichEditorProps = {
        ...props,
        uploadImageHandler: uploadImage
    };

    return <RichEditor {...richEditorProps} />;
}

function buildGitPush(
    path: string,
    oldObjectId: string,
    changeType: VersionControlChangeType,
    content: string,
    contentType: ItemContentType
): GitPush {
    const commits = [
        {
            comment: "Adding new image from bug bash pro extension",
            changes: [
                {
                    changeType,
                    item: { path },
                    newContent:
                        content !== undefined
                            ? {
                                  content,
                                  contentType
                              }
                            : undefined
                }
            ]
        }
    ];

    return {
        refUpdates: [
            {
                name: "refs/heads/master",
                oldObjectId: oldObjectId
            }
        ],
        commits
    } as GitPush;
}

export function BugBashRichEditor(props: IBugBashRichEditorProps) {
    return (
        <DynamicModuleLoader modules={[getBugBashSettingsModule()]}>
            <BugBashRichEditorInternal {...props} />
        </DynamicModuleLoader>
    );
}
