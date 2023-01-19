var drawPoints = false;
var points = [];

function normals(points) {
        ns = [];

        for (i = 0; i < points.length - 1; i++) {
                const [x0, y0] = points[i];
                const [x1, y1] = points[i + 1];
                const x = x1 - x0;
                const y = y1 - y0;
                ns.push([y, -x]);
        }

        return ns;
}

function scalar(p, q) {
        var s = 0;
        for (let i = 0; i < p.length; i++) {
                s += p[i] * q[i];
        }
        return s;
}

function isInsideConvex(xy, points) {
        ns = normals(points);

        for (let i = 0; i < points.length - 1; i++) {
                if (scalar(points[i], ns[i]) > scalar(xy, ns[i])) {
                        return false;
                }
        }

        return true;
}

function isInsideGeneral(xy, points) {
        const ns = normals(points);
        const dir = ns[0];
        var count = 0;

        for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const n = ns[i];
                const lambda = (scalar(p1, n) - scalar(xy, n)) / scalar(dir, n);

                const v = [
                        xy[0] + lambda * dir[0] - p1[0],
                        xy[1] + lambda * dir[1] - p1[1],
                ];
                const delta = [p2[0] - p1[0], p2[1] - p1[1]];
                const t = scalar(v, delta) / scalar(delta, delta);

                if (lambda >= 0 && 0 <= t && t <= 1) {
                        count += 1;
                }
        }

        return count % 2 == 1;
}

function getXY(event) {
        const canvas = document.getElementById("canvas");
        var box = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");

        const x = event.clientX - box.left;
        const y = event.clientY - box.top;

        console.log(`x=${x}, y=${y}`);

        return [x, y];
}

function point(event) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        const [x, y] = getXY(event);
        const r = 1;

        if (drawPoints) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                //if (isInsideConvex([x, y], points)) {
                if (isInsideGeneral([x, y], points)) {
                        ctx.fillStyle = "blue";
                } else {
                        ctx.fillStyle = "red";
                }
                ctx.fill();
        } else {
                if (points.length > 0) {
                        ctx.lineTo(x, y);
                }
                points.push([x, y]);
                ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.moveTo(x, y);
        }
}

function handleMode(event) {
        if (!drawPoints && event.key == " ") {
                console.log("handleMode");
                drawPoints = true;

                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                const [x, y] = points[0];
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.stroke();

                points.push(points[0]);
        }
}

function registerHandlers() {
        console.log("registering handlers");
        addEventListener("click", point);
        addEventListener("keydown", handleMode);
}
