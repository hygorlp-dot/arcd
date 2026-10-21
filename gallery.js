(() => {
  const track=document.querySelector('#project-gallery');
  const previous=document.querySelector('#gallery-previous');
  const next=document.querySelector('#gallery-next');
  const controls=document.querySelector('.gallery-nav');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const cards=()=>Array.from(track.querySelectorAll('.project:not([hidden])'));
  const position=card=>card.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
  const closest=()=>{
    const items=cards();
    return items.reduce((best,card,index)=>Math.abs(position(card)-track.scrollLeft)<Math.abs(position(items[best])-track.scrollLeft)?index:best,0);
  };
  const update=()=>{
    const max=track.scrollWidth-track.clientWidth;
    previous.disabled=track.scrollLeft<=3;
    next.disabled=track.scrollLeft>=max-3;
    controls.hidden=max<=3;
  };
  const go=direction=>{
    const items=cards();
    const index=Math.min(items.length-1,Math.max(0,closest()+direction));
    track.scrollTo({left:position(items[index]),behavior:reduced.matches?'instant':'smooth'});
  };
  previous.addEventListener('click',()=>go(-1));
  next.addEventListener('click',()=>go(1));
  track.addEventListener('keydown',event=>{
    if(event.target!==track)return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(event.key==='ArrowRight'?1:-1)}
    if(event.key==='Home'||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'})}
  });
  track.addEventListener('scroll',update,{passive:true});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    track.scrollTo({left:0,behavior:'instant'});
    requestAnimationFrame(update);
  }));
  // Touch remains native. Mouse dragging does not open a project on release.
  let start=null,dragged=false;
  track.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0)return;
    start={x:event.clientX,left:track.scrollLeft,id:event.pointerId};dragged=false;
  });
  track.addEventListener('pointermove',event=>{
    if(!start)return;
    const distance=event.clientX-start.x;
    if(!dragged&&Math.abs(distance)<7)return;
    if(!dragged){dragged=true;track.classList.add('is-dragging');track.setPointerCapture(start.id)}
    event.preventDefault();track.scrollLeft=start.left-distance;
  });
  const endDrag=()=>{
    if(!start)return;
    const id=start.id;start=null;
    if(track.hasPointerCapture(id))track.releasePointerCapture(id);
    track.classList.remove('is-dragging');
    if(dragged){const items=cards();track.scrollTo({left:position(items[closest()]),behavior:reduced.matches?'instant':'smooth'});setTimeout(()=>dragged=false,0)}
  };
  track.addEventListener('pointerup',endDrag);
  track.addEventListener('pointercancel',endDrag);
  track.addEventListener('pointerleave',()=>{if(start&&!dragged)start=null});
  track.addEventListener('click',event=>{if(dragged){event.preventDefault();event.stopImmediatePropagation()}},true);
  new ResizeObserver(update).observe(track);
  update();
})();
