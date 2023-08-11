const {readFileSync} = require("fs");

let args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Generate an atlas description from a Tiled tileset (.tsj).");
    console.error("  node tiled_atlas_desc.cjs atlas.tsj");
    process.exit(1);
}

let tileset_path = args.pop();
let tileset_file = readFileSync("./" + tileset_path);
let tileset = JSON.parse(tileset_file);

let sprites = {};
let y = 1;

for (let tile of tileset.tiles) {
    sprites[tile.id] = {
        x: 1,
        y: y,
        w: tile.imagewidth,
        h: tile.imageheight,
    };
    y += tile.imageheight + 2;

    if (tile.animation) {
        sprites[tile.id].a = {};
        for (let frame of tile.animation) {
            sprites[tile.id].a[frame.tileid] = frame.duration / 1000;
        }
    }

    if (tile.properties) {
        let collide_prop = tile.properties.find((x) => x.name === "Collision");
        if (collide_prop) {
            sprites[tile.id].c = collide_prop.value;
        }
    }
}

console.log(`// prettier-ignore
export const atlas: {
	[id: string]: {
		x: number,
		y: number,
		w: number,
		h: number,
		a?: Record<string, number>,
        c?: boolean,
	}
} = ${JSON.stringify(sprites, null, 4)};
`);
