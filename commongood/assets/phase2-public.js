import './public.js?v=creative-3';
const updateEvents=()=>{const now=Date.now();document.querySelectorAll('[data-p2-event]').forEach(event=>{const start=Date.parse(event.dataset.eventStart),end=Date.parse(event.dataset.eventEnd),label=event.querySelector('[data-p2-event-status]');if(label)label.textContent=now>=end?'Past event':now>=start?'Happening now':'Upcoming event';});};
updateEvents();if(document.querySelector('[data-p2-event]'))setInterval(updateEvents,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateEvents();});addEventListener('pageshow',updateEvents);

document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.p2-menu[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary')?.focus();});});
