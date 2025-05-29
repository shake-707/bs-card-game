import path from "path";

import type { Express } from "express";

const configureReload = (app: Express) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const reloadServer = require("livereload").createServer();

  // injects a script tag into a html page so browser can listen to reload signals
  const connectLivereload = require("connect-livereload");
  
  // is telling reload server to watch the output public js file
  reloadServer.watch(path.join(process.cwd(), "public", "js"));

  // once server connected it refreshes every 100ms
  reloadServer.server.once("connection", () => {
    setTimeout(() => {
      reloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
};

export default configureReload;