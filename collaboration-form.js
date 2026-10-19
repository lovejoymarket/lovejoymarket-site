(function(root){
  'use strict';
  const shared={name:'Name',business:'Business / creative name',email:'Email',phone:'Phone',links:'Website / portfolio / social links',role:'Role',pitch:'The idea',budget:'Budget / proposed compensation',notes:'Other notes'};
  const branches={event:{event_name:'Event name',event_type:'Event type',event_timing:'Proposed date / timing',event_location:'Venue and city',event_attendance:'Estimated attendance',event_role:'LoveJoy’s role',event_experience:'Guest experience',event_logistics:'Setup / accessibility / fees / logistics'},project:{project_name:'Project title',project_type:'Project type',project_timing:'Timeline / deadline',project_location:'Location / remote',project_role:'LoveJoy’s contribution',project_deliverables:'Expected deliverables',project_usage:'Usage and credits',project_team:'Team / references'}};
  function selectedTypes(values){return ['event','project'].filter(type=>values.includes(type));}
  function buildInquiry(formData){
    const types=selectedTypes(formData.getAll('collaboration_type'));
    if(!types.length)throw new Error('Choose Event, Project, or both.');
    const title=types.map(type=>type[0].toUpperCase()+type.slice(1)).join(' + ');
    const lines=[`LoveJoy ${title} Collaboration Inquiry`,''];
    const add=fields=>Object.entries(fields).forEach(([key,label])=>{const value=String(formData.get(key)||'').trim();if(value)lines.push(`${label}: ${value}`,'');});
    add(shared);
    types.forEach(type=>{lines.push(`=== ${type.toUpperCase()} ===`,'');add(branches[type]);});
    lines.push('I understand this is an inquiry. A date or project is confirmed only after we agree on the details.');
    return {types,subject:`${title} collaboration inquiry: ${String(formData.get('name')||'').trim()}`,body:lines.join('\n')};
  }
  root.LoveJoyCollaboration={selectedTypes,buildInquiry};
  if(typeof document==='undefined')return;
  document.querySelectorAll('[data-collaboration-form]').forEach(form=>{
    const checks=[...form.querySelectorAll('[name="collaboration_type"]')];
    const error=form.querySelector('[data-type-error]'),status=form.querySelector('[data-collab-status]');
    function sync(){
      const types=checks.filter(check=>check.checked).map(check=>check.value);
      checks[0].setCustomValidity(types.length?'':'Choose Event, Project, or both.');
      checks.forEach(check=>check.setAttribute('aria-expanded',String(check.checked)));
      form.querySelectorAll('[data-collab-branch]').forEach(section=>{section.hidden=section.disabled=!types.includes(section.dataset.collabBranch);});
      error.hidden=types.length>0;return types;
    }
    checks.forEach(check=>check.addEventListener('change',sync));
    const presets=new URLSearchParams(location.search).getAll('type').flatMap(value=>value.split(','));
    checks.forEach(check=>{check.checked=presets.includes(check.value);});sync();error.hidden=true;
    form.addEventListener('invalid',()=>{if(!checks.some(check=>check.checked))error.hidden=false;},true);
    function prepare(){sync();if(!form.reportValidity())return null;return buildInquiry(new FormData(form));}
    form.addEventListener('submit',event=>{
      event.preventDefault();const inquiry=prepare();if(!inquiry)return;
      location.href=`mailto:hello@lovejoymarket.co?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(inquiry.body)}`;
      status.textContent='Your email app should open with a draft. Review it, attach any samples, and press Send. If it doesn’t open, use “copy inquiry” below.';
    });
    form.querySelector('[data-collab-copy]').addEventListener('click',async()=>{
      const inquiry=prepare();if(!inquiry)return;
      const text=`To: hello@lovejoymarket.co\nSubject: ${inquiry.subject}\n\n${inquiry.body}`;
      try{await navigator.clipboard.writeText(text);status.textContent='Inquiry copied. Paste it into an email to hello@lovejoymarket.co, attach any samples, and send.';}
      catch{const fallback=form.querySelector('[data-copy-fallback]');fallback.hidden=false;const area=fallback.querySelector('textarea');area.value=text;area.focus();area.select();status.textContent='Select and copy the inquiry below, then email it to hello@lovejoymarket.co.';}
    });
  });
})(globalThis);
