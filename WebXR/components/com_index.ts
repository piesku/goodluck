const enum Component {
    Camera,
    ControlXr,
    Light,
    Pose,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    ControlXr = 1 << Component.ControlXr,
    Light = 1 << Component.Light,
    Pose = 1 << Component.Pose,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}
