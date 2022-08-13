import hl from "highlight.js/lib/core";
import hl_typescript from "highlight.js/lib/languages/typescript";
import {marked} from "marked";
import fs from "node:fs";
import {parseArgs} from "node:util";
hl.registerLanguage("typescript", hl_typescript);

let {positionals, values} = parseArgs({
    allowPositionals: true,
    options: {
        component: {
            type: "string",
            multiple: true,
        },
        system: {
            type: "string",
            multiple: true,
        },
        common: {
            type: "string",
            multiple: true,
        },
    },
});

let source_ts = positionals.shift();
let content = fs.readFileSync(source_ts);
let lines = content.toString().split("\n");

class Section {
    constructor(docs, code) {
        this.docs = docs;
        this.code = code;
    }
}

class Line {
    constructor(lineno, text) {
        this.lineno = lineno;
        this.value = text;
    }
}

let sections = [];

let in_comment = false;
let in_indent = false;
let code = [];
let docs = [];

let lineno = 0;

for (let line of lines) {
    lineno++;
    if (line.startsWith("/**")) {
        in_comment = true;
    } else if (in_comment && line.startsWith(" *")) {
        let lineobj = new Line(lineno, line.slice(3));
        docs.push(lineobj);
    } else if (in_comment && line.startsWith("*/")) {
        in_comment = false;
    } else if (line === "" && !in_indent) {
        let section = new Section(docs, code);
        sections.push(section);
        code = [];
        docs = [];
    } else {
        in_comment = false;
        if (/^\s/.test(line)) {
            in_indent = true;
        } else {
            in_indent = false;
        }
        let lineobj = new Line(lineno, line);
        code.push(lineobj);
    }
}

//console.log(JSON.stringify(sections, null, 4));

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

marked.use({
    extensions: [
        {
            name: "definition_list",
            level: "block",
            start(src) {
                // Hint to Marked.js to stop and check for a match
                return src.match(/@(param|returns)/)?.index;
            },
            tokenizer(src, tokens) {
                if (src.startsWith("@param") || src.startsWith("@returns")) {
                    let token = {
                        // Token to generate
                        type: "definition_list", // Should match "name" above
                        raw: src, // Text to consume from the source
                        tokens: [], // Array where child inline tokens will be generated
                    };
                    // Queue this data to be processed for inline tokens
                    this.lexer.inline(src.trim(), token.tokens);
                    return token;
                }
            },
            renderer(token) {
                return `<dl>${this.parser.parseInline(token.tokens)}\n</dl>`;
            },
        },
        {
            name: "definition_item",
            level: "inline",
            start(src) {
                // Hint to Marked.js to stop and check for a match
                return src.match(/@(param|returns)/)?.index;
            },
            tokenizer(src, tokens) {
                // Regex for the complete token, anchored to string start
                let rule = /^@(?:(param) ([^ ]*)(?: -)?|(returns)) ([^]*?)(?:\n(?=@)|$)/;
                let match = rule.exec(src);
                if (match) {
                    return {
                        // Token to generate
                        type: "definition_item", // Should match "name" above
                        raw: match[0], // Text to consume from the source
                        tag: match[1] || match[3], // The tag: param or returns
                        dt: match[2],
                        dd: this.lexer.inlineTokens(match[4].trim()),
                    };
                }
            },
            renderer(token) {
                return `<dt>
            ${token.dt ? `<code>${token.dt}</code>` : ""}
            <small>${token.tag}</small>
        </dt><dd>${this.parser.parseInline(token.dd)}</dd>`;
            },
            // Child tokens to be visited by walkTokens
            childTokens: ["dt", "dd"],
        },
    ],
});

function render_docs(section) {
    let content = section.docs.map((line) => line.value).join("\n");
    if (content.length > 0) {
        return `<section class="docs">
            ${marked(content)}
        </section>`;
    }

    return "";
}

function render_code(section) {
    let content = section.code.map((line) => line.value).join("\n");
    if (content.length > 0) {
        return `<section class="code">
            <pre><code>${hl.highlight(content, {language: "typescript"}).value}</code></pre>
        </section>`;
    }

    return "";
}

function render_link(filename_html) {
    let filename_ts = filename_html.replace(".html", ".ts");
    let nice_name = filename_html.replace(/^com(mon)?_/, "").replace(/.html$/, "");
    if (source_ts.includes(filename_ts)) {
        return nice_name;
    }

    return `<a href="${filename_html}">${nice_name}</a>`;
}

let first_section = sections[0];
if (first_section.code.length === 0) {
    // The first section is module-wide docs.
    sections.shift();
} else {
    first_section = null;
}

console.log(`
<html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
    background-color: whitesmoke;
    margin: 0;
}
.wrapper {
    display: flex;
    flex-flow: row wrap;
}
main {
    flex: 1;
    min-width: 340px;
    background-color: #fefefe;
    padding: 15px;
}
aside {
    flex: 2;
    min-width: 340px;
    padding: 15px;
}

aside .docs {
    background-color: cornsilk;
    border: 1px solid #999;
    border-radius: 10px;
    margin-bottom: 15px;
    padding: 0 15px;
}

@media (min-width: 1024px) {
    aside .docs {
        float: right;
        width: 40%;
    }
}

nav .columns {
    column-width: 10rem;
}

aside .docs p:first-child {
    font-weight: bold;
}

pre {
    white-space: pre-wrap;
}
code {
    font: 14px/1.3 Inconsolata, monospace;
}
dt small {
    font-style: italic;
}
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/vs.min.css">
<div class="wrapper">
    <main>
        <header>
            <a href="/">Goodluck</a> /
            <a href="/reference/">API Reference</a>
        </header>
        <article>
            ${first_section ? render_docs(first_section) : ""}
        </article>
        <hr>
        <nav>
        ${
            values.component
                ? `<section>
                    <h1>Core Components</h1>
                    <div class="columns">
                    ${values.component.map(render_link).join("<br>")}
                    </div>
                </section>`
                : ""
        }
        ${
            values.system
                ? `<section>
                    <h1>Core Systems</h1>
                    <div class="columns">
                    ${values.system.map(render_link).join("<br>")}
                    </div>
                </section>`
                : ""
        }
        ${
            values.common
                ? `<section>
                    <h1>Common Utilities</h1>
                    <div class="columns">
                    ${values.common.map(render_link).join("<br>")}
                    </div>
                </section>`
                : ""
        }
        </nav>
    </main>
    <aside>
    ${sections
        .flatMap((section) => [render_docs(section), render_code(section), "<br clear=right>"])
        .join("\n")}
    </aside>
</div>
</html>
`);
