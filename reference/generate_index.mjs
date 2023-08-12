import hl from "highlight.js/lib/core";
import hl_typescript from "highlight.js/lib/languages/typescript";
import {marked} from "marked";
import fs from "node:fs";
import {parseArgs} from "node:util";
hl.registerLanguage("typescript", hl_typescript);

let {values} = parseArgs({
    options: {
        component: {
            type: "string",
            multiple: true,
        },
        system: {
            type: "string",
            multiple: true,
        },
        library: {
            type: "string",
            multiple: true,
        },
        utility: {
            type: "string",
            multiple: true,
        },
    },
});

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        const language = hl.getLanguage(lang) ? lang : "typescript";
        return hl.highlight(code, {language}).value;
    },
    langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
});

function render_definition(filename_html) {
    let nice_name = filename_html.replace(/^(com|lib)_/, "").replace(/.html$/, "");
    let source_path = "";
    if (filename_html.startsWith("com_")) {
        source_path = "../core/components/" + filename_html.replace(/\.html$/, ".ts");
    } else if (filename_html.startsWith("sys_")) {
        source_path = "../core/systems/" + filename_html.replace(/\.html$/, ".ts");
    } else if (filename_html.startsWith("lib_")) {
        source_path = "../lib/" + nice_name + ".ts";
    } else {
        source_path = "../util/" + filename_html.replace(/\.html$/, ".cjs");
    }
    let source_contents = fs.readFileSync(source_path, "utf8");
    let source_lines = source_contents.split("\n");
    if (source_lines[0].startsWith("/**") && source_lines[1].startsWith(" * #")) {
        let blurb_lines = [];
        for (let line of source_lines.slice(3)) {
            line = line.slice(3); // Remove the leading " * ".
            if (line === "") {
                break;
            } else {
                blurb_lines.push(line);
            }
        }
        let blurb_html = marked.parse(blurb_lines.join("\n"));
        return `<dt><a href="${filename_html}">${nice_name}</a></dt><dd>${blurb_html}</dd>`;
    }
    return `<dt><a href="${filename_html}">${nice_name}</a></dt>`;
}

console.log(`<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>Goodluck API Reference</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
    background-color: #fefefe;
    margin: 0;
    padding: 1rem;
}
.wrapper {
    display: flex;
    flex-flow: row wrap;
    column-gap: 1em;
}
section {
    flex: 1;
    min-width: 340px;
}
dd p {
    margin-top: 0;
}

a:active,
a:hover {
        background-color: #ff0;
}
code {
    font: 14px/1.3 Inconsolata, monospace;
}
</style>
<nav>
    <a href="/">Goodluck</a>
</nav>
<main>
    <h1>API Reference</h1>
    <p>Goodluck includes a versatile collection of components and systems that can help you build your game.</p>
    <div class="wrapper">
        ${
            values.component
                ? `<section>
                    <h2>Core Components</h2>
                    <dl>
                        ${values.component.map(render_definition).join("\n")}
                    </dl>
                </section>`
                : ""
        }
        ${
            values.system
                ? `<section>
                    <h2>Core Systems</h2>
                    <dl>
                        ${values.system.map(render_definition).join("\n")}
                    </dl>
                </section>`
                : ""
        }
        ${
            values.library
                ? `<section>
                    <h2>Libraries</h2>
                    <dl>
                        ${values.library.map(render_definition).join("\n")}
                    </dl>
                </section>`
                : ""
        }
        ${
            values.utility
                ? `<section>
                    <h2>Utilities</h2>
                    <dl>
                        ${values.utility.map(render_definition).join("\n")}
                    </dl>
                </section>`
                : ""
        }
    </div>
</main>
</html>
`);
