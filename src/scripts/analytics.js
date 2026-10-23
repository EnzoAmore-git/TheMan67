// Existing production counter. Never load analytics on localhost or GitHub previews.
export function initAnalytics(){
  if(!['theman67.ru','www.theman67.ru'].includes(location.hostname))return;
  try {
    window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments);};
    window.ym.l=Date.now();
    const script=document.createElement('script');script.async=true;script.src='https://mc.yandex.ru/metrika/tag.js?id=109624419';document.head.append(script);
    window.ym(109624419,'init',{webvisor:true,clickmap:true,ecommerce:'dataLayer',accurateTrackBounce:true,trackLinks:true});
  }catch{/* Booking must remain usable when analytics are blocked. */}
}
