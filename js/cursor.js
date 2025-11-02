document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursor.className = 'cursor-dot';
    cursorOutline.className = 'cursor-dot-outline';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);

    function moveCursor(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
        
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }

    document.addEventListener('mousemove', moveCursor);

    // Add hover effect
    const hoverElements = document.querySelectorAll('a, button, .project-card, .item');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
        });
    });
});