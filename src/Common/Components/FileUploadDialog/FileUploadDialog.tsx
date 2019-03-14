import "./FileUploadDialog.scss";

import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import {
    FileInput, FileInputContentType, FileInputResult, FileInputUpdateEventData
} from "azure-devops-ui/FileInput";
import { css } from "azure-devops-ui/Util";
import { Dialog, DialogFooter, DialogType } from "OfficeFabric/Dialog";

interface IFileInputDialogProps {
    className?: string;
    maximumNumberOfFiles?: number;
    allowedFileExtensions?: string[];
    maxFileSize?: number;
    resultContentType?: FileInputContentType;
    title?: string;
    onDialogClose?(): void;
    onOkClick?(files?: FileInputResult[]): void;
}

export function FileUploadDialog(props: IFileInputDialogProps) {
    const { title, maxFileSize, className, resultContentType, maximumNumberOfFiles, allowedFileExtensions, onDialogClose, onOkClick } = props;
    const [files, setFiles] = React.useState<FileInputResult[] | undefined>(undefined);

    const onOkClicked = () => {
        if (onOkClick) {
            onOkClick(files);
        }
        if (onDialogClose) {
            onDialogClose();
        }
    };

    const onFileInputUpdate = (updateEvent: FileInputUpdateEventData) => {
        if (updateEvent && updateEvent.files && updateEvent.files.length) {
            setFiles(updateEvent.files.map(f => f.result));
        } else {
            setFiles(undefined);
        }
    };

    return (
        <Dialog
            hidden={false}
            title={title || "Upload files"}
            modalProps={{
                containerClassName: css("file-upload-dialog", className)
            }}
            dialogContentProps={{
                type: DialogType.close
            }}
            onDismiss={onDialogClose}
            closeButtonAriaLabel={"Cancel"}
            firstFocusableSelector={"vss-FileInput-browseContainer"}
        >
            <div>
                <FileInput
                    maximumNumberOfFiles={maximumNumberOfFiles || 1}
                    maximumSingleFileSize={maxFileSize || 10 * 1024 * 1024}
                    allowedFileExtensions={allowedFileExtensions}
                    updateHandler={onFileInputUpdate}
                    resultContentType={resultContentType || FileInputContentType.RawFile}
                />

                <DialogFooter>
                    <Button className="fabric-style-overrides" primary={true} onClick={onOkClicked} disabled={!files || files.length === 0}>
                        OK
                    </Button>
                    <Button onClick={onDialogClose}>Cancel</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}
