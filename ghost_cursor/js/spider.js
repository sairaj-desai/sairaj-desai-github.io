document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('dotsCanvas');
    const ctx = canvas.getContext('2d');

    let dots = [];
    const numDots = 100;
    const connectDistance = 200;
    let mouse = {
        x: undefined,
        y: undefined
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Dot {
        constructor(x, y, dx, dy, radius, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    function init() {
        dots = [];
        for (let i = 0; i < numDots; i++) {
            let radius = Math.random() * 2 + 1;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            let dx = (Math.random() - 0.5) * 0.5;
            let dy = (Math.random() - 0.5) * 0.5;
            dots.push(new Dot(x, y, dx, dy, radius, 'rgba(255, 255, 255, 0.5)'));
        }
    }

    function connect() {
        for (let i = 0; i < dots.length; i++) {
            for (let j = i; j < dots.length; j++) {
                let distance = Math.sqrt(Math.pow(dots[i].x - dots[j].x, 2) + Math.pow(dots[i].y - dots[j].y, 2));
                if (distance < connectDistance) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectDistance})`;
                    ctx.lineWidth = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
            if (mouse.x !== undefined && mouse.y !== undefined) {
                let distanceToMouse = Math.sqrt(Math.pow(dots[i].x - mouse.x, 2) + Math.pow(dots[i].y - mouse.y, 2));
                if (distanceToMouse < connectDistance) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distanceToMouse / connectDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < dots.length; i++) {
            dots[i].update();
        }

        connect();
    }

    resizeCanvas();
    animate();
});