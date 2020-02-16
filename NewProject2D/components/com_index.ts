const enum Component {
    Draw,
    Transform2D,
}

export const enum Has {
    Draw = 1 << Component.Draw,
    Transform2D = 1 << Component.Transform2D,
}
