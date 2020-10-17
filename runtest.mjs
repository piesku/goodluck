import { strict as assert } from "assert";
import { JSDOM } from "jsdom";

if (process.argv.length !== 3) {
    console.log(`Usage: ${process.argv[1]} FILE`);
    process.exit(1);
}

let {window} = new JSDOM("", {
    url: "http://localhost/",
    runScripts: "dangerously",
});

for (let key of Object.getOwnPropertyNames(window)) {
    f (!key.startsWith("_") && !(key in global)) {
        global[key] = window[key];
    }
}

let file_path = process.argv[2];
let module = await import("./" + file_path);

for (let [name, fn] of Object.entries(module)) {
    if (name.startsWith("test_")) {
        process.stdout.write(name);
        try {
            fn(assert);
            process.stdout.write(" PASS\n");
        } catch (e) {
            process.stdout.write(" FAIL\n");
            console.error(e);
        }
    }
}
