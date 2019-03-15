import "./HtmlEditor.scss";

import { TimerManagement } from "azure-devops-ui/Core/TimerManagement";
import { css } from "azure-devops-ui/Util";
import * as React from "react";
import {
    Browser, ContentChangedPlugin, DoubleClickImagePlugin, EditorPlugin, EditorViewState,
    EmojiPaneProps, EmojiPlugin, EmojiPluginOptions, FocusEventHandler, FocusOutShell, fromHtml,
    IgnorePasteImagePlugin, ImageManager, ImageManagerOptions, ImageResize, isNodeEmpty,
    LeanRooster, PasteImagePlugin, RoosterCommandBar, RoosterCommandBarButton,
    RoosterCommandBarPlugin, RoosterCommandBarPluginOptions, RoosterCommmandBarButtonKeys,
    TableResize, UndoWithImagePlugin
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
    height?: number;
    autoFocus?: boolean;
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
                            className="rooster-editor propagate-keydown-event text-element flex-grow no-outline scroll-auto fontSizeM"
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

        this._buttonOverrides.forEach(b => {
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

        const supportInsertImage: boolean = !!uploadImage;
        this._editorPlugins = [
            new ContentChangedPlugin(this._throttledOnContentChanged),
            this._imageResizePlugin,
            new TableResize(),
            supportInsertImage ? new PasteImagePlugin(this._imageManager) : IgnorePasteImagePlugin.Instance,
            new DoubleClickImagePlugin(ExcludePlaceholderSelector)
        ];
    }

    private _tryUpdateState(newContent: string, isInitializing: boolean = false): boolean {
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

    private readonly _handleContentChanged = (content: string, isInitializing: boolean = false): void => {
        if (this._tryUpdateState(content, isInitializing) && this.props.onChange) {
            this.props.onChange(content);
        }
    };

    private readonly _updateViewState = (_existingViewState: EditorViewState, content: string, isInitializing: boolean): void => {
        this._throttledOnContentChanged(content, isInitializing);
    };

    private readonly _focusOutShellAllowMouseDown = (element: HTMLElement): boolean => {
        return !!(this._leanRoosterContentDiv && this._leanRoosterContentDiv.contains(element));
    };

    private readonly _focusOutShellOnFocus = (_ev: React.FocusEvent<HTMLElement>): void => {
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
