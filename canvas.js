var drawPoints = false;
var points = [];

function normals(points) {
	ns = [];

	for (i = 0; i < points.length - 1; i++) {
		const [x0, y0] = points[i];
		const [x1, y1] = points[i+1];
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

function isInsideConvex(x, y) {
	ns = normals(points);

	for (let i = 0; i < points.length - 1; i++) {
		if (scalar(points[i], ns[i]) > scalar([x, y], ns[i])) {
			return false;
		}
	}

        return true;
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
                if (isInsideConvex(x, y)) {
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

		ns = normals(points);
		for (i = 0; i < points.length - 1; i++) {
			var px = points[i][0];
			var py = points[i][1];
			var nx = ns[i][0];
			var ny = ns[i][1];
			console.log(`point=(${px},${py}), normal=(${nx},${ny})`);
			px = points[i][0] + (points[i+1][0] - points[i][0]) / 2;
			py = points[i][1] + (points[i+1][1] - points[i][1]) / 2;
			nx = nx / Math.sqrt(nx*nx + ny*ny) * 20;
			ny = ny / Math.sqrt(nx*nx + ny*ny) * 20;
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.lineTo(px + nx, py + ny);
			ctx.closePath();
			ctx.stroke();
		}
        }
}

function registerHandlers() {
        console.log("registering handlers");
        addEventListener("click", point);
        addEventListener("keydown", handleMode);
}
