import * as T from 'three';
import {HDRLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/HDRLoader.js';
let studioHDR;
try{studioHDR=await new HDRLoader().loadAsync('./assets/studio-small-09-1k.hdr');}
catch(error){console.warn('Studio HDR unavailable; using authored reflection cards.',error);}
export function studioEnvironment(renderer){
 if(studioHDR){const generator=new T.PMREMGenerator(renderer);const result=generator.fromEquirectangular(studioHDR);generator.dispose();return result;}
 const studio=new T.Scene();studio.background=new T.Color(.018,.021,.028);
 const room=new T.Mesh(new T.BoxGeometry(30,24,30),new T.MeshBasicMaterial({color:new T.Color(.14,.16,.18),side:T.BackSide}));studio.add(room);
 function panel(p,w,h,color){const o=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(...color),side:T.DoubleSide}));o.position.set(...p);o.lookAt(0,0,0);studio.add(o);}
 // Authored reflection cards: one broad window, two narrow strips, and dark negative space.
 panel([-6,6,7],5,8,[4.1,3.9,3.5]);panel([5,2,4],.7,8,[2.6,2.9,3.4]);panel([1,7,-4],8,.7,[2.8,2.3,1.8]);panel([-2,-5,5],5,2,[.8,.86,1]);
 const p=new T.PMREMGenerator(renderer),result=p.fromScene(studio,.015);studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});p.dispose();return result;
}
export function lighting(scene){
 const key=new T.DirectionalLight('#fff7ef',.75);key.position.set(-5,7,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:35});key.shadow.bias=-.00012;key.shadow.normalBias=.006;key.shadow.radius=3;scene.add(key);
 const fill=new T.HemisphereLight('#e8efff','#403126',.08);scene.add(fill);
 const rim=new T.DirectionalLight('#e3eaff',.2);rim.position.set(8,-1,3);scene.add(rim);
 return{key,fill,rim,setInside(inside){key.intensity=inside?0:.75;fill.intensity=inside?0:.08;rim.intensity=inside?0:.2;}};
}
