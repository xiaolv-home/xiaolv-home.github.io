(() => {
  'use strict';
  const $=(s)=>document.querySelector(s);const $$=(s)=>[...document.querySelectorAll(s)];
  let paused=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const motionToggle=$('#motion-toggle');
  function applyMotion(){document.documentElement.classList.toggle('motion-off',paused);motionToggle.textContent=paused?'开启动效':'暂停动效';motionToggle.setAttribute('aria-pressed',String(paused));document.dispatchEvent(new CustomEvent('portfolio:motion',{detail:{paused}}));$('#lineage-frame').contentWindow?.postMessage({type:'portfolio:motion',paused},location.origin)}
  applyMotion();motionToggle.addEventListener('click',()=>{paused=!paused;applyMotion()});matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',e=>{paused=e.matches;applyMotion()});$('#lineage-frame').addEventListener('load',applyMotion);
  let progressFrame;addEventListener('scroll',()=>{if(progressFrame)return;progressFrame=requestAnimationFrame(()=>{const range=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').style.transform=`scaleX(${range>0?scrollY/range:0})`;progressFrame=null})},{passive:true});
  const canvas=$('.canvas-shell'),expand=$('#canvas-expand');let priorFocus=null;
  function setExpanded(expanded){if(expanded)priorFocus=document.activeElement;canvas.classList.toggle('is-fullscreen',expanded);document.body.classList.toggle('canvas-open',expanded);expand.textContent=expanded?'关闭全屏 ×':'全屏查看 ↗';expand.setAttribute('aria-expanded',String(expanded));if(expanded){canvas.setAttribute('role','dialog');canvas.setAttribute('aria-label','堂食收入链路全屏');canvas.setAttribute('aria-modal','true');$$('body>header,body>footer,main>section:not(.lineage-section),main>.index-strip').forEach(el=>el.inert=true);expand.focus()}else{canvas.removeAttribute('role');canvas.removeAttribute('aria-modal');$$('[inert]').forEach(el=>el.inert=false);priorFocus?.focus()}}
  expand.addEventListener('click',()=>setExpanded(!canvas.classList.contains('is-fullscreen')));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&canvas.classList.contains('is-fullscreen'))setExpanded(false)});
  addEventListener('message',e=>{if(e.origin===location.origin&&e.source===$('#lineage-frame').contentWindow&&e.data?.type==='canvas:escape')setExpanded(false)});
  const dialog=$('#image-dialog');$('#sonde-image-open').addEventListener('click',()=>{dialog.showModal();document.body.classList.add('no-scroll')});$('#image-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('no-scroll'));dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

  const reports={levels:'三级报表',performance:'战区经理绩效',monthly:'总经理月会'};
  const reportTabs=$$('[data-report]'),frames=$$('[data-report-frame]'),reportPanel=$('#original-report-panel');
  function selectReport(tab){reportTabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});reportPanel.setAttribute('aria-labelledby',tab.id);$('#original-report-title').textContent=reports[tab.dataset.report];frames.forEach(f=>{f.hidden=f.dataset.reportFrame!==tab.dataset.report;if(!f.hidden&&!f.getAttribute('src'))f.src=`demo/index.html?view=${f.dataset.reportFrame}`})}
  reportTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectReport(tab));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%reportTabs.length;if(e.key==='ArrowLeft')n=(i-1+reportTabs.length)%reportTabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=reportTabs.length-1;if(n!==undefined){e.preventDefault();reportTabs[n].focus();selectReport(reportTabs[n])}})});
  const reportExpand=$('#report-expand');function expandReport(on){reportPanel.classList.toggle('expanded',on);document.body.classList.toggle('report-open',on);reportExpand.setAttribute('aria-expanded',String(on));reportExpand.textContent=on?'收起 ×':'展开报表 ↗';if(!on)reportExpand.focus({preventScroll:true})}
  reportExpand.addEventListener('click',()=>expandReport(!reportPanel.classList.contains('expanded')));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&reportPanel.classList.contains('expanded'))expandReport(false)});
  addEventListener('message',e=>{if(e.origin===location.origin&&frames.some(f=>f.contentWindow===e.source)&&e.data==='demo:escape')expandReport(false)});
  selectReport(reportTabs[0]);
})();
