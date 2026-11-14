import {VarinViewer} from './varin-viewer.js';

// Start the hosted guitar before downloading the separate cutaway renderer.
export class World {
 constructor(canvas,timeline) {
  this.canvas=canvas;
  this.timeline=timeline;
  this.still=new URLSearchParams(location.search).get('still');
  this.exterior=new VarinViewer(canvas);
  this.ready=this.exterior.ready.then(()=>{
   canvas.dataset.model='varin-official-embed';
   canvas.dataset.modelTriangles='58528';
   document.getElementById('modelLoading')?.setAttribute('hidden','');
  });
 }
 prepareInterior() {
  if(this.interiorReady)return;
  this.interiorReady=import('./interior-world.js').then(({InteriorWorld})=>{
   this.interior=new InteriorWorld(this.canvas,this.timeline);
  }).catch(error=>{
   console.error('Interior preparation failed',error);
   this.interiorError=error;
  });
 }
 canAdvance(t) {
  return Boolean(this.interior)||Boolean(this.still)||t<12.3||t>=22.5;
 }
 render(t,state,now) {
  if(!state.manual&&!this.still&&t>=5&&t<22.5)this.prepareInterior();
  const requested=!state.manual&&!this.still&&t>=12.3&&t<22.5;
  if(this.interiorError&&requested)throw this.interiorError;
  const inside=requested&&Boolean(this.interior);
  this.exterior.render(requested&&!inside?12.29:t,state,now,inside,this.still);
  this.canvas.dataset.inside=String(inside);
  document.body.classList.toggle('inside',inside);
  document.body.classList.toggle('detail-view',Boolean(this.still));
  if(inside)this.interior.render(t,state,now);
  else {
   // The return wipe must still run while the interior renderer is idle.
   const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
   document.getElementById('wipe').style.opacity=String(state.manual||this.still?0:Math.max(1-smooth(Math.abs(t-22.5)/.45),1-smooth(Math.abs(t-12.3)/.3)));
  }
  const waiting=!this.interior&&!state.manual&&!this.still&&t>=12.1&&t<22.5;
  if(waiting){
   if(this.interiorError)throw this.interiorError;
   document.getElementById('wipe').style.opacity='0';
   document.getElementById('hint').textContent='内部のシーンを準備しています…';
  }else if(this.waiting){
   document.getElementById('hint').textContent=state.paused?'一時停止中。「再生」か「次へ」で進めます。':'自動で進みます。「次へ」で先の場面へ。';
  }
  this.waiting=waiting;
 }
}
