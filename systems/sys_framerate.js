let counter = document.getElementById("fps");

export default
function tick(game, delta) {
    let frame_rate = (1 / delta).toFixed(0);
    let frame_time = (delta * 1000).toFixed(0);
    counter.textContent = `${frame_rate} fps; ${frame_time} ms`;
}
