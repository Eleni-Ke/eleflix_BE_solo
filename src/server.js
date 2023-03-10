import Express from "express";
import cors from "cors";
import createHttpError from "http-errors";
import mediasRouter from "./api/medias/index.js";
import {
  badReqHandler,
  generalErrorHandler,
  notFoundHandler,
} from "./errorsHandler.js";
import listEndpoints from "express-list-endpoints";
import filesRouter from "./api/files/files.js";

const server = Express();
const port = process.env.PORT;
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROP_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));
server.use(Express.static("public"));
server.use(Express.json());

// ******************* ENDPOINTS *******************
server.use("/medias", mediasRouter);
server.use("/medias", filesRouter);

// ******************* ERROR HANDLERS *******************
server.use(badReqHandler);
server.use(notFoundHandler);
server.use(generalErrorHandler);

// **************************************
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server works on port: ", port);
});
