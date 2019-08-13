import {light} from "../components/com_light.js";
import {Blueprint} from "./blu_common";

export let light_blueprint: Blueprint = {
    using: [light([1, 1, 1], 5)],
};
