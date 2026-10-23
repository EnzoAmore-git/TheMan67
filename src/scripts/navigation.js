export function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function close(restore = false) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.textContent='Меню'; if(restore)toggle.focus(); }
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Закрыть':'Меню';});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open'))close(true);});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close();});
  const desktop=matchMedia('(min-width:701px)');desktop.addEventListener('change',()=>close());
  document.documentElement.classList.add('js');
}
