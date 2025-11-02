document.addEventListener('DOMContentLoaded', () => {
    const ghost = document.querySelector('#ghost');
    const mouth = document.querySelector('.ghost__mouth');
    const eyes = document.querySelector('.ghost__eyes');
    
    if (!ghost || !mouth || !eyes) {
        console.error('Ghost elements not found');
        return;
    }

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let position = { x: 0, y: 0 };
    let clicked = false;

    // Make ghost visible and set initial styles
    ghost.style.opacity = '1';
    ghost.style.position = 'fixed';
    ghost.style.zIndex = '9999';
    ghost.style.pointerEvents = 'none';
    ghost.style.mixBlendMode = 'difference';

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', () => clicked = true);
    window.addEventListener('mouseup', () => clicked = false);

    function map(value, in_min, in_max, out_min, out_max) {
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    function update() {
        const distX = mouse.x - position.x;
        const distY = mouse.y - position.y;
        
        position.x += distX / 12; // Slower movement (was 10)
        position.y += distY / 12; // Slower movement (was 10)

        const velX = distX / 10; // Reduced velocity (was 8)
        const velY = distY / 10; // Reduced velocity (was 8)
        
        const skewX = map(velX, 0, 100, 0, -30); // Reduced skew effect (was -50)
        const scaleY = map(velY, 0, 100, 1, 1.5); // Reduced stretching (was 2.0)
        const scaleEyeX = map(Math.abs(velX), 0, 100, 1, 1.1); // Reduced eye animation (was 1.2)
        const scaleEyeY = map(Math.abs(velX * 1.5), 0, 100, 1, 0.2); // Reduced eye animation
        const scaleMouth = Math.min(Math.max(map(Math.abs(velX), 0, 100, 0, 5), map(Math.abs(velY), 0, 100, 0, 3)), 1.5); // Reduced mouth animation
        
        ghost.style.transform = `translate(${position.x}px, ${position.y}px) scale(.5) skew(${skewX}deg) rotate(${-skewX}deg) scaleY(${scaleY})`;
        eyes.style.transform = `translateX(-50%) scale(${scaleEyeX},${clicked ? 0.4 : scaleEyeY})`;
        mouth.style.transform = `translate(${-skewX * 0.5 - 10}px) scale(${clicked ? -scaleMouth : scaleMouth})`;

        requestAnimationFrame(update);
    }

    update();
});