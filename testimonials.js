// Load the official Instagram player only after the visitor requests it.
let instagramScript;
function loadInstagram(){
  if(window.instgrm?.Embeds)return Promise.resolve();
  if(instagramScript)return instagramScript;
  instagramScript=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://www.instagram.com/embed.js';script.async=true;
    script.onload=resolve;script.onerror=()=>{script.remove();instagramScript=null;reject(new Error('Instagram unavailable'));};
    document.body.append(script);
  });
  return instagramScript;
}
document.querySelectorAll('.load-testimonial').forEach(button=>button.addEventListener('click',async()=>{
  const player=button.closest('.instagram-player'),mount=player.querySelector('.instagram-mount'),notice=player.querySelector('.video-notice');
  button.disabled=true;button.textContent='Carregando vídeo…';
  const embed=document.createElement('blockquote');embed.className='instagram-media';
  embed.dataset.instgrmPermalink=player.dataset.instagramPost;embed.dataset.instgrmVersion='14';
  const link=document.createElement('a');link.href=player.dataset.instagramPost;link.textContent='Ver depoimento no Instagram';link.target='_blank';link.rel='noopener noreferrer';embed.append(link);mount.replaceChildren(embed);
  try{await loadInstagram();if(!window.instgrm?.Embeds)throw new Error('Player unavailable');window.instgrm.Embeds.process();button.hidden=true;notice.textContent='Use o botão de reprodução do vídeo. Se o Instagram não carregar, abra a publicação pelo link abaixo.';}
  catch{mount.replaceChildren();button.disabled=false;button.textContent='Tentar carregar novamente';notice.textContent='Não foi possível carregar o Instagram. Você pode abrir o vídeo pelo link abaixo.';}
}));
