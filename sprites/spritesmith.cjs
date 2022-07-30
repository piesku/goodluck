const {writeFileSync} = require("fs");
const Spritesmith = require("spritesmith");

if (process.argv.length < 4) {
    console.error("Generate a spritesheet and a spritemap from a set of images.");
    console.error("  node spritesmith.cjs FILES... sheet.png > sheet.json");
    process.exit(1);
}

let files = process.argv.slice(2);
let sheet = files.pop();

Spritesmith.run(
    {
        src: files,
    },
    function handleResult(err, result) {
        if (err) {
            throw err;
        }

        writeFileSync(__dirname + "/" + sheet, result.image);
        console.log(
            `// prettier-ignore
export let spritesheet: {
    [key: string]: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
} =`,
            JSON.stringify(result.coordinates, null, 4)
        );
    }
);
