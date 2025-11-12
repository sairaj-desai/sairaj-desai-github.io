// Project list video playback on hover
document.addEventListener('DOMContentLoaded', function() {
  const projectItems = document.querySelectorAll('.project-item');
  const axis = document.querySelector('.projects-axis');
  const indicator = document.querySelector('.projects-indicator');
  const list = document.querySelector('.projects-list');
  
  projectItems.forEach(item => {
    const video = item.querySelector('.project-video');
    
    item.addEventListener('mouseenter', () => {
      if (video) {
        video.play();
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
        // Optional: reset video to beginning
        // video.currentTime = 0;
      }
    });
  });

  // Scroll-following slime indicator
  if (axis && indicator && list && projectItems.length) {
    let targetY = 0;
    let currentY = 0;
    let velocity = 0;

    function updateTarget() {
      const viewportCenter = window.innerHeight / 2;
      let closestItem = null;
      let closestDist = Infinity;
      projectItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestItem = item;
        }
      });
      if (closestItem) {
        const axisRect = axis.getBoundingClientRect();
        const itemRect = closestItem.getBoundingClientRect();
        targetY = (itemRect.top + itemRect.height / 2) - axisRect.top;
      }
    }

    function animate() {
      // Spring-damped interpolation to follow target naturally
      const delta = targetY - currentY;
      const spring = 0.18;  // responsiveness
      const damping = 0.82; // smoothness
      velocity = (velocity + delta * spring) * damping;
      currentY += velocity;

      // Stretch based on velocity for organic feel
      const stretch = 1 + Math.min(Math.abs(velocity) / 120, 0.25);
      indicator.style.transform = `translate3d(0, ${currentY}px, 0) scaleY(${stretch})`;

      requestAnimationFrame(animate);
    }

    // Initial positioning and event hooks
    updateTarget();
    animate();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', () => {
      updateTarget();
    });
  }
  
  // Reusable marquee + lens system
  function initMarqueeGraphic(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const track = container.querySelector('.marquee-track');
    if (!track) return;
    const imgs = Array.from(track.querySelectorAll('img'));
    if (imgs.length < 1) return;

    let offset = 0;
    let baseSpeed = 60; // px per second
    let targetSpeed = baseSpeed;
    let currentSpeed = baseSpeed;
    let lastTs = performance.now();

    // Measure widths after images load
    function totalWidth() {
      return imgs.reduce((sum, img) => sum + img.getBoundingClientRect().width, 0);
    }

    function animate(ts) {
      const dt = Math.min(0.033, (ts - lastTs) / 1000); // clamp dt
      lastTs = ts;
      currentSpeed += (targetSpeed - currentSpeed) * 0.12; // ease speed
      offset -= currentSpeed * dt;

      const tw = totalWidth();
      if (tw > 0) {
        // wrap seamlessly
        if (offset <= -tw / 2) {
          offset += tw / 2;
        }
        track.style.transform = `translate3d(${offset}px, -50%, 0)`;
        // subtle motion blur on higher speed
        const blur = Math.min(Math.max((currentSpeed - baseSpeed) / 140, 0), 0.6);
        track.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Lens
    let lens = null;
    let lensTrack = null;
    const lensScale = 1.15;
    const lensRadius = () => (container.querySelector('.marquee-lens')?.offsetWidth || 140) / 2;

    function ensureLens() {
      if (lens) return;
      lens = document.createElement('div');
      lens.className = 'marquee-lens';
      lensTrack = document.createElement('div');
      lensTrack.className = 'lens-track';
      // clone images inside lens
      imgs.forEach(img => {
        const clone = img.cloneNode(true);
        lensTrack.appendChild(clone);
      });
      lens.appendChild(lensTrack);
      container.appendChild(lens);
    }

    function positionLens(e) {
      if (!lens || !lensTrack) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lens.style.left = `${x - lensRadius()}px`;
      lens.style.top = `${y - lensRadius()}px`;
      // Align lens track with main track offset, then magnify
      lensTrack.style.transform = `translate3d(${offset}px, -50%, 0) scale(${lensScale})`;
      lensTrack.style.transformOrigin = `${x}px ${y}px`;
    }

    container.addEventListener('mouseenter', () => {
      ensureLens();
      targetSpeed = baseSpeed * 1.35; // speed up slightly on hover
    });
    container.addEventListener('mousemove', positionLens);
    container.addEventListener('mouseleave', () => {
      targetSpeed = baseSpeed;
      if (lens) {
        lens.remove();
        lens = null;
        lensTrack = null;
      }
    });

    // Adjust on resize
    window.addEventListener('resize', () => {
      // Recenter track vertically
      track.style.transform = `translate3d(${offset}px, -50%, 0)`;
    });
  }

  initMarqueeGraphic('.projects-graphic');
  initMarqueeGraphic('.connect-graphic');
});