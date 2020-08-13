const fs = require("fs");
const posthtml = require("posthtml");

if (process.argv.length !== 3) {
    console.log(`Usage: ${process.argv[1]} INPUT`);
    process.exit(1);
}

let content = fs.readFileSync(process.argv[2]);
let processor = posthtml([
    require("posthtml-inline-assets")(),
    require("htmlnano")({
        collapseAttributeWhitespace: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: "conservative",
        deduplicateAttributeValues: true,
        mergeScripts: true,
        mergeStyles: true,
        minifyCss: true,
        minifyJs: false,
        removeComments: "all",
        removeEmptyAttributes: true,
        removeRedundantAttributes: false,
        removeUnusedCss: false,
    }),
]);

processor
    .process(content.toString(), {
        quoteAllAttributes: false,
    })
    .then((result) => console.log(result.html));
