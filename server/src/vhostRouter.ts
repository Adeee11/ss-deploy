import { Router, static as expressStatic } from "express";
import path from "path";
import fs from "fs";
import { HTML_DIR } from "./constants-api";
import { apiRouter } from "./apiRouter";

const vhostRouter = Router();
const existsDir = (dir: string) => {
  return new Promise((res, rej) => {
    fs.stat(dir, (error, stats) => {
      if (error) {
        return res(false)
      }
      if (stats.isDirectory()) {
        return res(true);
      } else {
        return res(false);
      }
    });
  });
};

vhostRouter.use(async (req, res, next) => {
  const vhost = (req as any).vhost;
  if (vhost.length == 0) {
    return res.sendStatus(404);
  }
  if (vhost[0] === "api") {
    return apiRouter(req, res, next);
  }

  const directory = path.resolve(HTML_DIR, vhost[0]);

  if (await existsDir(directory)) {
    return expressStatic(directory)(req, res, next);
  } else {
    return res.status(404).json({ msg: 'Not Found' })
  }
});

export { vhostRouter };
