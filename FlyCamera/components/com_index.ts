const enum Component {
    Camera,
    ControlPlayer,
    Draw,
    Light,
    Move,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    ControlPlayer = 1 << Component.ControlPlayer,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}
