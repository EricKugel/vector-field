let canvas;
let ctx;

let height;
let width;

let mid_pixels;

let spacing = [50, 1];

const colors = ["blue", "green", "yellow", "orange", "red"];

const FPS = 30;

let mouseDown = false;
let lastPos = [];

var get_x = (x, y) => {
    return 0;
}

var get_y = (x, y) => {
    return 0;
}

const draw = () => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "black";
    ctx.fillRect(mid_pixels[0], 0, 5, height);
    ctx.fillRect(0, mid_pixels[1], width, 5);

    ctx.fillStyle = "gray";
    for (var x = mid_pixels[0]; x < width; x += spacing[0]) {
        ctx.fillRect(x, 0, 1, height);
    } for (var x = mid_pixels[0]; x > 0; x -= spacing[0]) {
        ctx.fillRect(x, 0, 1, height);
    } for (var y = mid_pixels[1]; y > 0; y -= spacing[0]) {
        ctx.fillRect(0, y, width, 1);
    } for (var y = mid_pixels[1]; y < height; y += spacing[0]) {
        ctx.fillRect(0, y, width, 1);
    }

    const draw_vector = (x, y) => {
        var vx = get_x((x - mid_pixels[0]) / spacing[0], (-y + mid_pixels[1]) / spacing[0]);
        var vy = get_y((x - mid_pixels[0]) / spacing[0], (-y + mid_pixels[1]) / spacing[0]);
        const length = Math.sqrt(vx ** 2 + vy ** 2);
        vx /= length / spacing[0];
        vy /= length / spacing[0];

        ctx.beginPath();
        ctx.strokeStyle = colors[Math.floor(length / 10) < colors.length ? Math.floor(length / 10) : colors.length - 1];
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y - vy);
        ctx.stroke();
    }

    for (var x = mid_pixels[0]; x < width; x += spacing[0]) {
        for (var y = mid_pixels[1]; y < height; y += spacing[0]) {
            draw_vector(x, y);
        }
        for (var y = mid_pixels[1]; y > 0; y -= spacing[0]) {
            draw_vector(x, y);
        }
    }
    for (var x = mid_pixels[0]; x > 0; x -= spacing[0]) {
        for (var y = mid_pixels[1]; y < height; y += spacing[0]) {
            draw_vector(x, y);
        }
        for (var y = mid_pixels[1]; y > 0; y -= spacing[0]) {
            draw_vector(x, y);
        }
    }
}

const tick = () => {
    draw();
    setTimeout(tick, 1000/30);
}

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    mid_pixels = [width / 2, height / 2];

    canvas.addEventListener("mousedown", (e) => {
        mouseDown = true;
        lastPos = [e.clientX, e.clientY];
    });
    canvas.addEventListener("mouseup", () => {mouseDown = false});
    canvas.addEventListener("mousemove", (e) => {
        if (mouseDown) {
            deltaX = e.clientX - lastPos[0];
            deltaY = e.clientY - lastPos[1];
            mid_pixels = [mid_pixels[0] + deltaX, mid_pixels[1] + deltaY];
            lastPos = [e.clientX, e.clientY];
        }
    });

    document.getElementById("home").onclick = () => {
        mid_pixels = [width / 2, height / 2];
    }

    document.getElementById("equationX").onchange = (e) => {
        get_x = eval("(x, y) => {return " + e.target.value + ";}");
    };
    document.getElementById("equationY").onchange = (e) => {
        get_y = eval("(x, y) => {return " + e.target.value + ";}");
    };

    document.getElementById("equationX").value = "x**2 - y**2 - 4";
    document.getElementById("equationY").value = "2 * x * y";
    document.getElementById("equationY").onchange({"target": document.getElementById("equationY")});
    document.getElementById("equationX").onchange({"target": document.getElementById("equationX")});

    tick();
}

