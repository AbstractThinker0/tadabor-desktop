import type { ForgeConfig } from "@electron-forge/shared-types";

import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";

import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    executableName: "tadabor",
    icon: "./src/tadabor.ico",
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "tadabor",
        setupIcon: __dirname + "/src/tadabor.ico",
        iconUrl:
          "https://raw.githubusercontent.com/EnlightenCode/tadabor-desktop/master/src/tadabor.ico",
      },
    },
  ],
  plugins: [
    new WebpackPlugin({
      devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "EnlightenCode",
          name: "tadabor-desktop",
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};

export default config;
