type Interpolation = string | number | boolean | undefined | null | Array<Interpolation>;

function shift(values: Array<Interpolation>) {
    let value = values.shift();
    if (typeof value === "boolean" || value == undefined) {
        return "";
    } else if (Array.isArray(value)) {
        return value.join("");
    } else {
        return value;
    }
}

export function html(strings: TemplateStringsArray, ...values: Array<Interpolation>) {
    return strings.reduce((out, cur) => out + shift(values) + cur);
}
