const enum Component {
    Camera,
    Collide,
    ControlPlayer,
    Light,
    Mimic,
    Move,
    Named,
    Render,
    RigidBody,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    ControlPlayer = 1 << Component.ControlPlayer,
    Light = 1 << Component.Light,
    Mimic = 1 << Component.Mimic,
    Move = 1 << Component.Move,
    Named = 1 << Component.Named,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Transform = 1 << Component.Transform,
}
