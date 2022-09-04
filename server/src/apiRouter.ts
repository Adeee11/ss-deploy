import express from "express";
import multer from "multer";
import path from "path";
import cryptoString from "crypto-random-string";
import vhost from "vhost";
import { env } from "./env";
import { handleExtraction } from "./handleExtraction";
export type IState = {
  [id: string]: {
    status: "failed" | "inprogress" | "deployed";
    folder?: string;
  };
};
const store = (() => {
  const state: IState = {};
  return {
    getState: () => {
      return state;
    },
  };
})();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const key = req.headers["upload-key"];
    const info = store.getState()[key as string];
    if (info?.status === "inprogress") {
      return cb(new Error("Already in Progress"), "");
    }
    cb(null, path.resolve(__dirname, "..", "downloads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = cryptoString({ length: 10, type: "alphanumeric" });
    cb(null, uniqueSuffix.toLowerCase() + "" + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext !== ".zip") {
      return cb(new Error("Only zip files are allowed"));
    }
    cb(null, true);
  },
});

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => res.json({ msg: "Server working" }));

apiRouter.put("/upload", upload.single("upload"), async (req, res) => {
  const key = req.headers["upload-key"];
  const state = store.getState();
  const info = state[key as string] as IState[""];

  if (!info) {
    state[key as "string"] = {
      status: "inprogress",
    };
    const folder = await handleExtraction(
      req.file.filename,
      key as string,
      state
    );
    return res.json({
      msg: "Application Published",
      status: "deployed",
      url: `${req.protocol}://${folder}.${env("HOST_NAME")}`,
    });
  }
  if (info.status === "failed") {
    return res.sendStatus(500);
  }
  if (info.status === "inprogress") {
    return res.json({ msg: "Upload in Progress", status: "inprogress" });
  }
  if (info.status === "deployed") {
    return res.json({
      msg: "Application Published",
      status: "deployed",
      url: `https://${info.folder}.${env("HOST_NAME")}`,
    });
  }

  return res.sendStatus(500);
});

export { apiRouter };
