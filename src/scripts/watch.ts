import { IO } from "src/util/IO";
import { build } from "./build";

IO.watch(['data', 'site'], () => build(true));