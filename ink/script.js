const slider = document.querySelector('.slider');

// Ensure smooth continuous looping with four tiles
if (slider) {
  const items = slider.querySelectorAll('.item');
  const quantity = items.length;
  
  // Update slider animation for continuous loop
  setInterval(() => {
    items.forEach(item => {
      let position = parseInt(item.style.getPropertyValue('--position'));
      position = position >= quantity ? 1 : position + 1;
      item.style.setProperty('--position', position);
    });
  }, 3000); // Change slide every 3 seconds
}
let rotationY = 0;
let isDragging = false, startX;

// Drag-to-rotate
slider.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX;
  slider.style.animationPlayState = 'paused';
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  let delta = e.clientX - startX;
  rotationY += delta * 0.5;
  slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${rotationY}deg)`;
  startX = e.clientX;
});

window.addEventListener('mouseup', e => {
  isDragging = false;
  slider.style.animationPlayState = 'running';
});

// Click per item to go next page
document.querySelectorAll('.slider .item').forEach((item, idx) => {
  item.addEventListener('click', () => {
    window.location.href = `case-study-${idx+1}.html`;
  });
});

// Optional: Model head follow mouse
const model = document.querySelector('.model');
window.addEventListener('mousemove', e => {
  let x = (e.clientX / window.innerWidth - 0.5) * 30; // rotate Y
  let y = (e.clientY / window.innerHeight - 0.5) * 15; // rotate X
  model.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
});

// Navigation buttons
document.getElementById('next').addEventListener('click', () => {
  rotationY -= 36; // 360/10
  slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${rotationY}deg)`;
});
document.getElementById('prev').addEventListener('click', () => {
  rotationY += 36;
  slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${rotationY}deg)`;
});
