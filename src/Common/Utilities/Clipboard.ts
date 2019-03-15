export interface IClipboardOptions {
    copyAsHtml?: boolean;
}

export function copyToClipboard(data: string, options?: IClipboardOptions): boolean {
    let dataCopied = false;
    if (data && typeof data === "string") {
        if (options && options.copyAsHtml) {
            // HTML Copy
            if (supportsNativeHtmlCopy()) {
                try {
                    dataCopied = nativeCopy(data, true);
                } catch {
                    // eat up
                }
            }
        } else {
            // Plain text copy
            if (supportsNativeCopy()) {
                try {
                    dataCopied = nativeCopy(data, false);
                } catch {
                    // eat up
                }
            }
        }
    }

    return dataCopied;
}

export function supportsNativeCopy(): boolean {
    return document.queryCommandSupported("copy") || (window as any).clipboardData !== undefined;
}

export function supportsNativeHtmlCopy(): boolean {
    return (document.body as any).createTextRange !== undefined || (document.queryCommandSupported("copy") && document.createRange !== undefined);
}

function nativeCopy(data: string, copyAsHtml: boolean): boolean {
    let success = false;

    if (!copyAsHtml && (window as any).clipboardData !== undefined) {
        (window as any).clipboardData.setData("text", data);
        success = true;
    } else {
        let range;
        let sel;
        // Create an element in the dom with the content to be copied.
        const copyContent = document.createElement("div");
        const copyDivId = "copyDiv";
        copyContent.id = copyDivId;
        try {
            // body can have its own background color.
            copyContent.style.backgroundColor = "white";

            if (copyAsHtml) {
                copyContent.innerHTML += data;
            } else {
                copyContent.style.whiteSpace = "pre";
                copyContent.textContent = data;
            }

            if ((document.body as any).createTextRange) {
                const body = document.getElementsByTagName("body")[0];
                body.insertBefore(copyContent, body.firstChild);

                range = (document.body as any).createTextRange();
                range.moveToElementText(document.getElementById(copyDivId));
                range.select();
                success = range.execCommand("copy");
            } else if (document.createRange && window.getSelection) {
                const body = document.getElementsByTagName("body")[0];
                body.appendChild(copyContent);

                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();

                range.selectNodeContents(copyContent);
                sel.addRange(range);
                success = (document as any).execCommand("copy");
            }
        } finally {
            // Remove the content from the dom.
            if (copyContent.parentElement) {
                copyContent.parentElement.removeChild(copyContent);
            }
        }
    }

    return success;
}
