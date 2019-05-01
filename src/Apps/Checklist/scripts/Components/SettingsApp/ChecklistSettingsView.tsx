import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { Tab, TabList, TabSize } from "azure-devops-ui/Tabs";
import { WorkItemTypeIcon } from "Common/AzDev/WorkItemTypes/Components/WorkItemTypeIcon";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { ChecklistType } from "../../Interfaces";
import { ChecklistError } from "../Shared/ChecklistError";
import { ChecklistItemEditor } from "../Shared/ChecklistItemEditor";
import { ChecklistItemsProvider } from "../Shared/ChecklistItemsProvider";
import { ChecklistView } from "../Shared/ChecklistView";
import { ChecklistSettingsHeader } from "./ChecklistSettingsHeader";

interface IChecklistSettingsViewProps {
    workItemTypes: WorkItemType[];
}

export function ChecklistSettingsView(props: IChecklistSettingsViewProps) {
    const { workItemTypes } = props;
    const [selectedWorkItemType, setSelectedWorkItemType] = React.useState(workItemTypes[0].name);

    const onSelectedTabChanged = React.useCallback((selectedTab: string) => {
        setSelectedWorkItemType(selectedTab);
    }, []);

    return (
        <ChecklistContext.Provider value={selectedWorkItemType}>
            <TabList
                className="checklist-tabbar"
                tabSize={TabSize.Tall}
                selectedTabId={selectedWorkItemType}
                onSelectedTabChanged={onSelectedTabChanged}
            >
                {workItemTypes.map(w => (
                    <Tab
                        key={w.name}
                        name={w.name}
                        id={w.name}
                        iconProps={{
                            render: () => <WorkItemTypeIcon className="tab-icon flex-noshrink" workItemTypeName={w.name} />
                        }}
                    />
                ))}
            </TabList>
            <div className="flex-column flex-grow">
                <ChecklistSettingsHeader />

                <div className="checklist-contents flex-grow flex-column">
                    <ChecklistError className="flex-noshrink" />
                    <ChecklistItemsProvider checklistType={ChecklistType.WitDefault}>
                        {({ witDefault }) => {
                            return <ChecklistView checklistType={ChecklistType.WitDefault} checklistItems={witDefault} />;
                        }}
                    </ChecklistItemsProvider>
                    <ChecklistItemEditor checklistType={ChecklistType.WitDefault} className="flex-noshrink" />
                </div>
            </div>
        </ChecklistContext.Provider>
    );
}
