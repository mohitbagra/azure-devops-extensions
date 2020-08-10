import "./HtmlEditor.scss";

import * as React from "react";

import { TimerManagement } from "azure-devops-ui/Core/TimerManagement";
import { css } from "azure-devops-ui/Util";
import { IIconOptions, IIconSubset, registerIcons } from "office-ui-fabric-react/lib/Styling";
import {
    Browser,
    ContentChangedPlugin,
    DoubleClickImagePlugin,
    EditorPlugin,
    EditorViewState,
    EmojiPaneProps,
    EmojiPlugin,
    EmojiPluginOptions,
    FocusEventHandler,
    FocusOutShell,
    fromHtml,
    IgnorePasteImagePlugin,
    ImageManager,
    ImageManagerOptions,
    ImageResize,
    isNodeEmpty,
    LeanRooster,
    PasteImagePlugin,
    RoosterCommandBar,
    RoosterCommandBarButton,
    RoosterCommandBarPlugin,
    RoosterCommandBarPluginOptions,
    RoosterCommmandBarButtonKeys,
    TableResize,
    UndoWithImagePlugin
} from "roosterjs-react";

import { Resources } from "./Resources";
import { CommandBarLocaleStrings, SearchForEmoji } from "./Strings";

const HyperlinkShortcut = Browser.isMac ? Resources.CommandClickToOpen : Resources.CtrlClickToOpen;
const PlaceholderImageClassName = "html-editor-img-placeholder";
const ExcludePlaceholderSelector = `:not(.${PlaceholderImageClassName})`;

// we currently don't support file drop
const PreventFileDropHandler = (ev: React.DragEvent<HTMLElement>) => {
    const { dataTransfer } = ev.nativeEvent;
    if (!dataTransfer || !dataTransfer.types) {
        return;
    }

    const fileType = "Files";
    const types = dataTransfer.types as any;
    // IE11 has contains but not indexOf
    if ((types.indexOf && types.indexOf(fileType)) || (types.contains && types.contains(fileType))) {
        ev.preventDefault();
        try {
            dataTransfer.dropEffect = "none"; // IE11 throws an error
        } catch {
            // no op
        }

        return false;
    }
};

interface IHtmlEditorProps {
    htmlContent: string;
    className?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    readonly?: boolean;
    uploadImageHandler?: (file: File) => Promise<string>;
    height?: number | string;
    autoFocus?: boolean;
}
export function initializeIcons(baseUrl = "", options?: IIconOptions): void {
    const subset: IIconSubset = {
        style: {
            MozOsxFontSmoothing: "grayscale",
            WebkitFontSmoothing: "antialiased",
            fontStyle: "normal",
            fontWeight: "normal",
            speak: "none"
        },
        fontFace: {
            fontFamily: `"AzureDevOpsMDL2Assets"`,
            src: `url('${baseUrl}AzDevMDL2.woff') format('woff')`
        },
        icons: {
            Insights: "\uE3AF",
            GlobalNavButton: "\uE700",
            Airplane: "\uE709",
            ChevronDown: "\uE70D",
            ChevronUp: "\uE70E",
            Edit: "\uE70F",
            Add: "\uE710",
            Cancel: "\uE711",
            More: "\uE712",
            Settings: "\uE713",
            Video: "\uE714",
            Mail: "\uE715",
            People: "\uE716",
            Phone: "\uE717",
            Pin: "\uE718",
            Shop: "\uE719",
            Link: "\uE71B",
            Filter: "\uE71C",
            Zoom: "\uE71E",
            ZoomOut: "\uE71F",
            Search: "\uE721",
            Attach: "\uE723",
            Send: "\uE724",
            FavoriteList: "\uE728",
            Forward: "\uE72A",
            Back: "\uE72B",
            Refresh: "\uE72C",
            Share: "\uE72D",
            Lock: "\uE72E",
            BlockedSite: "\uE72F",
            ReportHacked: "\uE730",
            EMI: "\uE731",
            Blocked: "\uE733",
            FavoriteStar: "\uE734",
            FavoriteStarFill: "\uE735",
            ReadingMode: "\uE736",
            Remove: "\uE738",
            CheckboxComposite: "\uE73A",
            CheckboxCompositeReversed: "\uE73D",
            CheckMark: "\uE73E",
            BackToWindow: "\uE73F",
            FullScreen: "\uE740",
            Print: "\uE749",
            Up: "\uE74A",
            Down: "\uE74B",
            OEM: "\uE74C",
            Delete: "\uE74D",
            Save: "\uE74E",
            Flashlight: "\uE754",
            Sad: "\uE757",
            MultiSelect: "\uE762",
            KeyboardClassic: "\uE765",
            Play: "\uE768",
            Pause: "\uE769",
            ChevronLeft: "\uE76B",
            ChevronRight: "\uE76C",
            Emoji2: "\uE76E",
            SearchAndApps: "\uE773",
            Globe: "\uE774",
            ContactInfo: "\uE779",
            Unpin: "\uE77A",
            Contact: "\uE77B",
            Paste: "\uE77F",
            WindowsLogo: "\uE782",
            Error: "\uE783",
            Unlock: "\uE785",
            Calendar: "\uE787",
            Megaphone: "\uE789",
            Color: "\uE790",
            SaveAs: "\uE792",
            Undo: "\uE7A7",
            RedEye: "\uE7B3",
            Package: "\uE7B8",
            Warning: "\uE7BA",
            ShoppingCart: "\uE7BF",
            Flag: "\uE7C1",
            Page: "\uE7C3",
            Car: "\uE804",
            EatDrink: "\uE807",
            Home: "\uE80F",
            SwitcherStartEnd: "\uE810",
            IncidentTriangle: "\uE814",
            History: "\uE81C",
            Work: "\uE821",
            Recent: "\uE823",
            LocationDot: "\uE827",
            Dictionary: "\uE82D",
            SemanticZoom: "\uE833",
            Pinned: "\uE840",
            RevToggleKey: "\uE845",
            View: "\uE890",
            Previous: "\uE892",
            Next: "\uE893",
            Clear: "\uE894",
            Download: "\uE896",
            Help: "\uE897",
            Upload: "\uE898",
            Emoji: "\uE899",
            ClosePane: "\uE89F",
            OpenPane: "\uE8A0",
            ZoomIn: "\uE8A3",
            ViewAll: "\uE8A9",
            Switch: "\uE8AB",
            Rename: "\uE8AC",
            Import: "\uE8B5",
            Folder: "\uE8B7",
            ChromeClose: "\uE8BB",
            ShowResults: "\uE8BC",
            PaymentCard: "\uE8C7",
            Copy: "\uE8C8",
            FontColor: "\uE8D3",
            Permissions: "\uE8D7",
            Italic: "\uE8DB",
            Underline: "\uE8DC",
            Bold: "\uE8DD",
            Like: "\uE8E1",
            FontSize: "\uE8E9",
            Tag: "\uE8EC",
            Library: "\uE8F1",
            BlockContact: "\uE8F8",
            AddFriend: "\uE8FA",
            Accept: "\uE8FB",
            BulletedList: "\uE8FD",
            Preview: "\uE8FF",
            Chat: "\uE901",
            Group: "\uE902",
            World: "\uE909",
            Comment: "\uE90A",
            Repair: "\uE90F",
            Accounts: "\uE910",
            Stopwatch: "\uE916",
            Clock: "\uE917",
            WorldClock: "\uE918",
            Completed: "\uE930",
            MiniExpand: "\uE93A",
            Streaming: "\uE93E",
            Code: "\uE943",
            LightningBolt: "\uE945",
            Info: "\uE946",
            CalculatorAddition: "\uE948",
            MediaStorageTower: "\uE965",
            ChevronUpSmall: "\uE96D",
            ChevronDownSmall: "\uE96E",
            ChevronLeftSmall: "\uE96F",
            ChevronRightSmall: "\uE970",
            ChevronUpMed: "\uE971",
            ChevronDownMed: "\uE972",
            ChevronLeftMed: "\uE973",
            ChevronRightMed: "\uE974",
            PC1: "\uE977",
            Reply: "\uE97A",
            Chart: "\uE999",
            LockSolid: "\uE9A2",
            DashKey: "\uE9AE",
            CloudWeather: "\uE9BE",
            Cloudy: "\uE9BF",
            Unknown: "\uE9CE",
            SortLines: "\uE9D0",
            Ribbon: "\uE9D1",
            Assign: "\uE9D3",
            FlowChart: "\uE9D4",
            CheckList: "\uE9D5",
            Diagnostic: "\uE9D9",
            Equalizer: "\uE9E9",
            Processing: "\uE9F5",
            WorkFlow: "\uEA01",
            Diamond2Solid: "\uEA0A",
            Teamwork: "\uEA12",
            PeopleAdd: "\uEA15",
            DateTime2: "\uEA17",
            Shield: "\uEA18",
            PageAdd: "\uEA1A",
            NumberedList: "\uEA1C",
            PowerBILogo: "\uEA1E",
            MusicInCollectionFill: "\uEA36",
            List: "\uEA37",
            ErrorBadge: "\uEA39",
            CircleRing: "\uEA3A",
            CircleFill: "\uEA3B",
            Lightbulb: "\uEA80",
            Puzzle: "\uEA86",
            Ringer: "\uEA8F",
            PDF: "\uEA90",
            CirclePlus: "\uEAEE",
            StockDown: "\uEB0F",
            StockUp: "\uEB11",
            MSNVideos: "\uEB1C",
            Soccer: "\uEB21",
            CollegeFootball: "\uEB26",
            ProFootball: "\uEB27",
            Snowflake: "\uEB46",
            AirplaneSolid: "\uEB4C",
            Heart: "\uEB51",
            HeartFill: "\uEB52",
            AzureLogo: "\uEB6A",
            OfficeLogo: "\uEB6E",
            SkypeLogo: "\uEB6F",
            StatusErrorFull: "\uEB90",
            Certificate: "\uEB95",
            Rewind: "\uEB9E",
            Photo2: "\uEB9F",
            OpenSource: "\uEBC2",
            Project: "\uEBC6",
            CloudDownload: "\uEBD3",
            CityNext: "\uEC06",
            Documentation: "\uEC17",
            Giftbox: "\uEC1F",
            VisualStudioLogo: "\uEC22",
            CompletedSolid: "\uEC61",
            MicrosoftLogo: "\uEC6A",
            CloudUpload: "\uEC8E",
            ScrollUpDown: "\uEC8F",
            Tiles: "\uECA5",
            Org: "\uECA6",
            PartyLeader: "\uECA7",
            AppIconDefault: "\uECAA",
            POI: "\uECAF",
            AddTo: "\uECC8",
            RadioBtnOff: "\uECCA",
            RadioBtnOn: "\uECCB",
            ExploreContent: "\uECCD",
            Embed: "\uECCE",
            Product: "\uECDC",
            ProgressLoopOuter: "\uECDF",
            Blocked2: "\uECE4",
            FangBody: "\uECEB",
            ChatInviteFriend: "\uECFE",
            Feedback: "\uED15",
            YammerLogo: "\uED19",
            AADLogo: "\uED68",
            AccessLogo: "\uED69",
            SecurityGroup: "\uED85",
            Table: "\uED86",
            Waffle: "\uED89",
            RemoveLink: "\uED90",
            EditNote: "\uED9D",
            DoubleChevronUp: "\uEDBD",
            DoubleChevronLeft: "\uEDBE",
            DoubleChevronRight: "\uEDBF",
            Ascending: "\uEDC0",
            Descending: "\uEDC1",
            TextField: "\uEDC3",
            Dynamics365Logo: "\uEDCC",
            ClearFormatting: "\uEDDD",
            Strikethrough: "\uEDE0",
            Export: "\uEDE1",
            ExportMirrored: "\uEDE2",
            DoubleChevronDown: "\uEE04",
            ReplyMirrored: "\uEE35",
            AddGroup: "\uEE3D",
            SortUp: "\uEE68",
            SortDown: "\uEE69",
            AwayStatus: "\uEE6A",
            MyMoviesTV: "\uEE6C",
            CPU: "\uEEA1",
            ContactCard: "\uEEBD",
            CustomList: "\uEEBE",
            OfflineOneDriveParachute: "\uEEC8",
            OfflineOneDriveParachuteDisabled: "\uEEC9",
            TriangleSolidUp12: "\uEECC",
            TriangleSolidDown12: "\uEECD",
            TriangleSolidRight12: "\uEECF",
            TriangleRight12: "\uEED3",
            ArrowUpRight8: "\uEED4",
            DocumentSet: "\uEED6",
            ArrowDownRightMirrored8: "\uEEF0",
            ViewAll2: "\uEF56",
            PlayerSettings: "\uEF58",
            ReceiptCheck: "\uEF5B",
            EditStyle: "\uEF60",
            Lifesaver: "\uEF62",
            DocumentSearch: "\uEF6C",
            ExcelDocument: "\uEF73",
            Starburst: "\uEF78",
            SkypeCircleCheck: "\uEF7D",
            SkypeCircleMinus: "\uEF7F",
            SkypeMinus: "\uEF82",
            Hide2: "\uEF89",
            ClearFilter: "\uEF8F",
            TimeEntry: "\uEF95",
            PageEdit: "\uEFB6",
            PageArrowRight: "\uEFB8",
            Database: "\uEFC7",
            ConnectContacts: "\uEFD4",
            ActivateOrders: "\uEFE0",
            ZipFolder: "\uF012",
            Configuration: "\uF01E",
            TextDocument: "\uF029",
            Script: "\uF03A",
            ActivityFeed: "\uF056",
            CaretSolidDown: "\uF08E",
            FabricFolder: "\uF0A9",
            FabricFolderFill: "\uF0AA",
            FabricNewFolder: "\uF0AB",
            PublishContent: "\uF0D4",
            CannedChat: "\uF0F2",
            SettingsApp: "\uF0FF",
            FolderHorizontal: "\uF12B",
            GiftboxOpen: "\uF133",
            StatusCircleInner: "\uF137",
            StatusCircleRing: "\uF138",
            StatusCircleErrorX: "\uF13D",
            StatusCircleCheckmark: "\uF13E",
            InfoSolid: "\uF167",
            ProgressRingDots: "\uF16A",
            WordLogo: "\uF1E3",
            ExcelLogo: "\uF1E5",
            OneNoteLogo: "\uF1E7",
            OutlookLogo: "\uF1E9",
            PowerPointLogo: "\uF1EB",
            ScheduleEventAction: "\uF1EF",
            FlameSolid: "\uF1F3",
            ServerProcesses: "\uF1FE",
            Server: "\uF201",
            SaveAll: "\uF203",
            TwoKeys: "\uF229",
            GridViewSmall: "\uF232",
            ViewDashboard: "\uF246",
            ViewList: "\uF247",
            ViewListGroup: "\uF248",
            ViewListTree: "\uF249",
            TriggerAuto: "\uF24A",
            TriggerUser: "\uF24B",
            StackedBarChart: "\uF24D",
            StackedLineChart: "\uF24E",
            BuildQueue: "\uF24F",
            BuildQueueNew: "\uF250",
            UserFollowed: "\uF25C",
            Clicked: "\uF268",
            Signin: "\uF286",
            CloneToDesktop: "\uF28C",
            Build: "\uF28F",
            BranchFork2: "\uF291",
            BranchCommit: "\uF293",
            BranchMerge: "\uF295",
            BranchPullRequest: "\uF296",
            BranchShelveset: "\uF298",
            RawSource: "\uF299",
            RowsGroup: "\uF29B",
            Deploy: "\uF29D",
            ServerEnviroment: "\uF29F",
            VisioLogo: "\uF2A7",
            Backlog: "\uF2AC",
            TeamFavorite: "\uF2AD",
            TaskGroup: "\uF2AE",
            CommentAdd: "\uF2B3",
            ShopServer: "\uF2B6",
            QueryList: "\uF2B8",
            StreamingOff: "\uF2BB",
            MoreVertical: "\uF2BC",
            ArrowTallUpRight: "\uF2BE",
            RingerOff: "\uF2C5",
            PlayResume: "\uF2C6",
            Repo: "\uF2CB",
            FolderQuery: "\uF2CD",
            FolderList: "\uF2CE",
            CirclePauseSolid: "\uF2D8",
            CirclePause: "\uF2D9",
            MSNVideosSolid: "\uF2DA",
            CircleStopSolid: "\uF2DB",
            CircleStop: "\uF2DC",
            NavigateForward: "\uF2DF",
            FileTemplate: "\uF2E6",
            FileJAVA: "\uF2E8",
            FileCSS: "\uF2EA",
            FileSass: "\uF2EB",
            FileHTML: "\uF2ED",
            JavaScriptLanguage: "\uF2EE",
            CSharpLanguage: "\uF2EF",
            TypeScriptLanguage: "\uF2F7",
            MarkDownLanguage: "\uF2FB",
            PlugConnected: "\uF302",
            PlugDisconnected: "\uF303",
            UnlockSolid: "\uF304",
            Variable: "\uF305",
            FileBug: "\uF30D",
            FileCode: "\uF30E",
            FileImage: "\uF311",
            AutoFillTemplate: "\uF313",
            WorkItem: "\uF314",
            FullHistory: "\uF31C",
            TripleColumnEdit: "\uF323",
            AlertSolid: "\uF331",
            MegaphoneSolid: "\uF332",
            TaskSolid: "\uF333",
            CrownSolid: "\uF336",
            Trophy2Solid: "\uF337",
            QuickNoteSolid: "\uF338",
            ConstructionConeSolid: "\uF339",
            PageListSolid: "\uF33A",
            StarburstSolid: "\uF33C",
            ReadingModeSolid: "\uF33D",
            ShieldSolid: "\uF340",
            GiftBoxSolid: "\uF341",
            RibbonSolid: "\uF345",
            FinancialSolid: "\uF346",
            HeadsetSolid: "\uF348",
            PermissionsSolid: "\uF349",
            ParkingSolid: "\uF34A",
            DiamondSolid: "\uF34C",
            AsteriskSolid: "\uF34D",
            OfflineStorageSolid: "\uF34E",
            BankSolid: "\uF34F",
            DecisionSolid: "\uF350",
            ParachuteSolid: "\uF352",
            FiltersSolid: "\uF353",
            ColorSolid: "\uF354",
            ReviewSolid: "\uF355",
            ReviewRequestSolid: "\uF356",
            ReviewResponseSolid: "\uF358",
            FeedbackRequestSolid: "\uF359",
            FeedbackResponseSolid: "\uF35B",
            NavigateExternalInline: "\uF35F",
            PlanView: "\uF360",
            EngineeringGroup: "\uF362",
            ProjectCollection: "\uF363",
            ChevronUnfold10: "\uF369",
            VSTSLogo: "\uF381",
            TestBeaker: "\uF3A5",
            TestBeakerSolid: "\uF3A6",
            TestAutoSolid: "\uF3A8",
            TestPlan: "\uF3AB",
            TestStep: "\uF3AC",
            TestParameter: "\uF3AD",
            TestSuite: "\uF3AE",
            TestCase: "\uF3AF",
            Sprint: "\uF3B0",
            TriggerApproval: "\uF3B2",
            Rocket: "\uF3B3",
            AzureKeyVault: "\uF3B4",
            LikeSolid: "\uF3BF",
            CRMCustomerInsightsApp: "\uF3C8",
            FilterSolid: "\uF412",
            Inbox: "\uF41C",
            NotExecuted: "\uF440",
            NotImpactedSolid: "\uF441",
            BacklogBoard: "\uF444",
            IssueSolid: "\uF448",
            DefectSolid: "\uF449",
            LadybugSolid: "\uF44A",
            NugetLogo: "\uF44C",
            TFVCLogo: "\uF44D",
            ProjectLogo32: "\uF47E",
            WaffleOffice365: "\uF4E0",
            FontColorA: "\uF4EC",
            FontColorSwatch: "\uF4ED",
            SemiboldWeight: "\uF4F0",
            ChartSeries: "\uF513",
            AlignJustify: "\uF51E",
            BlockedSolid: "\uF531",
            DownloadDocument: "\uF549",
            WaitlistConfirm: "\uF550",
            LaptopSecure: "\uF552",
            EntryView: "\uF554",
            AccountManagement: "\uF55C",
            ExploreData: "\uF5B6",
            BitbucketLogo32: "\uF5D2",
            GradleLogo32: "\uF5D4",
            PasteAsCode: "\uF5D6",
            FileYML: "\uF5DA",
            ClipboardSolid: "\uF5DC",
            AnalyticsView: "\uF5F1",
            Trending12: "\uF62D",
            CircleShapeSolid: "\uF63C",
            GitLogo: "\uF65D",
            GitHubLogo: "\uF65E",
            ApacheMavenLogo: "\uF65F",
            NPMLogo: "\uF660",
            GitFork: "\uF661",
            SVNLogo: "\uF662",
            JenkinsLogo: "\uF663",
            ExternalGit: "\uF665",
            QuadColumn: "\uF66F",
            DictionaryRemove: "\uF69A",
            UserRemove: "\uF69B",
            OpenInNewTab: "\uF6AB",
            VerifiedBrandSolid: "\uF6AD",
            AuthenticatorApp: "\uF6B1",
            BacklogList: "\uF6BF",
            UserGauge: "\uF6ED",
            PeopleSettings: "\uF72C",
            Blocked2Solid: "\uF737",
            BulletedListText: "\uF792",
            BulletedListBullet: "\uF793",
            NumberedListText: "\uF796",
            NumberedListNumber: "\uF797",
            RemoveLinkChain: "\uF79A",
            RemoveLinkX: "\uF79B",
            FabricTextHighlight: "\uF79C",
            ClearFormattingA: "\uF79D",
            ClearFormattingEraser: "\uF79E",
            Photo2Fill: "\uF79F",
            IncreaseIndentText: "\uF7A0",
            IncreaseIndentArrow: "\uF7A1",
            DecreaseIndentText: "\uF7A2",
            DecreaseIndentArrow: "\uF7A3",
            CheckListText: "\uF7A8",
            CheckListCheck: "\uF7A9",
            NumberSymbol: "\uF7AC",
            VerifiedBrand: "\uF7BD",
            ReleaseGate: "\uF7BE",
            ReleaseGateCheck: "\uF7BF",
            ReleaseGateError: "\uF7C0",
            FabricTextHighlightComposite: "\uF7DA",
            SkypeCircleSlash: "\uF825",
            PythonLogoBlue: "\uF84D",
            PythonLogoYellow: "\uF84E",
            RustLanguageLogo: "\uF84F",
            RubyGemsLogo: "\uF850",
            AddReaction: "\uF85D",
            DecreaseIndentLegacy: "\uE290",
            IncreaseIndentLegacy: "\uE291",
            SurveyQuestions: "\uF01B",
            BranchCompare: "\uF294",
            DiffInline: "\uF309",
            DiffSideBySide: "\uF30A",
            ImageDiff: "\uF30B",
            GitGraph: "\uF2CA",
            WordDocument: "\uEF71",
            PowerPointDocument: "\uEF72",
            PowerShell: "\uF1FD",
            FilePDB: "\uF2E5",
            FileSQL: "\uF2E7",
            FileASPX: "\uF2E9",
            FileLess: "\uF2EC",
            VisualBasicLanguage: "\uF2F1",
            CPlusPlusLanguage: "\uF2F3",
            FSharpLanguage: "\uF2F5",
            PythonLanguage: "\uF2F8",
            CoffeeScript: "\uF2FA",
            RowsChild: "\uF29C",
            ChevronFold10: "\uF36A",
            FileTypeSolution: "\uF387",
            Trash: "\uE74D" // do not use this! Use Delete instead.
        }
    };

    registerIcons(subset, options);
}

export class HtmlEditor extends React.PureComponent<IHtmlEditorProps> {
    private readonly _leanRoosterRef = React.createRef<LeanRooster>();
    private _leanRoosterContentDiv: HTMLDivElement | null;
    private readonly _commandBarRef = React.createRef<RoosterCommandBar>();
    private _commandBarPlugin: RoosterCommandBarPlugin;
    private _imageResizePlugin: ImageResize;
    private readonly _timers: TimerManagement;
    private readonly _throttledOnContentChanged: (updatedContent: string, isInitializing?: boolean) => void;
    private _editorPlugins: EditorPlugin[];
    private _emojiPlugin: EmojiPlugin | null;
    private _undoPlugin: UndoWithImagePlugin;
    private _imageManager: ImageManager;
    private _buttonOverrides: RoosterCommandBarButton[];
    private readonly _viewState: EditorViewState;

    constructor(props: IHtmlEditorProps) {
        super(props);

        initializeIcons();
        this._timers = new TimerManagement();
        this._throttledOnContentChanged = this._timers.throttle(this._handleContentChanged, 100, { trailing: true });

        const { htmlContent } = props;
        this._viewState = { content: htmlContent, isDirty: false } as EditorViewState;
        this._createAdditionalEditorPlugins();
        this._initializeButtonOverrides();

        const viewState = this._viewState;
        const santizedContent = viewState.content;
        viewState.content = santizedContent;
    }

    public render(): JSX.Element {
        const { className, height } = this.props;
        return (
            <div className={css("html-editor flex-column", className, height == null ? "auto-grow" : "")} style={{ height }}>
                {this._renderRoosterEditor()}
            </div>
        );
    }

    // eslint-disable-next-line react/no-deprecated
    public componentWillReceiveProps(newProps: IHtmlEditorProps): void {
        const { htmlContent } = newProps;
        // If the module is not loaded, just set the state, we will sanitize when the module has been loaded
        if (this._tryUpdateState(htmlContent) && this._leanRoosterRef.current) {
            this._leanRoosterRef.current.reloadContent(false /* triggerContentChangedEvent */, false /* resetUndo */);
            const initialContent = this._leanRoosterRef.current.getContent();
            this._undoPlugin.reset(initialContent);
        }
    }

    public focus(): void {
        if (this._leanRoosterRef.current) {
            this._leanRoosterRef.current.focus();
        }
    }

    public selectAll(): void {
        if (this._leanRoosterRef.current) {
            this._leanRoosterRef.current.selectAll();
        }
    }

    public flushChanges(): void {
        if (this._leanRoosterRef.current) {
            // Force the content changed event bypassing the throttling to ensure that all changes are processed before saving the workitem.
            const content = this._leanRoosterRef.current.getContent();
            this._handleContentChanged(content);
        }
    }

    public componentDidMount(): void {
        if (this.props.autoFocus) {
            this.focus();
        }
    }

    public componentWillUnmount(): void {
        const leanRoosterContentDiv = this._leanRoosterContentDiv;
        if (leanRoosterContentDiv) {
            this._leanRoosterContentDiv = null;
            this._emojiPlugin = null; // set to null to avoid race with _loadEmojiStrings(); also note rooster will call dispose on its plugins
        }

        if (this._timers) {
            this._timers.dispose();
        }

        if (this._commandBarPlugin && this._commandBarRef.current) {
            this._commandBarPlugin.unregisterRoosterCommandBar(this._commandBarRef.current);
        }
    }

    private _renderRoosterEditor(): JSX.Element | null {
        const { placeholder, readonly } = this.props;

        return (
            <FocusOutShell
                className="rooster-wrapper with-chrome flex-column flex-grow relative scroll-hidden"
                allowMouseDown={this._focusOutShellAllowMouseDown}
                onFocus={this._focusOutShellOnFocus}
            >
                {(calloutClassName: string, calloutOnDismiss: FocusEventHandler) => {
                    this._createPluginsWithCallout(calloutClassName, calloutOnDismiss);
                    return [
                        <LeanRooster
                            key="rooster"
                            className="rooster-editor propagate-keydown-event text-element flex-grow no-outline scroll-auto font-size-m"
                            viewState={this._viewState}
                            plugins={this._editorPlugins}
                            undo={this._undoPlugin}
                            ref={this._leanRoosterRef}
                            updateViewState={this._updateViewState}
                            contentDivRef={this._leanRoosterContentDivOnRef}
                            readonly={readonly}
                            placeholder={placeholder}
                            hyperlinkToolTipCallback={this._hyperlinkToolTipCallback}
                            onDragEnter={PreventFileDropHandler}
                            onDragOver={PreventFileDropHandler}
                        />,
                        <RoosterCommandBar
                            key="cmd"
                            className="rooster-command-bar"
                            commandBarClassName="html-command-bar-base"
                            buttonOverrides={this._buttonOverrides}
                            roosterCommandBarPlugin={this._commandBarPlugin}
                            emojiPlugin={this._emojiPlugin!}
                            imageManager={this._imageManager}
                            calloutClassName={css("rooster-callout", calloutClassName)}
                            calloutOnDismiss={calloutOnDismiss}
                            strings={CommandBarLocaleStrings}
                            ref={this._commandBarRef}
                            disableListWorkaround={true}
                            overflowMenuProps={{ className: "rooster-command-bar-overflow" }}
                        />
                    ];
                }}
            </FocusOutShell>
        );
    }

    private _createPluginsWithCallout(calloutClassName: string, calloutOnDismiss: FocusEventHandler): any {
        if (!this._emojiPlugin) {
            this._emojiPlugin = new EmojiPlugin({
                calloutClassName: css(calloutClassName, "rooster-emoji-callout"),
                calloutOnDismiss,
                emojiPaneProps: {
                    quickPickerClassName: "rooster-emoji-quick-pick",
                    navBarProps: {
                        className: "rooster-emoji-navbar",
                        buttonClassName: "rooster-emoji-navbar-button",
                        iconClassName: "rooster-emoji-navbar-icon",
                        selectedButtonClassName: "rooster-emoji-navbar-selected"
                    },
                    statusBarProps: {
                        className: "rooster-emoji-status-bar"
                    },
                    emojiIconProps: {
                        className: "rooster-emoji-icon",
                        selectedClassName: "rooster-emoji-selected"
                    },
                    searchPlaceholder: SearchForEmoji
                } as EmojiPaneProps,
                strings: { emjDNoSuggetions: Resources.NoSuggestionsFound } //  only load a small portion of required strings first (the rest is async loaded)
            } as EmojiPluginOptions);
            this._editorPlugins.push(this._emojiPlugin);
        }

        if (!this._commandBarPlugin) {
            this._commandBarPlugin = new RoosterCommandBarPlugin({
                strings: CommandBarLocaleStrings,
                disableListWorkaround: true,
                calloutClassName,
                calloutOnDismiss
            } as RoosterCommandBarPluginOptions);
            this._editorPlugins.push(this._commandBarPlugin);
        }
    }

    private _initializeButtonOverrides(): void {
        const supportInsertImage = !!this.props.uploadImageHandler;
        const keys = RoosterCommmandBarButtonKeys;
        const buttonClassName = "html-command-bar-button";
        this._buttonOverrides = [
            { key: keys.Bold, order: 0 },
            { key: keys.Italic, order: 1 },
            { key: keys.Underline, order: 2 },
            { key: keys.BulletedList, order: 3 },
            { key: keys.NumberedList, order: 4 },
            { key: keys.Highlight, order: 5 },
            { key: keys.FontColor, order: 6 },
            { key: keys.Emoji, order: 7, buttonClassName: css("rooster-emoji-button", buttonClassName) },
            { key: keys.Outdent, order: 8 },
            { key: keys.Indent, order: 9 },
            { key: keys.Strikethrough, order: 10 },
            { key: keys.Header, order: 11 },
            { key: keys.Code, order: 12 },
            { key: keys.ClearFormat, order: 16 },
            { key: keys.InsertImage, order: 17, exclude: !supportInsertImage },
            { key: keys.Link, order: 18 },
            { key: keys.Unlink, order: 19 }
        ];

        this._buttonOverrides.forEach((b) => {
            b.className = b.className || "html-command-button-root";
            b.buttonClassName = b.buttonClassName || buttonClassName;
        });
    }

    private _createAdditionalEditorPlugins(): void {
        const { uploadImageHandler: uploadImage } = this.props;

        this._imageManager = new ImageManager({
            uploadImage,
            placeholderImageClassName: PlaceholderImageClassName
        } as ImageManagerOptions);
        this._undoPlugin = new UndoWithImagePlugin(this._imageManager);
        this._imageResizePlugin = new ImageResize(undefined, undefined, undefined, undefined, ExcludePlaceholderSelector);

        const supportInsertImage = !!uploadImage;
        this._editorPlugins = [
            new ContentChangedPlugin(this._throttledOnContentChanged),
            this._imageResizePlugin,
            new TableResize(),
            supportInsertImage ? new PasteImagePlugin(this._imageManager) : IgnorePasteImagePlugin.Instance,
            new DoubleClickImagePlugin(ExcludePlaceholderSelector)
        ];
    }

    private _tryUpdateState(newContent: string, isInitializing = false): boolean {
        const newContent1 = this._isEmpty(newContent) ? "" : newContent;
        const viewState = this._viewState;
        if (newContent1 !== viewState.content) {
            viewState.content = newContent1;
            viewState.isDirty = true;

            return !isInitializing;
        }

        return false;
    }

    private _isEmpty(html: string): boolean {
        const ISEMPTY_MINIMAL_CONTENT_LENGTH = 500;
        if (html == null || html.length === 0) {
            return true;
        }

        if (html.length >= ISEMPTY_MINIMAL_CONTENT_LENGTH) {
            return false;
        }

        const tempNode = fromHtml(`<div>${html}</div>`, document)[0] as HTMLElement;
        return isNodeEmpty(tempNode);
    }

    private readonly _handleContentChanged = (content: string, isInitializing = false): void => {
        if (this._tryUpdateState(content, isInitializing) && this.props.onChange) {
            this.props.onChange(content);
        }
    };

    private readonly _updateViewState = (_: unknown, content: string, isInitializing: boolean): void => {
        this._throttledOnContentChanged(content, isInitializing);
    };

    private readonly _focusOutShellAllowMouseDown = (element: HTMLElement): boolean => {
        return !!(this._leanRoosterContentDiv && this._leanRoosterContentDiv.contains(element));
    };

    private readonly _focusOutShellOnFocus = (_: unknown): void => {
        if (this._commandBarRef.current) {
            this._commandBarPlugin.registerRoosterCommandBar(this._commandBarRef.current); // re-register command b/c we're changing mode on blur
        }
    };

    private readonly _leanRoosterContentDivOnRef = (ref: HTMLDivElement): void => {
        this._leanRoosterContentDiv = ref;
    };

    private readonly _hyperlinkToolTipCallback = (href: string): string => {
        // roosterjs will support which link to process in the future, for now we don't show tooltip
        // href having just hash (@ mention)
        if (href.replace(location.href, "") === "#") {
            return "";
        }

        return `${href}\n${HyperlinkShortcut}`;
    };
}
