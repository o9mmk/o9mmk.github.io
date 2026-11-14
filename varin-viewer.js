import {varinPose} from './varin-camera.js';
const MODEL='2a29975b708b4106a84d5b51e3ede608';
function loadSDK(){
 if(window.Sketchfab)return Promise.resolve();
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  const timeout=setTimeout(()=>reject(new Error('3Dへの接続がタイムアウトしました。再読み込みしてください。')),15000);
  script.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
  script.onload=()=>{clearTimeout(timeout);resolve();};script.onerror=()=>{clearTimeout(timeout);reject(new Error('Sketchfabに接続できません。通信を確認して再読み込みしてください。'));};
  document.head.append(script);
 });
}
export class VarinViewer{
 constructor(canvas){
  this.canvas=canvas;this.lastTime=-100;this.lastFrame=-100;
  this.element=document.createElement('iframe');this.element.id='varinViewer';
  this.element.title='Stratocaster — varin / Sketchfab 公式3Dビューア';
  this.element.allow='autoplay; fullscreen; xr-spatial-tracking';this.element.allowFullscreen=true;
  canvas.before(this.element);this.ready=this.initialize();
 }
 async initialize(){
  await loadSDK();
  await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('ギターの読み込みがタイムアウトしました。再読み込みしてください。')),60000);
   const fail=()=>{clearTimeout(timeout);reject(new Error('Sketchfabのギターを読み込めませんでした。'));};
   new window.Sketchfab(this.element).init(MODEL,{
    max_texture_size:innerWidth<700?2048:8192,preload:0,ui_inspector:0,autostart:1,camera:0,dnt:1,transparent:1,ui_controls:0,ui_infos:0,ui_hint:0,ui_stop:0,ui_watermark:1,scrollwheel:0,
    success:api=>{
     this.api=api;
     api.addEventListener('viewerready',()=>{
      clearTimeout(timeout);
      api.setBackground({transparent:true},error=>this.report(error));
      api.setUserInteraction(false,error=>this.report(error));
      api.setCameraEasing('easeLinear');api.setFov(42,error=>this.report(error));
      api.getPostProcessing(settings=>{
       this.element.dataset.postProcessing=JSON.stringify(settings);
       if('vignetteEnable' in settings)api.setPostProcessing({vignetteEnable:false});
      });
      api.addEventListener('click',info=>{if(info.position3D){this.element.dataset.lastPick=JSON.stringify(info.position3D);this.canvas.dispatchEvent(new Event('click'));}},{pick:'fast'});
      const pose=varinPose(0,{mobile:innerWidth<700});
      api.setCameraLookAt(pose.position,pose.target,.001,error=>{
       if(error){reject(new Error('ギターのカメラを初期化できませんでした。'));return;}
       this.element.dataset.ready='true';resolve();
       if(innerWidth<700)api.setTextureQuality('hd',error=>this.report(error));
      });
     });api.start();
    },error:fail
   });
  });
 }
 report(error){
  if(!error)return;
  console.error('Sketchfab Viewer API',error);
  this.element.dataset.apiError=String(error);
 }
 render(t,state,now,inside,still){
  const mobile=innerWidth<700,mode=`${inside}/${state.manual}/${mobile}/${still}`;
  const changed=mode!==this.mode||Math.abs(t-this.lastTime)>.3;
  if(inside!==this.inside){if(inside)this.api.stop();else this.api.start();this.inside=inside;}
  this.element.style.visibility=inside?'hidden':'visible';
  this.element.style.pointerEvents=inside?'none':'auto';
  this.element.setAttribute('aria-hidden',String(inside));
  this.canvas.style.visibility=inside?'visible':'hidden';
  if(inside){this.mode=mode;this.lastTime=t;return;}
  if(!changed&&now-this.lastFrame<1/30)return;
  if(!changed&&t===this.lastTime)return;
  const pose=varinPose(t,{manual:state.manual,mobile,still});
  this.api.setCameraLookAt(pose.position,pose.target,changed?.001:.045,error=>this.report(error));
  if(changed)setTimeout(()=>this.api.getCameraLookAt((error,camera)=>{this.report(error);this.element.dataset.cameraActual=JSON.stringify(camera);}),100);
  this.element.dataset.camera=JSON.stringify(pose);this.element.dataset.time=t.toFixed(2);
  this.mode=mode;this.lastTime=t;this.lastFrame=now;
 }
}
