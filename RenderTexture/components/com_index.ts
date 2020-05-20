const enum Component {
    Camera,
    Render,
    Rotate,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Render = 1 << Component.Render,
    Rotate = 1 << Component.Rotate,
    Transform = 1 << Component.Transform,
}
