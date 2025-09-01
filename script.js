/* Shared JS for typewriter, particles, and skills animation */

/* Typewriter: cycles phrases in an element */
function typewriter(el, texts, speed=60, pause=1200){
  if(!el) return;
  let i=0, j=0, deleting=false;
  const tick = ()=>{
    el.textContent = texts[i].slice(0,j);
    if(!deleting && j < texts[i].length) j++;
    else if(deleting && j > 0) j--;
    else{
      if(!deleting){ deleting = true; setTimeout(tick, pause); return; }
      deleting = false; i = (i+1) % texts.length;
    }
    setTimeout(tick, deleting?30:speed);
  };
  tick();
}

/* Particles network (lightweight) */
function initParticles(canvas){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let w=0,h=0;
  const N = 60;
  const dots = Array.from({length:N}, ()=>({x:Math.random(), y:Math.random(), vx:(Math.random()-0.5)*0.0015, vy:(Math.random()-0.5)*0.0015}));
  function resize(){
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<N;i++){
      const a = dots[i];
      a.x += a.vx * (w/500);
      a.y += a.vy * (h/500);
      if(a.x < 0 || a.x > 1) a.vx *= -1;
      if(a.y < 0 || a.y > 1) a.vy *= -1;
      // draw point
      ctx.beginPath();
      ctx.fillStyle = "#6d28d9";
      ctx.arc(a.x*w, a.y*h, 2.2, 0, Math.PI*2);
      ctx.fill();
      // connections
      for(let j=i+1;j<N;j++){
        const b = dots[j];
        const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
        const dist = Math.hypot(dx,dy);
        if(dist < 140){
          ctx.beginPath();
          ctx.strokeStyle = "rgba(6,182,212," + Math.max(0, 1 - dist/140) + ")";
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x*w, a.y*h);
          ctx.lineTo(b.x*w, b.y*h);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  resize(); step();
  window.addEventListener('resize', resize);
}

/* Animate skill circles from 0 -> data-value */
function animateCircles(){
  document.querySelectorAll('.circle').forEach(c=>{
    const v = +c.dataset.value || 70;
    let cur = 0;
    const step = ()=>{
      cur++;
      c.style.setProperty('--val', cur);
      const num = c.querySelector('.num');
      if(num) num.textContent = cur + '%';
      if(cur < v) requestAnimationFrame(step);
    };
    step();
  });
}

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', ()=>{
  const el = document.querySelector('[data-typer]');
  if(el) typewriter(el, ["AI Enthusiast", "Front-End Developer", "Data Science Learner"], 65, 1500);
  const canvas = document.querySelector('.hero-canvas');
  if(canvas) initParticles(canvas);
  animateCircles();
});
