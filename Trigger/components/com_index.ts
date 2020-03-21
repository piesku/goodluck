const enum Component {
    Camera,
    Collide,
    Light,
    Render,
    Rotate,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Rotate = 1 << Component.Rotate,
    Transform = 1 << Component.Transform,
}
