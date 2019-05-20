import { getExtensionContext } from "azure-devops-extension-sdk";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { HeaderCommandBarWithFilter } from "azure-devops-ui/HeaderCommandBar";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { Filter, FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { openNewWindow } from "Common/ServiceWrappers/HostNavigationService";
import { getContributionHubUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistLabels } from "../../Hooks/useChecklistLabels";
import { useChecklistSettings } from "../../Hooks/useChecklistSettings";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistType } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { ChecklistSettingsActions } from "../../Redux/Settings/Actions";

interface IChecklistGroupTabBarProps {
    selectedTabId: ChecklistType;
    onSelectedTabChanged: (selectedTabId: ChecklistType) => void;
}

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested,
    toggleWordWrap: ChecklistSettingsActions.toggleWordWrap,
    toggleHideCompletedItems: ChecklistSettingsActions.toggleHideCompletedItems,
    toggleShowLabels: ChecklistSettingsActions.toggleShowLabels,
    applyFilter: ChecklistActions.applyFilter
};

export function ChecklistGroupTabBar(props: IChecklistGroupTabBarProps) {
    const { selectedTabId, onSelectedTabChanged } = props;
    const idOrType = React.useContext(ChecklistContext);
    const status = useChecklistStatus(idOrType);
    const { loadChecklist, toggleWordWrap, toggleHideCompletedItems, toggleShowLabels, applyFilter } = useActionCreators(Actions);
    const availableLabels = useChecklistLabels();
    const { wordWrap, hideCompletedItems, showLabels } = useChecklistSettings();
    const disabled = status === LoadStatus.Loading || status === LoadStatus.NotLoaded || status === LoadStatus.Updating;

    const filterRef = React.useRef<Filter>(
        new Filter({
            useApplyMode: false
        })
    );
    const filterToggledRef = React.useRef(new ObservableValue<boolean>(false));
    const listSelection = React.useRef(new DropdownMultiSelection());

    const onFilterChange = React.useCallback(() => {
        applyFilter(filterRef.current.getState());
    }, []);

    React.useEffect(() => {
        filterRef.current.subscribe(onFilterChange, FILTER_CHANGE_EVENT);
        return () => {
            filterRef.current.unsubscribe(onFilterChange, FILTER_CHANGE_EVENT);
        };
    }, []);

    const onFilterBarDismissClicked = React.useCallback(() => {
        filterToggledRef.current.value = !filterToggledRef.current.value;
    }, []);

    const renderTabBarCommands = React.useCallback(
        () => (
            <HeaderCommandBarWithFilter
                filter={filterRef.current}
                filterToggled={filterToggledRef.current}
                items={[
                    {
                        subtle: true,
                        id: "refresh",
                        onActivate: () => {
                            loadChecklist(idOrType);
                        },
                        tooltipProps: { text: "Refresh" },
                        disabled: disabled,
                        iconProps: {
                            iconName: "Refresh"
                        }
                    },
                    {
                        subtle: true,
                        id: "settings",
                        disabled: disabled,
                        iconProps: {
                            iconName: "Equalizer"
                        },
                        subMenuProps: {
                            id: "settings-submenu",
                            items: [
                                {
                                    id: "open-settings-page",
                                    text: "Configure",
                                    iconProps: { iconName: "Settings" },
                                    onActivate: () => {
                                        const { publisherId, extensionId } = getExtensionContext();
                                        const contributionId = `${publisherId}.${extensionId}.settings-hub`;
                                        getContributionHubUrlAsync(contributionId).then(url => openNewWindow(url));
                                    }
                                },
                                {
                                    id: "word-wrap",
                                    text: "Word Wrap",
                                    iconProps: wordWrap ? { iconName: "CheckMark" } : undefined,
                                    onActivate: () => {
                                        toggleWordWrap();
                                    }
                                },
                                {
                                    id: "hide-completed",
                                    text: "Hide completed items",
                                    iconProps: hideCompletedItems ? { iconName: "CheckMark" } : undefined,
                                    onActivate: () => {
                                        toggleHideCompletedItems();
                                    }
                                },
                                {
                                    id: "show-labels",
                                    text: "Show item labels",
                                    iconProps: showLabels ? { iconName: "CheckMark" } : undefined,
                                    onActivate: () => {
                                        toggleShowLabels();
                                    }
                                }
                            ]
                        }
                    }
                ]}
            />
        ),
        [idOrType, hideCompletedItems, wordWrap, showLabels, disabled]
    );

    return (
        <>
            <TabBar
                className="checklist-tabbar"
                tabSize={TabSize.Compact}
                selectedTabId={selectedTabId}
                onSelectedTabChanged={onSelectedTabChanged}
                renderAdditionalContent={renderTabBarCommands}
            >
                <Tab name="Shared" id={ChecklistType.Shared} />
                <Tab name="Personal" id={ChecklistType.Personal} />
            </TabBar>
            <ConditionalChildren renderChildren={filterToggledRef.current}>
                <FilterBar filter={filterRef.current} onDismissClicked={onFilterBarDismissClicked}>
                    <DropdownFilterBarItem
                        filterItemKey="labels"
                        items={availableLabels.map(label => ({ id: label.toLowerCase(), text: label }))}
                        selection={listSelection.current}
                        noItemsText="No items"
                        showFilterBox={true}
                        filterPlaceholderText="Search"
                        placeholder="Filter by labels"
                    />
                </FilterBar>
            </ConditionalChildren>
        </>
    );
}
