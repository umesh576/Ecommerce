import fs from "fs";
import path from "path";

export const deleteFiles = async (filesPath: string[]) => {
  filesPath.forEach((filePath) => {
    const fileToDelete = path.join(__dirname, filePath);
    fs.unlink(fileToDelete, (err) => {
      console.log("error deleting file", err);
    });
  });
};
