const enum Component {
    Camera,
    Draw,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}
