import {WorldImpl} from "../common/world.js";
import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Bone} from "./components/com_bone.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render_ext.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Animate,
    AudioListener,
    AudioSource,
    Bone,
    Camera,
    Children,
    Control,
    Dirty,
    Light,
    Render,
    Transform,
}

export const enum Has {
    None = 0,
    Animate = 1 << Component.Animate,
    AudioListener = 1 << Component.AudioListener,
    AudioSource = 1 << Component.AudioSource,
    Bone = 1 << Component.Bone,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Control = 1 << Component.Control,
    Dirty = 1 << Component.Dirty,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Animate: Array<Animate> = [];
    AudioSource: Array<AudioSource> = [];
    Bone: Array<Bone> = [];
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
