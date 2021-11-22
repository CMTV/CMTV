import { BuildConfig } from "src/BuildConfig";
import { argsToConfig, build, showBanner, showFlags, showMessages } from "src/scripts/build";

let args = process.argv.slice(2);
let buildConfig = new BuildConfig;

argsToConfig(buildConfig, args);

showBanner();
showFlags(buildConfig);
showMessages(buildConfig);

build(buildConfig);