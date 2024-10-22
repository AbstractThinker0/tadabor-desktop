import path from "path";
import { spawn } from "child_process";
import { app } from "electron";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// code extracted from https://www.npmjs.com/package/electron-squirrel-startup

const squirrelStartup = () => {
  if (process.platform === "win32") {
    const updateExe = path.resolve(
      path.dirname(process.execPath),
      "..",
      "Update.exe"
    );

    const run = function (args: [string], done: () => void) {
      spawn(updateExe, args, {
        detached: true,
      }).on("close", done);
    };

    const check = function () {
      const cmd = process.argv[1];

      const target = path.basename(process.execPath);

      if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
        run(["--createShortcut=" + target + ""], app.quit);
        return true;
      }
      if (cmd === "--squirrel-uninstall") {
        run(["--removeShortcut=" + target + ""], app.quit);
        return true;
      }
      if (cmd === "--squirrel-obsolete") {
        app.quit();
        return true;
      }
      return false;
    };

    if (check()) {
      app.quit();
    }
  }
};

export { squirrelStartup };
