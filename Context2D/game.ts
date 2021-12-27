import {Game2D} from "../common/game.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {World} from "./world.js";

export class Game extends Game2D {
    World = new World();

    override FrameUpdate(delta: number) {
        sys_transform2d(this, delta);
        sys_draw2d(this, delta);
    }
}
