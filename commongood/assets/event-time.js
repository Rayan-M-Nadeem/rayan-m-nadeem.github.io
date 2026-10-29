// Calendar dates in Easton, shared by server rendering and browser updates.
export const EASTON_TIME_ZONE='America/New_York';
const formats=new Map();
function parts(value,zone){
 let format=formats.get(zone);
 if(!format){format=new Intl.DateTimeFormat('en-CA',{timeZone:zone,calendar:'gregory',numberingSystem:'latn',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});formats.set(zone,format);}
 return Object.fromEntries(format.formatToParts(new Date(value)).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
}
function civilDay(value,zone){const p=parts(value,zone);return Date.UTC(p.year,p.month-1,p.day)/86400000;}
export function eventCountdown(event,now=Date.now()){
 const start=Date.parse(event?.startAt),end=Date.parse(event?.endAt||event?.startAt);
 if(event?.archived_at||!Number.isFinite(start)||!Number.isFinite(end)||!Number.isFinite(now))return {phase:'none',days:null,message:'New event details will be posted when confirmed.',showCountdown:false};
 if(now>=end)return {phase:'past',days:0,message:'This celebration has ended. New dates will be posted when confirmed.',showCountdown:false};
 if(now>=start)return {phase:'ongoing',days:0,message:'The celebration is happening now. See the seating details before you visit.',showCountdown:false};
 const days=Math.max(0,civilDay(start,EASTON_TIME_ZONE)-civilDay(now,EASTON_TIME_ZONE));
 return {phase:'upcoming',days,message:days?`${days} day${days===1?'':'s'} until we gather`:'Today — the celebration is coming up.',showCountdown:days>0};
}
export function zonedDateInput(value,zone=EASTON_TIME_ZONE){
 if(!value)return '';const p=parts(Date.parse(value),zone),pad=v=>String(v).padStart(2,'0');
 return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}
// Resolve a wall-clock input without depending on the editor's device zone.
// Reject missing/repeated DST times rather than silently changing the hour.
export function zonedInputToISO(value,zone=EASTON_TIME_ZONE){
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value||''))throw new Error('Choose a valid date and time.');
 const [y,m,d,h,min]=value.match(/\d+/g).map(Number),wall=Date.UTC(y,m-1,d,h,min);
 if(new Date(wall).toISOString().slice(0,16)!==value)throw new Error('Choose a valid date and time.');
 const offsets=new Set([-36,-12,0,12,36].map(hours=>{const instant=wall+hours*3600000,p=parts(instant,zone);return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-instant;}));
 const candidates=[...offsets].map(offset=>wall-offset).filter(instant=>zonedDateInput(new Date(instant).toISOString(),zone)===value);
 if(!candidates.length)throw new Error('That local time does not exist because the clocks move forward. Choose another time.');
 if(candidates.length>1)throw new Error('That local time occurs twice when the clocks move back. Choose a time outside the repeated hour.');
 return new Date(candidates[0]).toISOString();
}
