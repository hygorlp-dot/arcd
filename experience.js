(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const animate = (element, frames, options = {}) => {
    if (!element || reduced.matches || !element.animate) return;
    return element.animate(frames, {duration: 450, easing: ease, fill: 'backwards', ...options});
  };
  document.querySelectorAll('.hero-line>span').forEach((line, index) => {
    animate(line, [{transform:'translateY(110%)', opacity:0}, {transform:'translateY(0)',opacity:1}], {delay:80 + index * 70, duration:650});
  });
  animate(document.querySelector('.hero .eyebrow'), [{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], {delay:150});
  animate(document.querySelector('.hero-bottom'), [{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}], {delay:200});
  animate(document.querySelector('.hero-seal'), [{opacity:0,transform:'rotate(-15deg) scale(.85)'},{opacity:1,transform:'rotate(10deg) scale(1)'}], {delay:250,duration:650});

  // Finite, one-time reveals leave the document readable without JavaScript.
  const revealTargets = new Map();
  document.querySelectorAll('section:not(.hero) h2').forEach(el => revealTargets.set(el, 'heading'));
  document.querySelectorAll('.project-image,.about-portrait').forEach(el => revealTargets.set(el, 'media'));
  document.querySelectorAll('.service,.journey li').forEach(el => revealTargets.set(el, 'line'));
  revealTargets.set(document.querySelector('#lead-form'), 'form');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      observer.unobserve(el);
      const kind = revealTargets.get(el);
      if (kind === 'heading') animate(el,[{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:500});
      if (kind === 'media') animate(el,[{opacity:.2,translate:'0 45px',scale:'.96'},{opacity:1,translate:'0 0',scale:'1'}],{duration:600});
      if (kind === 'line') animate(el,[{opacity:.2,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:200});
      if (kind === 'form') animate(el,[{opacity:.4,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:500});
    }
  }, {threshold:.12,rootMargin:'0px 0px -25px 0px'});
  revealTargets.forEach((kind, el) => {if(el) observer.observe(el)});

  const header = document.querySelector('header');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-photo>img');
  const progress = document.querySelector('.page-progress');
  let pending = false;
  let heroHeight = hero.offsetHeight;
  let pageHeight = document.documentElement.scrollHeight - innerHeight;
  const measure = () => {heroHeight=hero.offsetHeight;pageHeight=document.documentElement.scrollHeight-innerHeight;queueUpdate()};
  const update = () => {
    pending=false;
    const y=window.scrollY;
    header.classList.toggle('is-scrolled',y>180);
    progress.style.transform=`scaleX(${Math.min(1,Math.max(0,y/Math.max(1,pageHeight)))})`;
    if (!reduced.matches && innerWidth>700 && y<heroHeight+100) heroImage.style.translate=`0 ${Math.min(y*.12,85)}px`;
    else heroImage.style.translate='0 0';
  };
  function queueUpdate(){if(!pending){pending=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',queueUpdate,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('load',measure,{once:true});
  document.fonts?.ready.then(measure);
  new ResizeObserver(measure).observe(document.querySelector('main'));
  reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(a=>{try{a.finish()}catch{a.cancel()}});queueUpdate()});
  update();

  new IntersectionObserver(entries=>{
    document.querySelector('.floating').classList.toggle('form-visible',entries[0].isIntersecting);
  },{threshold:.15}).observe(document.querySelector('#lead-form'));

  const grid=document.querySelector('.projects');
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    grid.classList.toggle('is-filtered',button.dataset.filter!=='todos');
    grid.querySelectorAll('.project:not([hidden])').forEach((project,index)=>animate(project,[{opacity:.1,translate:'0 18px'},{opacity:1,translate:'0 0'}],{duration:250,delay:index*40}));
    measure();
  }));
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    animate(document.querySelector('#project-dialog'),[{opacity:0,transform:'translateY(25px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:250});
  }));
  document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{
    if(details.open)animate(details.querySelector('p'),[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:200});
  }));
})();
