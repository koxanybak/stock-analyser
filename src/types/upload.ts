import fileUpload from "express-fileupload";

export const isFileUpload = (val: fileUpload.UploadedFile | fileUpload.UploadedFile[] | undefined): val is fileUpload.UploadedFile => {
    return (val as fileUpload.UploadedFile)?.data !== undefined;
};
