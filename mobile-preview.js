import {audio,session} from './experience-session.js';
const $=id=>document.getElementById(id);
const chapters=[...document.querySelectorAll('[data-scene]')];
let cuts,selected=0,starting=false,toastTimer;
document.body.classList.add('poster-mode');
$('modelLoading').hidden=true;
$('hint').textContent='画像プレビュー。音はすぐに鳴らせます。';
$('actionText').textContent='3Dで中を見る';
$('time').textContent='PREVIEW';
$('reel').textContent='最初の場面へ';

function soundUI(){
 $('sound').textContent=session.sound?'SOUND ON':'SOUND OFF';
 $('sound').setAttribute('aria-pressed',String(session.sound));
}
async function strum(){
 try{
  session.sound=true;audio.setMuted(false);soundUI();
  await audio.strum();
  Object.assign($('scene3d').dataset,{audio:audio.context.state,chord:'Em 022000',voices:'6',strums:String(Number($('scene3d').dataset.strums||0)+1)});
  $('playStrings').textContent='もう一度ジャーンと鳴らす';
 }catch(error){
  console.error('Preview audio failed',error);
  $('toast').textContent='音を再生できませんでした。もう一度タップしてください。';
  $('toast').classList.add('show');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);
 }
}
function select(index){
 if(!cuts||starting)return;
 selected=(index+cuts.length)%cuts.length;
 const cut=cuts[selected];
 $('headline').innerHTML=cut.title;$('copy').innerHTML=cut.copy;
 $('eyebrow').textContent=cut.label;$('word').textContent=cut.word;
 chapters.forEach(button=>button.classList.toggle('active',Number(button.dataset.scene)===selected));
}
async function start3D(){
 if(starting)return;starting=true;session.initialScene=selected;
 $('interact').disabled=true;$('actionText').textContent='3Dを準備しています…';
 $('hint').textContent='読み込み中も音は鳴らせます。';
 try{
  await import('./app.js');
  if(!$('scene3d').dataset.model)throw new Error('Viewer did not become ready');
  $('mobilePreview').hidden=true;document.body.classList.remove('poster-mode');
  $('reel').textContent='最初から ↻';
 }catch(error){
  console.error('3D activation failed',error);
  $('hint').textContent='3Dを読み込めませんでした。通信を確認して再読み込みしてください。';
  $('actionText').textContent='再読み込み';$('interact').onclick=()=>location.reload();
  $('playStrings').onclick=strum;
 }finally{
  $('interact').disabled=false;
 }
}
$('interact').onclick=start3D;
$('playStrings').onclick=strum;
$('sound').onclick=()=>{session.sound=!session.sound;audio.setMuted(!session.sound);soundUI();};
$('back').onclick=()=>select(selected-1);$('reel').onclick=()=>select(0);
chapters.forEach(button=>button.onclick=()=>select(Number(button.dataset.scene)));
$('aboutOpen').onclick=()=>$('about').showModal();$('aboutClose').onclick=()=>$('about').close();
try{
 const response=await fetch('timeline.json');
 if(!response.ok)throw new Error(`timeline HTTP ${response.status}`);
 cuts=(await response.json()).cuts;select(0);
}catch(error){
 console.error('Preview chapters failed',error);
 $('hint').textContent='場面を取得できませんでした。読む版は上のリンクから開けます。';
}
