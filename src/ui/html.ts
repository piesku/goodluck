type Interpolation = string | number | false | Interpolations;
interface Interpolations extends Array<Interpolation> {}

function shift(values: Interpolations) {
    let value = values.shift();
    if (value === false || value === undefined) {
        return "";
    } else if (Array.isArray(value)) {
        return value.join("");
    } else {
        return value;
    }
}

export function html(strings: TemplateStringsArray, ...values: Interpolations) {
    return strings.reduce((out, cur) => out + shift(values) + cur);
}
