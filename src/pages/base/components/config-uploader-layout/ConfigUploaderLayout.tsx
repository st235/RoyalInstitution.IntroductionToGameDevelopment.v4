import "@/pages/base/components/config-uploader-layout/ConfigUploaderLayout.css";

import IconDownload from "@assets/icons/download.svg";
import IconUpload from "@assets/icons/upload.svg";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import Button from "@/components/button/Button";
import { GenerateUrlFromConfigObject, GenerateFilename } from "@/pages/base/components/config-uploader-layout/UploadingUtil";
import { useDeepCompareEffect } from "@/hooks/useDeepEffects";

type ConfigUploaderLayoutProps = {
    downloadButtonText?: string;
    uploadButtonText?: string;
    downloadFileName?: string;
    onDownloadConfig?: () => object;
    onUploadConfig?: (config: object) => void;
};

function ConfigUploaderLayout(props: ConfigUploaderLayoutProps) {
    const [configFile, setConfigFile] = useState<File | null>(null);

    const fileReaderRef = useRef<FileReader>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const anchorRef = useRef<HTMLAnchorElement>(null);

    function onChangeFile(event: ChangeEvent<HTMLInputElement>) {
        event.stopPropagation();
        event.preventDefault();

        const files = event.target.files;
        if (files && files.length == 1) {
            const file = files[0];
            if (file !== configFile) {
                setConfigFile(file);
            }
        }
    }

    function onUploadFileClick() {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    function onDownloadFileClick() {
        if (anchorRef.current) {
            const configObject = props.onDownloadConfig?.() ?? {};

            const filename = GenerateFilename(props.downloadFileName);
            const configUrl = GenerateUrlFromConfigObject(configObject);

            anchorRef.current.download = filename;
            anchorRef.current.href = configUrl;
            anchorRef.current.click();
        }
    }

    useDeepCompareEffect(() => {
        function onHandleFileContent(this: FileReader) {
            const result = this.result;
            if (result && typeof result === "string") {
                try {
                    const configObject = JSON.parse(result);
                    props.onUploadConfig?.(configObject);
                } finally {
                    // Empty on purpose.
                }
            }
        }

        if (configFile != null) {
            if (fileReaderRef.current) {
                fileReaderRef.current.abort();
            }

            fileReaderRef.current = new FileReader();
            fileReaderRef.current.onloadend = onHandleFileContent;
            fileReaderRef.current.readAsText(configFile);
        }
    }, [configFile, props, props.onUploadConfig]);

    return (
        <>
            <input
                type="file"
                id="file"
                ref={inputRef}
                style={{display: "none"}}
                accept="application/json"
                onChange={onChangeFile} />
            <a ref={anchorRef} style={{display: "none"}} />
            <div className="config-uploader-container">
                <Button text={props.downloadButtonText ?? "Download config"} leadingIcon={IconDownload} variant="secondary" onClick={onDownloadFileClick} />
                <Button text={props.uploadButtonText ?? "Upload config"} leadingIcon={IconUpload} variant="primary" onClick={onUploadFileClick} />
            </div>
        </>
    );
}

export default ConfigUploaderLayout;
export type { ConfigUploaderLayoutProps };
