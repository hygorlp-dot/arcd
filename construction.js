(() => {
  const section=document.querySelector('#construcao');
  const frames=section.querySelectorAll('.construction-frame');
  const steps=section.querySelectorAll('[data-build-stage]');
  const play=section.querySelector('.build-play');
  const slider=section.querySelector('#build-stage');
  const description=section.querySelector('.build-description');
  const visual=section.querySelector('.build-visual');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const titles=['Fundação','Estrutura','Fechamento','Acabamento'];
  const descriptions=[
    'A fundação transmite ao terreno as cargas da construção.',
    'Pilares, vigas e lajes dão forma aos volumes e sustentam os ambientes.',
    'Paredes e vedações delimitam os ambientes previstos no projeto.',
    'Revestimentos e demais acabamentos dão aos ambientes a aparência prevista no projeto.'
  ];
  let stage=0,playing=!reduced.matches,visible=false,timer=null;
  const update=next=>{
    stage=next;
    frames.forEach((f,i)=>f.classList.toggle('is-active',i===stage));
    steps.forEach((s,i)=>s.setAttribute('aria-pressed',String(i===stage)));
    slider.value=stage;
    slider.setAttribute('aria-valuetext',titles[stage]);
    visual.setAttribute('aria-label',`Visualização ilustrativa de uma residência na etapa de ${titles[stage].toLowerCase()}`);
    description.textContent=descriptions[stage];
  };
  const stopTimer=()=>{clearTimeout(timer);timer=null};
  const schedule=()=>{
    stopTimer();
    if(playing&&visible&&!document.hidden) timer=setTimeout(()=>{update((stage+1)%4);schedule()},4500);
  };
  const setPlaying=value=>{
    playing=value;
    play.setAttribute('aria-pressed',String(playing));
    play.querySelector('span').textContent=playing?'Pausar animação':'Reproduzir animação';
    play.querySelector('svg').innerHTML=playing?'<path d="M5 3v14M13 3v14"/>':'<path d="m5 3 10 7-10 7Z"/>';
    schedule();
  };
  play.addEventListener('click',()=>setPlaying(!playing));
  steps.forEach(button=>button.addEventListener('click',()=>{setPlaying(false);update(Number(button.dataset.buildStage))}));
  slider.addEventListener('input',()=>{setPlaying(false);update(Number(slider.value))});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{if(reduced.matches)setPlaying(false)});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;document.querySelector('.floating').classList.toggle('build-visible',visible);schedule()},{threshold:.3}).observe(section.querySelector('.build-experience'));
  update(0);setPlaying(playing);
})();
