import {mountSlideshows} from './slideshow.js?v=creative-3';
import {eventCountdown} from './event-time.js?v=final-qa-1';
// Progressive enhancement only. Public pages are already rendered by the server.
// No account request, administrative imports, or second content download.
const all=(selector,root=document)=>[...root.querySelectorAll(selector)];
const pageSearch=document.querySelector('#eacc-page-search');
let filterPages;
if(pageSearch){filterPages=()=>{const query=pageSearch.value.toLocaleLowerCase().trim();let count=0;all('[data-page-name]').forEach(item=>{item.hidden=!item.dataset.pageName.includes(query);if(!item.hidden)count++;});const empty=document.querySelector('#eacc-search-empty');if(empty)empty.hidden=count>0||(empty.dataset?.requiresQuery==='yes'&&!query);const status=document.querySelector('#page-search-status');if(status)status.textContent=`${count} matching page${count===1?'':'s'}`;};pageSearch.addEventListener('input',filterPages);if(document.querySelector('#eacc-search-empty')?.dataset?.requiresQuery==='yes')filterPages();}

const photoSearch=document.querySelector('#hope-photo-search'),category=document.querySelector('#hope-photo-category');
if(photoSearch&&category){const filter=()=>{const query=photoSearch.value.toLocaleLowerCase().trim(),group=category.value;let count=0;all('[data-hope-photo]').forEach(item=>{item.hidden=!item.dataset.hopePhoto.includes(query)||(group&&item.dataset.category!==group);if(!item.hidden)count++;});document.querySelector('#hope-gallery-count').textContent=count?`${count} photograph${count===1?'':'s'}`:'No photographs match. Try another search or collection.';};photoSearch.addEventListener('input',filter);category.addEventListener('change',filter);}
const tick=()=>{
 const now=Date.now();
 all('[data-countdown-to]').forEach(item=>{const state=eventCountdown({startAt:item.dataset.countdownTo},now);item.hidden=!state.showCountdown;if(state.showCountdown&&item.textContent!==state.message)item.textContent=state.message;item.removeAttribute?.('aria-busy');});
 all('[data-hope-event-panel]').forEach(panel=>{
  const state=eventCountdown({startAt:panel.dataset.eventStart,endAt:panel.dataset.eventEnd},now),label=panel.querySelector('[data-event-label]'),status=panel.querySelector('[data-event-status]'),countdown=panel.querySelector('[data-countdown-to]');
  if(label)label.textContent=state.phase==='upcoming'?'Our next gathering':state.phase==='ongoing'?'Happening today':state.phase==='past'?'Past celebration':'Event details';
  if(status){status.hidden=state.showCountdown&&!!countdown;const message=state.phase==='upcoming'&&state.days>0?'See the attendance details for seating times and directions.':state.message;if(status.textContent!==message)status.textContent=message;}
 });
 all('[data-hope-event-card]').forEach(card=>{
  const state=eventCountdown({startAt:card.dataset.eventStart,endAt:card.dataset.eventEnd},now),label=card.querySelector('[data-event-label]'),group=document.querySelector(`[data-event-group="${state.phase}"]`);
  if(label)label.textContent=state.phase==='upcoming'?'Upcoming celebration':state.phase==='ongoing'?'Happening now':'Past celebration';
  if(group&&card.parentElement!==group)group.append(card);
 });
 all('[data-event-group]').forEach(group=>{const empty=!group.querySelector('[data-hope-event-card]');group.hidden=empty;const archive=group.closest('details');if(archive)archive.hidden=empty;});
};
tick();if(document.querySelector('[data-countdown-to], [data-hope-event-panel], [data-hope-event-card]'))setInterval(tick,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
// A restored page may carry yesterday's DOM even though HTTP HTML is no-store.
globalThis.addEventListener?.('pageshow',()=>{tick();if(document.querySelector('#eacc-search-empty')?.dataset?.requiresQuery==='yes')filterPages?.();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){all('.site-mobile-menu[open],.hope-mobile-nav[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus();});}});
// Reserve the real ratio for uploaded photos where old records lack dimensions.
all('img:not([width])').forEach(img=>{const measure=()=>{if(img.naturalWidth&&img.naturalHeight){img.width=img.naturalWidth;img.height=img.naturalHeight;}};if(img.complete)measure();else img.addEventListener('load',measure,{once:true});});

mountSlideshows();
