const enum Component {
    Animate,
    AudioSource,
    Camera,
    Control,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Control = 1 << Component.Control,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}
