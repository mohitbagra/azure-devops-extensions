import { format } from "azure-devops-ui/Core/Util/String";
import { InsertLinkStringKeys, RoosterCommmandBarButtonKeys as ButtonKeys } from "roosterjs-react";

import { Resources } from "./Resources";

export const SearchForEmoji = Resources.SearchForEmoji;

export const CommandBarLocaleStrings = {
    // built-in buttons
    [ButtonKeys.Header]: Resources.Toolbar_Header,
    [ButtonKeys.Bold]: Resources.Toolbar_Bold,
    [ButtonKeys.Italic]: Resources.Toolbar_Italic,
    [ButtonKeys.Underline]: Resources.Toolbar_Underline,
    [ButtonKeys.BulletedList]: Resources.Toolbar_BulletedList,
    [ButtonKeys.NumberedList]: Resources.Toolbar_NumberedList,
    [ButtonKeys.Link]: Resources.Toolbar_Link,
    [ButtonKeys.Highlight]: Resources.Toolbar_Highlight,
    [ButtonKeys.ClearFormat]: Resources.Toolbar_ClearFormat,
    [ButtonKeys.Emoji]: Resources.Toolbar_Emoji,
    [ButtonKeys.InsertImage]: Resources.Toolbar_InsertImage,
    [ButtonKeys.Indent]: Resources.Toolbar_Indent,
    [ButtonKeys.Outdent]: Resources.Toolbar_Outdent,
    [ButtonKeys.Strikethrough]: Resources.Toolbar_Strikethrough,
    [ButtonKeys.FontColor]: Resources.Toolbar_FontColor,
    [ButtonKeys.Unlink]: Resources.Toolbar_Unlink,
    [ButtonKeys.Code]: Resources.Toolbar_Code,

    // insert link dialog
    [InsertLinkStringKeys.CancelButton]: Resources.Cancel,
    [InsertLinkStringKeys.InsertButton]: Resources.OK,
    [InsertLinkStringKeys.LinkFieldLabel]: Resources.InsertLink_FieldLabel,
    [InsertLinkStringKeys.Title]: Resources.Toolbar_Link,

    // headers
    header1: format(Resources.Toolbar_HeaderN, 1),
    header2: format(Resources.Toolbar_HeaderN, 2),
    header3: format(Resources.Toolbar_HeaderN, 3),

    // colors
    black: Resources.Color_Black,
    blue: Resources.Color_Blue,
    cyan: Resources.Color_Cyan,
    darkBlue: Resources.Color_DarkBlue,
    darkGray: Resources.Color_DarkGray,
    darkGreen: Resources.Color_DarkGreen,
    darkOrange: Resources.Color_DarkOrange,
    darkPurple: Resources.Color_DarkPurple,
    darkRed: Resources.Color_DarkRed,
    darkYellow: Resources.Color_DarkYellow,
    darkerBlue: Resources.Color_DarkerBlue,
    darkerGray: Resources.Color_DarkerGray,
    darkerGreen: Resources.Color_DarkerGreen,
    darkerOrange: Resources.Color_DarkerOrange,
    darkerPurple: Resources.Color_DarkerPurple,
    darkerRed: Resources.Color_DarkerRed,
    darkerYellow: Resources.Color_DarkerYellow,
    gray: Resources.Color_Gray,
    green: Resources.Color_Green,
    lightBlue: Resources.Color_LightBlue,
    lightCyan: Resources.Color_LightCyan,
    lightGray: Resources.Color_LightGray,
    lightGreen: Resources.Color_LightGreen,
    lightMagenta: Resources.Color_LightMagenta,
    lightOrange: Resources.Color_LightOrange,
    lightPurple: Resources.Color_LightPurple,
    lightRed: Resources.Color_LightRed,
    lightYellow: Resources.Color_LightYellow,
    magenta: Resources.Color_Magenta,
    orange: Resources.Color_Orange,
    purple: Resources.Color_Purple,
    red: Resources.Color_Red,
    white: Resources.Color_White,
    yellow: Resources.Color_Yellow
};
