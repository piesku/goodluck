const enum Component {
    Camera,
    Draw,
    Light,
    NavAgent,
    Pick,
    Pickable,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    NavAgent = 1 << Component.NavAgent,
    Pick = 1 << Component.Pick,
    Pickable = 1 << Component.Pickable,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}
