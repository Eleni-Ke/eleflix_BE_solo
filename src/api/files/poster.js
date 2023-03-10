import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { write } from "fs";

const posterRouter = Express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "medias/posters" },
  }),
}).single("poster");

posterRouter.post(
  "/:mediasId/poster",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const allMedias = await getMedias();
      const mediaId = req.params.mediasId;
      const index = allMedias.findIndex((e) => e.id === mediaId);
      if (index !== -1) {
        const oldMedia = allMedias[index];
        const updatedMedia = {
          ...oldMedia,
          ...req.body,
          poster: req.file.path,
          updatedAt: new Date(),
        };
        allMedias[index] = updatedMedia;
        await writeMedias(allMedias);
        res.send({ message: "Poster has been updated." });
      } else {
        next(createHttpError(404, `Media with the id ${mediaId} not found.`));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default posterRouter;
