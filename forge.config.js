import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";

import { PublisherGithub } from "@electron-forge/publisher-github";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

const config = {
  packagerConfig: {
    executableName: "tadabor",
    icon: "./src/tadabor.ico",
    asar: false,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "tadabor",
      setupIcon: "./src/tadabor.ico",
      iconUrl:
        "https://raw.githubusercontent.com/AbstractThinker0/tadabor-desktop/master/src/tadabor.ico",
    }),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({ options: { license: "MIT" } }),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.ts",
          config: "vite.main.config.ts",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts",
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: "AbstractThinker0",
        name: "tadabor-desktop",
      },
      prerelease: false,
      draft: true,
    }),
  ],
};

export default config;