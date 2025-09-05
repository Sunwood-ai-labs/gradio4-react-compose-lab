// Progressive enhancement – keep HTML-first UI functional, add small helpers

(function(){
  function bindDownload(inputId, linkId){
    const inp = document.getElementById(inputId);
    const a = document.getElementById(linkId);
    if(!inp || !a) return;
    function sync(){
      const v = inp.value.trim();
      if(v){ a.setAttribute('href', v); a.removeAttribute('aria-disabled'); }
      else{ a.removeAttribute('href'); a.setAttribute('aria-disabled','true'); }
    }
    inp.addEventListener('input', sync);
    sync();
  }

  // Wire download helpers
  bindDownload('dl-text-url', 'dl-text-btn');
  bindDownload('dl-vision-url', 'dl-vision-btn');
  bindDownload('dl-audio-url', 'dl-audio-btn');
  bindDownload('dl-tools-url', 'dl-tools-btn');

  // Optional: intercept Text JSON form to post JSON and preview in iframe
  const textForm = document.getElementById('form-text');
  if(textForm){
    textForm.addEventListener('submit', async (e)=>{
      // Leave default iframes submission as-is if fetch fails
      e.preventDefault();
      const action = textForm.getAttribute('action');
      const ta = textForm.querySelector('textarea[name="data"]');
      const iframe = document.querySelector('iframe[name="viewer-text"]');
      const body = ta?.value || '{}';
      try{
        const res = await fetch(action, {method:'POST', headers:{'Content-Type':'application/json'}, body});
        const text = await res.text();
        if(iframe){
          iframe.srcdoc = `<pre style="white-space:pre-wrap;word-break:break-word;color:#e9ebef;background:#0e1117;margin:0;padding:12px">${
            text.replace(/[&<>]/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[s]))
          }</pre>`;
        }
      }catch(err){
        // Fallback to default submission
        textForm.removeEventListener('submit', arguments.callee);
        textForm.submit();
      }
    });
  }
})();

