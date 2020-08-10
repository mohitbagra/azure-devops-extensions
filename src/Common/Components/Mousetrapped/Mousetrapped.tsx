import * as React from "react";

import "mousetrap/plugins/global-bind/mousetrap-global-bind";

import * as Mousetrap from "mousetrap";

type KeyboardAction = (e: ExtendedKeyboardEvent, combo: string) => void;

interface IShortcut {
    combos: string | string[];
    action: KeyboardAction;
    stopPropagation?: boolean;
    preventDefault?: boolean;
}

interface IMousetrappedProps {
    shortcuts: IShortcut[];
    children: JSX.Element;
}

export function Mousetrapped(props: IMousetrappedProps) {
    const { shortcuts, children } = props;
    React.useEffect(() => {
        for (const shortcut of shortcuts) {
            Mousetrap.bindGlobal(shortcut.combos, (e: ExtendedKeyboardEvent, combo: string) => {
                if (shortcut.stopPropagation) {
                    e.stopPropagation();
                }
                if (shortcut.preventDefault) {
                    e.preventDefault();
                }

                shortcut.action(e, combo);
            });
        }

        return () => {
            for (const shortcut of shortcuts) {
                Mousetrap.unbind(shortcut.combos);
            }
        };
    }, []);

    return children;
}
