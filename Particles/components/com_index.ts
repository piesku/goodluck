const enum Component {
    Camera,
    EmitParticles,
    Render,
    Shake,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    EmitParticles = 1 << Component.EmitParticles,
    Render = 1 << Component.Render,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
}
