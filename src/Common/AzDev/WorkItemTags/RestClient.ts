import { IVssRestClientOptions } from "azure-devops-extension-api";
import { RestClientBase } from "azure-devops-extension-api/Common/RestClientBase";
import { WebApiCreateTagRequestData, WebApiTagDefinition } from "azure-devops-extension-api/Core/Core";

export class TaggingRestClient extends RestClientBase {
    public static readonly RESOURCE_AREA_ID = "1F131D7F-CFBB-4EC9-B358-FB4E8341CE59";

    constructor(options: IVssRestClientOptions) {
        super(options);
    }

    public async createTagDefinition(tagData: WebApiCreateTagRequestData, scopeId: string, tagId?: string): Promise<WebApiTagDefinition> {
        return this.beginRequest<WebApiTagDefinition>({
            apiVersion: "5.0-preview.1",
            method: "POST",
            routeTemplate: "_apis/Tagging/scopes/{scopeId}/tags/{tagId}",
            routeValues: {
                scopeId: scopeId,
                tagId: tagId
            },
            body: tagData
        });
    }

    public async deleteTagDefinition(scopeId: string, tagId: string): Promise<void> {
        return this.beginRequest<void>({
            apiVersion: "5.0-preview.1",
            method: "DELETE",
            routeTemplate: "_apis/Tagging/scopes/{scopeId}/tags/{tagId}",
            routeValues: {
                scopeId: scopeId,
                tagId: tagId
            }
        });
    }

    public async getTagDefinition(scopeId: string, tagId: string): Promise<WebApiTagDefinition> {
        return this.beginRequest<WebApiTagDefinition>({
            apiVersion: "5.0-preview.1",
            routeTemplate: "_apis/Tagging/scopes/{scopeId}/tags/{tagId}",
            routeValues: {
                scopeId: scopeId,
                tagId: tagId
            }
        });
    }

    public async getTagDefinitions(scopeId: string, includeInactive?: boolean, artifactKind?: string): Promise<WebApiTagDefinition[]> {
        const queryValues = {
            includeInactive: includeInactive,
            artifactKind: artifactKind
        };

        return this.beginRequest<WebApiTagDefinition[]>({
            apiVersion: "5.0-preview.1",
            routeTemplate: "_apis/Tagging/scopes/{scopeId}/tags/{tagId}",
            routeValues: {
                scopeId: scopeId
            },
            queryParams: queryValues
        });
    }

    public async updateTagDefinition(tagData: WebApiTagDefinition, scopeId: string, tagId: string): Promise<WebApiTagDefinition> {
        return this.beginRequest<WebApiTagDefinition>({
            apiVersion: "5.0-preview.1",
            method: "PATCH",
            routeTemplate: "_apis/Tagging/scopes/{scopeId}/tags/{tagId}",
            routeValues: {
                scopeId: scopeId,
                tagId: tagId
            },
            body: tagData
        });
    }
}
