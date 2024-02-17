import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { getSP } from "./pnpConfig";
import { IFile } from "@pnp/sp/files";

export interface IFiles extends Array<IFile & { get: () => any }> {}

export const getAllFilesInFolder = async (): Promise<IFiles> => {
  try {
    const sp = getSP();
    const folder: any = await sp.web.getFolderByServerRelativePath(
      "DocumentsUploaded"
    );
    const items: any[] = await folder.files();

    // Manually add 'get' function to each item
    const files: IFiles = items.map((item) => ({ ...item, get: () => item }));

    return files;
  } catch (error) {
    console.error("Error retrieving files:", error);
    return [];
  }
};

export const copyFile = async (file: any) => {
  const sp = getSP();
  try {
    await sp.web
      .getFolderByServerRelativePath("CopiedFiles")
      .files.addUsingPath(file.Name, file, { Overwrite: true });
    console.log(`File "${file.Name}" copied successfully.`);
  } catch (error) {
    console.error("Error copying file:", error);
    throw error;
  }
};

// Function to move a file to the MovedFiles folder
export const moveFile = async (file: any) => {
  const sp = getSP();
  try {
    await sp.web
      .getFolderByServerRelativePath("MovedFiles")
      .files.addUsingPath(file.Name, file, { Overwrite: true });

    // Delete the original file from DocumentsUploaded folder
    await sp.web
      .getFolderByServerRelativePath("DocumentsUploaded")
      .files.getByUrl(file.Name)
      .recycle();

    console.log(`File "${file.Name}" moved successfully.`);

    return true;
  } catch (error) {
    console.error("Error moving file:", error);
    throw error;
  }
};
