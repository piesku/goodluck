import {ease_in_out_quart, ease_out_quart} from "../../common/easing.js";
import {Vec4} from "../../common/math.js";
import {from_euler} from "../../common/quat.js";
import {element} from "../../common/random.js";
import {animate, AnimationFlag} from "../components/com_animate.js";
import {children} from "../components/com_children.js";
import {render_colored_shaded} from "../components/com_render_ext.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

let shirt_colors: Array<Vec4> = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 1, 1, 1],
];
let skin_colors: Array<Vec4> = [
    [1, 0.8, 0.6, 1],
    [0.6, 0.4, 0, 1],
];
let hair_colors: Array<Vec4> = [
    [1, 1, 0, 1],
    [0, 0, 0, 1],
    [0.6, 0.4, 0, 1],
    [0.4, 0, 0, 1],
];
let pants_colors: Array<Vec4> = [
    [0, 0, 0, 1],
    [0.53, 0, 0, 1],
    [0.6, 0.4, 0.2, 1],
    [0.33, 0.33, 0.33, 1],
];

export function blueprint_character_voxel(game: Game) {
    let skin_color = element(skin_colors);
    let hair_color = element(hair_colors);
    let shirt_color = element(shirt_colors);
    let pants_color = element(pants_colors);
    return [
        children(
            // spine
            [
                transform(),
                animate({
                    idle: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Rotation: from_euler([0, 0, 0, 1], 0, 5, 0),
                            },
                            {
                                Timestamp: 0.5,
                                Rotation: from_euler([0, 0, 0, 1], 0, -5, 0),
                            },
                        ],
                    },
                    walk: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Rotation: from_euler([0, 0, 0, 1], 0, 5, 0),
                            },
                            {
                                Timestamp: 0.2,
                                Rotation: from_euler([0, 0, 0, 1], 0, -5, 0),
                            },
                        ],
                    },
                    jump: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Translation: [0, 0, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [0, 2, 0],
                                Rotation: from_euler([0, 0, 0, 1], -15, 0, 0),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [0, 0, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, 0),
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
                children(
                    // head
                    [
                        transform([0, 1.5, 0.5], undefined, [2, 2, 2]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            skin_color
                        ),
                    ],
                    // hair
                    [
                        transform([0, 2, 0], undefined, [2.1, 1.1, 1.1]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            hair_color
                        ),
                    ],
                    // body
                    [
                        transform([0, -1, 0], undefined, [2, 3, 1]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            shirt_color
                        ),
                    ]
                ),
            ],
            // left shoulder
            [
                transform([1.5, 0, 0]),
                animate({
                    idle: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], 5, 0, 0),
                            },
                            {
                                Timestamp: 0.5,
                                Rotation: from_euler([0, 0, 0, 1], -5, 0, 0),
                            },
                        ],
                    },
                    walk: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], 30, 0, 0),
                            },
                            {
                                Timestamp: 0.2,
                                Rotation: from_euler([0, 0, 0, 1], -60, 0, 0),
                            },
                        ],
                    },
                    jump: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Translation: [1.5, 0, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [1.5, 2, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, 135),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [1.5, 0, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
                children(
                    // left arm
                    [
                        transform([0, -0.5, 0], undefined, [1, 2, 1]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            shirt_color
                        ),
                    ],
                    // left hand
                    [
                        transform([0, -2, 0], undefined, [0.9, 1, 0.9]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            skin_color
                        ),
                    ]
                ),
            ],
            // right shoulder
            [
                transform([-1.5, 0, 0]),
                animate({
                    idle: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], -5, 0, 0),
                            },
                            {
                                Timestamp: 0.5,
                                Rotation: from_euler([0, 0, 0, 1], 5, 0, 0),
                            },
                        ],
                    },
                    walk: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], -60, 0, 0),
                            },
                            {
                                Timestamp: 0.2,
                                Rotation: from_euler([0, 0, 0, 1], 30, 0, 0),
                            },
                        ],
                    },
                    jump: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Translation: [-1.5, 0, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [-1.5, 2, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, -135),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [-1.5, 0, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
                children(
                    // right arm
                    [
                        transform([0, -0.5, 0], undefined, [1, 2, 1]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            shirt_color
                        ),
                    ],
                    // right hand
                    [
                        transform([0, -2, 0], undefined, [0.9, 1, 0.9]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            skin_color
                        ),
                    ]
                ),
            ],
            // left hip
            [
                transform([0.5, -2, 0]),
                animate({
                    idle: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], 5, 0, 0),
                            },
                            {
                                Timestamp: 1,
                                Rotation: from_euler([0, 0, 0, 1], 5, 0, 0),
                            },
                        ],
                    },
                    walk: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], -45, 0, 0),
                            },
                            {
                                Timestamp: 0.2,
                                Rotation: from_euler([0, 0, 0, 1], 45, 0, 0),
                            },
                        ],
                    },
                    jump: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Translation: [0.5, -2, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [0.5, 0, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, 45),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [0.5, -2, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
                children(
                    // left leg
                    [
                        transform([0, -1.5, 0], undefined, [1, 2, 1]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            pants_color
                        ),
                    ]
                ),
            ],
            // right hip
            [
                transform([-0.5, -2, 0]),
                animate({
                    idle: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], -5, 0, 0),
                            },
                            {
                                Timestamp: 1,
                                Rotation: from_euler([0, 0, 0, 1], -5, 0, 0),
                            },
                        ],
                    },
                    walk: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 1], 45, 0, 0),
                            },
                            {
                                Timestamp: 0.2,
                                Rotation: from_euler([0, 0, 0, 1], -45, 0, 0),
                            },
                        ],
                    },
                    jump: {
                        Keyframes: [
                            {
                                Timestamp: 0.0,
                                Translation: [-0.5, -2, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [-0.5, 0, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, -45),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [-0.5, -2, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
                children(
                    // right leg
                    [
                        transform([0, -1.5, 0], undefined, [1, 2, 1]),
                        render_colored_shaded(
                            game.MaterialColoredGouraud,
                            game.MeshCube,
                            pants_color
                        ),
                    ]
                ),
            ]
        ),
    ];
}
