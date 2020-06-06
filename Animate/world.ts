import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Animate: Array<Animate> = [];
    AudioSource: Array<AudioSource> = [];
    Camera: Array<Camera> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
