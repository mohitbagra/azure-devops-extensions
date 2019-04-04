import { CommonServiceIds, IProjectInfo, IProjectPageService } from "azure-devops-extension-api/Common/CommonServices";
import * as SDK from "azure-devops-extension-sdk";
import { isNullOrWhiteSpace } from "./String";

let currentProject: IProjectInfo;

export async function getCurrentProject(): Promise<IProjectInfo> {
    if (!currentProject) {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        if (!project) {
            throw new Error("No project context found");
        }
        currentProject = project;
    }

    return currentProject;
}

export async function getCurrentProjectId(): Promise<string> {
    const project = await getCurrentProject();
    return project.id;
}

export async function getCurrentProjectName(): Promise<string> {
    const project = await getCurrentProject();
    return project.name;
}

export async function resolveProjectId(projectId: string | undefined): Promise<string> {
    if (isNullOrWhiteSpace(projectId)) {
        return getCurrentProjectId();
    }
    return projectId || "";
}

export async function resolveProjectName(projectName: string | undefined): Promise<string> {
    if (isNullOrWhiteSpace(projectName)) {
        return getCurrentProjectName();
    }
    return projectName || "";
}
