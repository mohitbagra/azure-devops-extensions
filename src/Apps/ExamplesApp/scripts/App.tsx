import "./App.scss";

import * as SDK from "azure-devops-extension-sdk";
import { WrappingBehavior } from "azure-devops-ui/Label";
import { Page } from "azure-devops-ui/Page";
import { Splitter, SplitterDirection, SplitterElementPosition } from "azure-devops-ui/Splitter";
import { AreaPathPicker } from "Common/AzDev/ClassificationNodes/Components/AreaPathPicker";
import { IterationPathPicker } from "Common/AzDev/ClassificationNodes/Components/IterationPathPicker";
import { FieldPicker } from "Common/AzDev/Fields/Components/FieldPicker";
import { WorkItemFieldValuePicker } from "Common/AzDev/Fields/Components/WorkItemFieldValuePicker";
import { WorkItemRelationTypePicker } from "Common/AzDev/WorkItemRelationTypes/Components";
import { WorkItemTagPicker } from "Common/AzDev/WorkItemTags/Components";
import { WorkItemTitleView } from "Common/AzDev/WorkItemTitleView";
import { WorkItemTypePicker } from "Common/AzDev/WorkItemTypes/Components/WorkItemTypePicker";
import { WorkItemStateView } from "Common/AzDev/WorkItemTypeStates/Components";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { FileUploadDialog } from "Common/Components/FileUploadDialog";
import { IdentityView } from "Common/Components/IdentityView";
import { InfoLabel } from "Common/Components/InfoLabel";
import { InputError } from "Common/Components/InputError";
import * as ColorPicker_Async from "Common/Components/Pickers/ColorPicker";
import { DateTimePicker } from "Common/Components/Pickers/DateTimePicker";
import { MultiValuePicker } from "Common/Components/Pickers/MultiValuePicker";
import { RichEditor } from "Common/Components/RichEditor";
import { TagsList } from "Common/Components/TagsList";
import { TextField } from "Common/Components/TextField";
import { ReduxHooksStoreProvider } from "Common/Redux";
import { getCurrentUser } from "Common/Utilities/Identity";
import { INavLink, Nav } from "OfficeFabric/Nav";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";

interface IAppState {
    selectedNavKey: string;
}

const navKeys: { [key: string]: () => JSX.Element } = {
    ColorPicker: () => (
        <AsyncComponent loader={() => import("Common/Components/Pickers/ColorPicker")}>
            {(m: typeof ColorPicker_Async) => (
                <>
                    <m.ColorPicker label="color picker" info="Colorrrr" required={true} onChange={console.log} />
                    <m.ColorPicker label="disabled color picker" required={true} disabled={true} value="#292E6B" />
                    <m.ColorPicker label="disabled color picker with no value" required={true} disabled={true} />
                    <m.ColorPicker label="Custom error" required={true} getErrorMessage={() => "Custom error"} value="#292E6B" />
                </>
            )}
        </AsyncComponent>
    ),
    DateTimePicker: () => <DateTimePicker value={new Date()} onDateChange={console.log} />,
    FileUploadDialog: () => <FileUploadDialog />,
    IdentityView: () => <IdentityView value={getCurrentUser()} />,
    InfoLabel: () => (
        <div>
            <InfoLabel label="This is label" info="this is info text" />
            <InputError error="This is error" />
        </div>
    ),
    MultiValuePicker: () => (
        <>
            <MultiValuePicker
                allValues={["Hello", "foo", "bar", "mohit", "bagra"]}
                value={["mohit", "bagra", "xyz"]}
                required={true}
                label="Multi value picker"
                info="Select multiple values"
            />
            <MultiValuePicker
                allValues={["Hello", "foo", "bar", "mohit", "bagra"]}
                value={["mohit", "bagra", "xyz"]}
                required={true}
                disabled={true}
                label="Disabled Required Multi value picker"
                info="Select multiple values"
            />
            <MultiValuePicker
                allValues={["Hello", "foo", "bar", "mohit", "bagra"]}
                value={[]}
                required={true}
                getErrorMessage={() => "Custom error"}
                label="Multi value picker"
                info="Select multiple values"
            />
        </>
    ),
    RichEditor: () => (
        <>
            <RichEditor label="Rich editor" info="foo xyz" />
            <RichEditor label="Disabled Rich editor" disabled={true} />
            <RichEditor label="Required Rich editor" info="foo xyz" required={true} />
            <RichEditor label="Required Rich editor with custom error" getErrorMessage={() => "Custom error"} />
        </>
    ),
    SplitterLayout: () => (
        <div style={{ height: "900px", display: "flex" }}>
            <Splitter
                fixedElement={SplitterElementPosition.Far}
                splitterDirection={SplitterDirection.Vertical}
                minFixedSize={300}
                maxFixedSize={600}
                onRenderNearElement={() => <div>Left content</div>}
                onRenderFarElement={() => <div>Right content</div>}
            />
        </div>
    ),
    TextField: () => (
        <>
            <TextField required={true} label="Text field" info="Enabled text field" onChange={console.log} />
            <TextField onChange={console.log} label="Disabled text" info="Disabled text field" disabled={true} placeholder="Disabled value" />
        </>
    ),
    TagsList: () => (
        <div style={{ width: 500 }}>
            <TagsList
                wrappingBehavior={WrappingBehavior.oneLine}
                tags={[
                    "foo",
                    "xyz",
                    "veryyyy yyyy yyyyy yyyy looooooooong",
                    "mohit",
                    "bagra",
                    "mohit bagra",
                    "qwerty",
                    "quadrit",
                    "bhawna",
                    "bhawna bagra"
                ]}
            />
        </div>
    ),
    ClassificationPickers: () => (
        <div>
            <AreaPathPicker required={true} label="Area path picker" info="Pick area path" onChange={console.log} />
            <IterationPathPicker required={true} label="Iteration path picker" info="Pick iteration path" onChange={console.log} />
        </div>
    ),
    WorkItemTypePicker: () => (
        <WorkItemTypePicker
            required={true}
            label="Work item type picker"
            info="Pick work item type"
            selectedValue="Bug"
            onChange={(o, v) => console.log(o ? o.name : v)}
        />
    ),
    WorkItemFieldPicker: () => (
        <FieldPicker required={true} label="Work item field picker" info="Pick work item field" onChange={(o, v) => console.log(o ? o.name : v)} />
    ),
    WorkItemRelationTypePicker: () => (
        <WorkItemRelationTypePicker
            required={true}
            label="Work item relation type picker"
            info="Pick work item relation type"
            selectedValue="Related"
            onChange={(o, v) => console.log(o ? o.name : v)}
        />
    ),
    WorkItemTagPicker: () => (
        <WorkItemTagPicker
            value={["foo", "xyz", "mohit"]}
            required={true}
            label="Work item tags picker"
            info="Pick work item tags"
            onChange={v => console.log(v.join("; "))}
        />
    ),
    StateView: () => (
        <div>
            <WorkItemStateView stateName="New" workItemTypeName="Bug" />
            <WorkItemStateView stateName="Resolved" workItemTypeName="Bug" />
            <WorkItemStateView stateName="Closed" workItemTypeName="Bug" />
            <WorkItemStateView stateName="Active" workItemTypeName="Bug" />
        </div>
    ),
    TitleView: () => (
        <div>
            <WorkItemTitleView workItemId={1} title="Hello world!!" workItemTypeName="Bug" showId={true} />
            <WorkItemTitleView workItemId={2} title="Hello world!!" workItemTypeName="User Story" showId={true} />
            <WorkItemTitleView workItemId={3} title="Hello world!!" workItemTypeName="Task" />
            <WorkItemTitleView workItemId={4} title="Hello world!!" workItemTypeName="Feature" />
        </div>
    ),
    WorkItemFieldValuePicker: () => (
        <div>
            <WorkItemFieldValuePicker label="Area path" fieldRefName="System.AreaPath" workItemTypeName="Bug" onChange={console.log} />
            <WorkItemFieldValuePicker label="Iteration path" fieldRefName="System.IterationPath" workItemTypeName="Bug" onChange={console.log} />
            <WorkItemFieldValuePicker label="State" fieldRefName="System.State" workItemTypeName="Bug" onChange={console.log} />
            <WorkItemFieldValuePicker label="Tags" fieldRefName="System.Tags" workItemTypeName="Bug" onChange={console.log} />
            <WorkItemFieldValuePicker label="CreatedDate" fieldRefName="System.CreatedDate" workItemTypeName="Bug" onChange={console.log} />
            <WorkItemFieldValuePicker label="Description" fieldRefName="System.Description" workItemTypeName="User Story" onChange={console.log} />
        </div>
    )
};

class App extends React.Component<{}, IAppState> {
    private readonly _store: IModuleStore<any>;

    constructor(props: {}) {
        super(props);
        this.state = {
            selectedNavKey: "Badge"
        };

        this._store = createStore(
            {
                workItemState: { workItemsMap: {} }
            },
            [],
            [getSagaExtension()]
        );
    }

    public componentDidMount() {
        SDK.init({ applyTheme: true });
    }

    public render(): JSX.Element {
        return (
            <Page className="fabric-container">
                <Nav
                    groups={[
                        {
                            links: this._getNavGroups()
                        }
                    ]}
                    onLinkClick={this._onNavLinkClick}
                    selectedKey={this.state.selectedNavKey}
                />
                <div className="nav-item-container">
                    <ReduxHooksStoreProvider value={this._store}>{navKeys[this.state.selectedNavKey]()}</ReduxHooksStoreProvider>
                </div>
            </Page>
        );
    }

    private _getNavGroups(): INavLink[] {
        return Object.keys(navKeys).map(key => ({
            name: key,
            key: key,
            url: ""
        }));
    }

    private readonly _onNavLinkClick = (e: React.MouseEvent<HTMLElement>, link: INavLink) => {
        e.preventDefault();
        this.setState({ selectedNavKey: link.name });
    };
}

const container = document.getElementById("ext-container");
ReactDOM.render(<App />, container);
