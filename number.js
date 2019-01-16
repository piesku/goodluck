export
function* range(from, to) {
    for (let i = from; i < to; i++) {
        yield i;
    }
}
