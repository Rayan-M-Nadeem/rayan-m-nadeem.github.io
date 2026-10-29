// Shared behavior, site-specific presentation. All data is an ordinary versioned page field.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function readSlideshow(value){try{const v=typeof value==='string'?JSON.parse(value):value;return {enabled:v?.enabled===true,autoplay:v?.autoplay===true,interval:Number(v?.interval)||5,slides:Array.isArray(v?.slides)?v.slides:[]};}catch{return {enabled:false,autoplay:false,interval:5,slides:[]};}}
export function validateSlideshow(value,allowed){
 if(!value)return '';
 let v;try{v=JSON.parse(value);}catch{throw new Error('The slideshow could not be read.');}
 if(!v||typeof v!=='object'||Array.isArray(v)||typeof v.enabled!=='boolean'||typeof v.autoplay!=='boolean'||!Number.isInteger(v.interval)||v.interval<5||v.interval>60||!Array.isArray(v.slides)||v.slides.length>20)throw new Error('Choose a 5-60 second interval and up to 20 slides.');
 const slides=v.slides.map(p=>{if(!p||typeof p.src!=='string'||!(/^\/media\/[a-zA-Z0-9-]+$/.test(p.src)||allowed.has(p.src)))throw new Error('Choose a slide from this organization’s photo library.');
 for(const [k,max] of [['alt',500],['caption',500],['credit',500],['source',1000]])if(typeof(p[k]??'')!=='string'||String(p[k]??'').length>max)throw new Error('Slide descriptions or credits are too long.');
 if(!p.alt?.trim())throw new Error('Add a description for every slide.');if(p.source&&!/^https:\/\/[^\s]+$/.test(p.source))throw new Error('Use an https:// photo source address.');
 return {src:p.src,alt:p.alt,caption:p.caption||'',credit:p.credit||'',source:p.source||''};});
 return JSON.stringify({enabled:v.enabled,autoplay:v.autoplay,interval:v.interval,slides});
}
export function renderSlideshow(value,{theme='',editing=false,title='From our photo collection',priority=false}={}){
 const v=readSlideshow(value);if(!v.enabled||!v.slides.length)return editing?'<p class="ss-editor-note"><button type="button" data-action="slideshow-settings">Set up a photo slideshow</button></p>':'';
 const slides=v.slides.filter(p=>/^\/(?!\/)/.test(p.src));if(!slides.length)return '';
 return `<section class="cg-slideshow ss-${esc(theme)}" data-slideshow data-interval="${v.interval*1000}" data-autoplay="${v.autoplay}" role="region" aria-roledescription="carousel" aria-label="${esc(title)}"><header><h2>${esc(title)}</h2>${editing?'<button type="button" data-action="slideshow-settings">Edit slideshow</button>':''}</header><div class="ss-stage">${slides.map((p,i)=>`<figure data-slide role="group" aria-roledescription="slide" aria-label="${i+1} of ${slides.length}"${i?' hidden':''}><div class="ss-image"><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="1200" height="900" ${i?'loading="lazy"':priority?'fetchpriority="high"':'loading="lazy"'} decoding="async"><p class="ss-image-error" hidden>Photograph unavailable. Use the controls to see another image.</p></div><figcaption>${esc(p.caption||p.alt)}${p.credit?` <small>${esc(p.credit)}</small>`:''}${p.source?` <a href="${esc(p.source)}">Photo source</a>`:''}</figcaption></figure>`).join('')}</div><div class="ss-controls" hidden><button type="button" data-ss="previous" aria-label="Previous image">Previous</button><span data-ss-position>1 / ${slides.length}</span><button type="button" data-ss="next" aria-label="Next image">Next</button><button type="button" data-ss="toggle" aria-label="${v.autoplay?'Pause slideshow':'Resume slideshow'}">${v.autoplay?'Pause':'Resume'}</button></div><p data-ss-announcement class="ss-sr" role="status" aria-live="polite"></p><noscript><p>First photograph shown. Automatic slideshow requires JavaScript.</p></noscript></section>`;
}
export function mountSlideshows(root=document){
 root.querySelectorAll('[data-slideshow]').forEach(el=>{
 if(el.dataset.mounted)return;el.dataset.mounted='true';
 const doc=el.ownerDocument,win=doc.defaultView,motion=win.matchMedia('(prefers-reduced-motion: reduce)'),slides=[...el.querySelectorAll('[data-slide]')],controls=el.querySelector('.ss-controls'),toggle=el.querySelector('[data-ss=toggle]'),position=el.querySelector('[data-ss-position]'),announce=el.querySelector('[data-ss-announcement]');
 let index=0,paused=el.dataset.autoplay!=='true',hover=false,focus=false,timer;
 controls.hidden=slides.length<2;
 const canPlay=()=>!paused&&!hover&&!focus&&!motion.matches&&!doc.hidden&&slides.length>1;
 const update=()=>{win.clearTimeout(timer);toggle.textContent=motion.matches?'Autoplay off':paused?'Resume':'Pause';toggle.setAttribute('aria-label',motion.matches?'Autoplay off for reduced motion':paused?'Resume slideshow':'Pause slideshow');toggle.disabled=motion.matches;el.dataset.playing=String(canPlay());el.dataset.paused=String(paused);if(canPlay())timer=win.setTimeout(()=>{if(!el.isConnected)return;show(index+1,false);},Number(el.dataset.interval));};
 const show=(next,manual)=>{if(manual)paused=true;index=(next+slides.length)%slides.length;slides.forEach((s,i)=>{s.hidden=i!==index;});position.textContent=`${index+1} / ${slides.length}`;if(manual)announce.textContent=`Image ${index+1} of ${slides.length}: ${slides[index].querySelector('img').alt}`;update();};
 controls.addEventListener('click',e=>{const b=e.target.closest('[data-ss]');if(!b)return;const action=b.dataset.ss;if(action==='toggle'){paused=!paused;announce.textContent=paused?'Slideshow paused.':'Slideshow will resume after focus leaves the controls.';update();}else show(index+(action==='next'?1:-1),true);});
 el.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)&&e.target.closest('.ss-controls')){e.preventDefault();show(e.key==='Home'?0:e.key==='End'?slides.length-1:index+(e.key==='ArrowRight'?1:-1),true);}});
 el.addEventListener('mouseenter',()=>{hover=true;update();});el.addEventListener('mouseleave',()=>{hover=false;update();});
 el.addEventListener('focusin',()=>{focus=true;update();});el.addEventListener('focusout',()=>{win.setTimeout(()=>{focus=el.contains(doc.activeElement);update();},0);});
 const visibility=()=>{if(!el.isConnected){doc.removeEventListener('visibilitychange',visibility);return;}update();};doc.addEventListener('visibilitychange',visibility);motion.addEventListener?.('change',update);
 slides.forEach(s=>{const img=s.querySelector('img'),fail=()=>{img.hidden=true;s.querySelector('.ss-image-error').hidden=false;};img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail();});
 show(0,false);
 });
}
