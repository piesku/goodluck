const enum Component {
    Camera,
    EmitParticles,
    Light,
    Render,
    Shake,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    EmitParticles = 1 << Component.EmitParticles,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
}
