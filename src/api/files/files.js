import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const filesRouter = Express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "medias/posters" },
  }),
}).single("poster");

filesRouter.post(
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

filesRouter.get("/:mediasId/pdf", async (req, res, next) => {
  try {
    const mediaId = req.params.mediasId;
    const allMedias = await getMedias();
    const matchedMedia = allMedias.find((e) => e.id === mediaId);
    if (matchedMedia) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${matchedMedia.title}.pdf`
      );
      console.log(matchedMedia);
      const source = await getPDFReadableStream(matchedMedia);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    } else {
      next(createHttpError(404, `Media with the id ${mediaId} not found.`));
    }
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
