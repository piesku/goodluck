import {ease_in_out_quart, ease_out_quart} from "../../common/easing.js";
import {Blueprint} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {animate, AnimationFlag} from "../components/com_animate.js";
import {bone} from "../components/com_bone.js";
import {children} from "../components/com_children.js";
import {render_colored_skinned} from "../components/com_render_ext.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_character_rigged(game: Game): Blueprint<Game> {
    return [
        render_colored_skinned(game.MaterialColoredSkinned, game.MeshLudek, [1, 0.3, 0, 1]),
        bone(0),
        children(
            // spine
            [
                transform([0, 0.63, 0]),
                bone(1),
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
                                Translation: [0, 0.63, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [0, 1.13, 0],
                                Rotation: from_euler([0, 0, 0, 1], -15, 0, 0),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [0, 0.63, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, 0),
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
            ],
            // left shoulder
            [
                transform([0.3, 1.2, 0], from_euler([0, 0, 0, 1], 0, 0, 90)),
                bone(2),
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
                                Translation: [0.3, 1.2, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [0.3, 1.7, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, 135),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [0.3, 1.2, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
            ],
            // right shoulder
            [
                transform([-0.3, 1.2, 0], from_euler([0, 0, 0, 1], 0, 0, -90)),
                bone(3),
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
                                Translation: [-0.3, 1.2, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [-0.3, 1.7, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, -135),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [-0.3, 1.2, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
            ],
            // left hip
            [
                transform([0.15, 0.63, 0]),
                bone(4),
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
                                Translation: [0.15, 0.63, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [0.15, 1.13, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, 45),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [0.15, 0.63, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
            ],
            // right hip
            [
                transform([-0.15, 0.63, 0]),
                bone(5),
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
                                Translation: [-0.15, 0.63, 0],
                                Rotation: [0, 0, 0, 1],
                            },
                            {
                                Timestamp: 0.2,
                                Translation: [-0.15, 1.13, 0],
                                Rotation: from_euler([0, 0, 0, 1], 0, 0, -45),
                                Ease: ease_in_out_quart,
                            },
                            {
                                Timestamp: 0.4,
                                Translation: [-0.15, 0.63, 0],
                                Rotation: [0, 0, 0, 1],
                                Ease: ease_out_quart,
                            },
                        ],
                        Flags: AnimationFlag.None,
                    },
                }),
            ]
        ),
    ];
}
