const enum Component {
    Camera,
    Collide,
    ControlPlayer,
    Draw,
    Light,
    Move,
    NavAgent,
    Pick,
    Pickable,
    Render,
    Selectable,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    ControlPlayer = 1 << Component.ControlPlayer,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    NavAgent = 1 << Component.NavAgent,
    Pick = 1 << Component.Pick,
    Pickable = 1 << Component.Pickable,
    Render = 1 << Component.Render,
    Selectable = 1 << Component.Selectable,
    Transform = 1 << Component.Transform,
}
