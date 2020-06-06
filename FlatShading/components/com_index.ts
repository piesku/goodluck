const enum Component {
    Camera,
    Light,
    Render,
    Rotate,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Rotate = 1 << Component.Rotate,
    Transform = 1 << Component.Transform,
}
