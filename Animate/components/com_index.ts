const enum Component {
    Animate,
    Camera,
    Control,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    Camera = 1 << Component.Camera,
    Control = 1 << Component.Control,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}
