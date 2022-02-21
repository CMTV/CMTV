import YAML from "yaml";

import { Global } from "src/Global";
import { IO } from "src/util/IO";

class ActionPreset extends Global
{
    presets: any;

    reset()
    {
        this.presets = YAML.parse(IO.readFile('data/projects/actions.yml'));
    }
}

export const ACTION_PRESET = new ActionPreset;