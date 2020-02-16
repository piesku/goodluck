const enum Component {
    Camera,
    Collide,
    ControlSpawner,
    Lifespan,
    Light,
    Render,
    RigidBody,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    ControlSpawner = 1 << Component.ControlSpawner,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Transform = 1 << Component.Transform,
}
