import * as SDK from "azure-devops-extension-sdk";
import { IIdentity, IPeoplePickerProvider } from "azure-devops-ui/Components/IdentityPickerDropdown/SharedIdentityPicker.Props";

let identityService: IVssIdentityService;

/**
 * Contribution ids of identity services which can be obtained from DevOps.getService
 */
export const enum IdentityServiceIds {
    /**
     * Provides a way to search for identities.
     */
    IdentityService = "ms.vss-features.identity-service"
}

export interface IdentitiesGetConnectionsResponseModel {
    successors?: IIdentity[];
    managers?: IIdentity[];
    directReports?: IIdentity[];
}

export interface IdentitiesSearchRequestModel {
    query: string;
    identityTypes?: string[];
    operationScopes?: string[];
    queryTypeHint?: string;
    pagingToken?: string;
    properties?: string[];
    filterByAncestorEntityIds?: string[];
    filterByEntityIds?: string[];
    options?: any;
}

export interface IVssIdentityService {
    /**
     * Get a list of the Most Recently Used (MRU) identities
     *
     * @returns list of the Most Recently Used (MRU) identities
     */
    getIdentityMruAsync(): Promise<IIdentity[]>;

    /**
     * Given a search request model, return a list of Entities. If the filterIdentity callback is added, additionally filter the values before returning
     *
     * @param query The query to search the identities type with.
     * @param identityTypes The types of identities to search (default "user" and "group")
     * @param operationScopes The scope you would like to search (default "ims", "source")
     * @param queryTypeHint A hint of what property your query is trying to search
     * @param filterIdentity A filter passed in to alter the results of the identities found
     * @param options Additional options to pass into the search
     * @returns The list of filtered identities from the search.
     */
    searchIdentitiesAsync(
        query: string,
        identityTypes?: string[],
        operationScopes?: string[],
        queryTypeHint?: string,
        options?: any,
        filterIdentity?: (returnedEntities: IIdentity[]) => IIdentity[]
    ): Promise<IIdentity[]>;

    /**
     * Add a list of identities to the MRU
     *
     * @param identities list of IdentityRefs to add to the MRU
     * @returns True if the item was added, false otherwise
     */
    addMruIdentitiesAsync(identities: IIdentity[]): Promise<boolean>;

    /**
     * Remove a list of identities from the MRU
     *
     * @param identities list of IdentityRefs to remove from the MRU
     * @returns True if the item was removed, false otherwise
     */
    removeMruIdentitiesAsync(identity: IIdentity[]): Promise<boolean>;

    /**
     * Gets a list of connections for a given identity
     *
     * @param identity Entity to look up connections
     * @returns Connections for the given identity
     */
    getConnections(identity: IIdentity, getDirectReports?: boolean): Promise<IdentitiesGetConnectionsResponseModel>;
}

export async function getIdentityService(): Promise<IVssIdentityService> {
    if (!identityService) {
        identityService = await SDK.getService<IVssIdentityService>(IdentityServiceIds.IdentityService);
    }

    return identityService;
}

export class PeoplePickerProvider implements IPeoplePickerProvider {
    constructor(private _identityTypes: string[] = ["user", "group"]) {}

    public async addIdentitiesToMRU(identities: IIdentity[]): Promise<boolean> {
        const identityService = await getIdentityService();
        return identityService.addMruIdentitiesAsync(identities);
    }

    public getEntityFromUniqueAttribute(entityId: string): IIdentity | PromiseLike<IIdentity> {
        return getIdentityService().then(identityService => {
            return identityService.searchIdentitiesAsync(entityId, this._identityTypes, ["ims", "source"], "uid").then(x => x[0]);
        });
    }

    public onEmptyInputFocus(): IIdentity[] | PromiseLike<IIdentity[]> {
        return getIdentityService().then(identityService => {
            return identityService.getIdentityMruAsync().then(identities => {
                return identities.map(this._identityMapper);
            });
        });
    }

    public onFilterIdentities(filter: string, selectedItems?: IIdentity[]): Promise<IIdentity[]> | IIdentity[] {
        return this._onSearchPersona(filter, selectedItems ? selectedItems : []);
    }

    public onRequestConnectionInformation(
        entity: IIdentity,
        getDirectReports?: boolean
    ): IdentitiesGetConnectionsResponseModel | PromiseLike<IdentitiesGetConnectionsResponseModel> {
        return getIdentityService().then(identityService => {
            return identityService.getConnections(entity, getDirectReports);
        });
    }

    public async removeIdentitiesFromMRU(identities: IIdentity[]): Promise<boolean> {
        const identityService = await getIdentityService();
        return identityService.removeMruIdentitiesAsync(identities);
    }

    private async _onSearchPersona(searchText: string, items: IIdentity[]): Promise<IIdentity[]> {
        const identityService = await getIdentityService();
        const identities = await identityService.searchIdentitiesAsync(searchText, this._identityTypes, ["ims", "source"]);

        return identities
            .filter(identity => !items.some(selectedIdentity => selectedIdentity.entityId === identity.entityId))
            .map(this._identityMapper);
    }

    private _identityMapper = (identity: IIdentity): IIdentity => {
        return identity.image ? { ...identity, image: this._convertImage(identity.image) } : identity;
    };

    private _convertImage(image: string): string {
        if (image.startsWith("http")) {
            return image;
        } else if (image.startsWith("/")) {
            return `https://dev.azure.com${image}`;
        } else {
            return `https://dev.azure.com/${image}`;
        }
    }
}
