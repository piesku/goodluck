import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render1.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Animate,
    AudioListener,
    AudioSource,
    Camera,
    Children,
    Control,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    AudioListener = 1 << Component.AudioListener,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Control = 1 << Component.Control,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Animate: Array<Animate> = [];
    AudioSource: Array<AudioSource> = [];
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
