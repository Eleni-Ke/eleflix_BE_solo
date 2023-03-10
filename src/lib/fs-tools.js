import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const mediasJSONPath = join(dataFolderPath, "media.json");
const postersPublicFolderPath = join(process.cwd(), "/public/media/posters");

// *************** MEDIAS ***************

export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (allMedias) => writeJSON(mediasJSONPath, allMedias);
// *************** POSTERS ***************

export const savePoster = (fileName, fileContentAsBuffer) => {
  writeFile(join(postersPublicFolderPath, fileName), fileContentAsBuffer);
};
