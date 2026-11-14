import {contourBody} from './body-geometry.js';
import * as T from 'three';
import {mesh} from './materials.js';
import {batchStaticMeshes} from './scene-utils.js';
import {bodyOutline} from './guitar-shapes.js';
import {finishBody} from './guitar-materials.js';
import {jackCutout,buildJack} from './jack.js';
import {cylinder,coil,pot,selector,wire} from './circuit-parts.js';

export const PICKUPS=[[0,-.84,0],[0,-1.72,0],[0,-2.52,-.18]];
export const CONTROLS=[[.75,-2.67],[1.35,-2.96],[1.84,-3.36]];
function route(){
 const s=new T.Shape();s.moveTo(-.64,-.6);s.lineTo(.64,-.6);s.lineTo(.64,-1.08);s.lineTo(.12,-1.08);
 s.lineTo(.12,-1.48);s.lineTo(.64,-1.48);s.lineTo(.64,-1.96);s.lineTo(.18,-1.96);s.lineTo(.18,-2.17);
 s.bezierCurveTo(.65,-2.17,.82,-1.77,1.06,-1.77);s.bezierCurveTo(1.6,-1.7,1.69,-1.94,1.78,-2.38);
 s.lineTo(2.07,-3.4);s.bezierCurveTo(2.18,-3.78,1.83,-3.79,1.57,-3.6);s.lineTo(.58,-3.12);
 s.lineTo(.48,-2.91);s.lineTo(-.62,-2.76);s.lineTo(-.69,-2.31);s.lineTo(-.12,-2.22);
 s.lineTo(-.12,-1.96);s.lineTo(-.64,-1.96);s.lineTo(-.64,-1.48);s.lineTo(-.12,-1.48);
 s.lineTo(-.12,-1.08);s.lineTo(-.64,-1.08);s.closePath();return s;
}
export function buildCircuit(scene,m){
 // Front cutaway at the exterior's scale and coordinates, not a deep tunnel.
 const g=new T.Group();g.name='pickguard-cutaway';scene.add(g);
 const cavity=route(),shell=bodyOutline();shell.holes.push(new T.Path(cavity.getPoints(24)),jackCutout());
 const geo=new T.ExtrudeGeometry(shell,{depth:.49,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:24,curveSegments:64});geo.translate(0,0,-.2);
 mesh(finishBody(contourBody(geo)),m.body,g);
 const timber=new T.MeshStandardMaterial({color:'#73543a',roughness:.88,side:T.DoubleSide});
 mesh(new T.ShapeGeometry(cavity,48),timber,g,[0,0,-.23]);
 const routeEdge=new T.ExtrudeGeometry(cavity,{depth:.53,bevelEnabled:false,curveSegments:48});
 const p=routeEdge.attributes.position,idx=[];for(let i=0;i<p.count;i+=3){const zs=[p.getZ(i),p.getZ(i+1),p.getZ(i+2)];if(Math.max(...zs)-Math.min(...zs)>.01)idx.push(i,i+1,i+2);}
 routeEdge.setIndex(idx);routeEdge.translate(0,0,-.23);mesh(routeEdge,timber,g);
 // Pickup routes are shallower than the control pocket.
 const shelf=new T.Shape();shelf.moveTo(-.64,-.6);shelf.lineTo(.64,-.6);shelf.lineTo(.64,-1.08);shelf.lineTo(.12,-1.08);
 shelf.lineTo(.12,-1.48);shelf.lineTo(.64,-1.48);shelf.lineTo(.64,-1.96);shelf.lineTo(.18,-1.96);shelf.lineTo(.18,-2.17);
 shelf.lineTo(.57,-2.24);shelf.lineTo(.48,-2.91);shelf.lineTo(-.62,-2.76);shelf.lineTo(-.69,-2.31);shelf.lineTo(-.12,-2.22);
 shelf.lineTo(-.12,-1.96);shelf.lineTo(-.64,-1.96);shelf.lineTo(-.64,-1.48);shelf.lineTo(-.12,-1.48);
 shelf.lineTo(-.12,-1.08);shelf.lineTo(-.64,-1.08);shelf.closePath();
 mesh(new T.ExtrudeGeometry(shelf,{depth:.25,bevelEnabled:false,curveSegments:24}),timber,g,[0,0,-.23]);
 const cm={...m,phenolic:new T.MeshStandardMaterial({color:'#453221',roughness:.67}),solder:new T.MeshStandardMaterial({color:'#b3b5ad',metalness:1,roughness:.4})};
 PICKUPS.forEach(([x,y,a])=>coil(g,cm,x,y,a));CONTROLS.forEach(([x,y])=>pot(g,cm,x,y));selector(g,cm);buildJack(g,m);
 const cream=new T.MeshStandardMaterial({color:'#c7bf9a',roughness:.7});
 const black=new T.MeshStandardMaterial({color:'#272925',roughness:.72});
 const red=new T.MeshStandardMaterial({color:'#704331',roughness:.7});
 PICKUPS.forEach(([,y],i)=>{
  const x=.075-i*.045;
  wire(g,cream,[[.32,y,.18],[x,y-.2,.08],[x,-2.17,.07],[.72,-2.24,-.14],[1.1,-2.12,-.14],[1.24,-2.03-i*.07,.01]],.009);
  wire(g,black,[[.25,y,.18],[x-.035,y-.23,.065],[x-.035,-2.2,.06],[.4,-2.52,.06],[.75,-2.67,-.18]],.009);
 });
 wire(g,cream,[[1.5,-2.35,.01],[1.1,-2.5,-.2],[.84,-2.38,-.06]],.012);
 wire(g,red,[[.75,-2.38,-.06],[.95,-2.52,-.21],[1.35,-2.67,-.065],[1.65,-2.83,-.22],[1.84,-3.07,-.065]],.011);
 wire(g,black,[[.75,-2.67,-.18],[1.03,-2.88,-.24],[1.35,-2.96,-.18],[1.59,-3.2,-.24],[1.84,-3.36,-.18]],.012);
 wire(g,cream,[[.66,-2.38,-.06],[.5,-2.78,-.24],[.83,-3.2,-.24],[1.13,-3.715,-.06]],.011);
 wire(g,black,[[.75,-2.67,-.18],[.65,-2.87,-.27],[.99,-3.3,-.27],[1.16,-3.715,-.08]],.011);
 mesh(new T.BoxGeometry(.12,.19,.055),new T.MeshStandardMaterial({color:'#715b3a',roughness:.64}),g,[1.11,-2.83,-.055]);
 wire(g,m.satinMetal,[[1.08,-2.74,-.055],[1.13,-2.62,-.04],[1.26,-2.67,-.065]],.006);
 wire(g,m.satinMetal,[[1.14,-2.92,-.055],[1.28,-3.02,-.17],[1.35,-2.96,-.18]],.006);
 for(const [x,y]of CONTROLS)cylinder(g,cm.solder,.033,.012,[x,y,-.181]);
 batchStaticMeshes(g);return g;
}
