import Express from "express";
import uniqid from "uniqid";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import { checkMediaSchema, triggerBadRequest } from "./validation.js";

const mediasRouter = Express.Router();

mediasRouter.post(
  "/",
  checkMediaSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const allMedias = await getMedias();
      const newMedia = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uniqid(),
      };
      allMedias.push(newMedia);
      await writeMedias(allMedias);
      res.status(201).send({ id: newMedia.id });
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.get("/", async (req, res, next) => {
  try {
    const allMedias = await getMedias();
    res.send(allMedias);
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:mediasId", async (req, res, next) => {
  try {
    const mediaId = req.params.mediasId;
    const allMedias = await getMedias();
    const matchedMedia = allMedias.find((e) => e.id === mediaId);
    res.send(matchedMedia);
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
