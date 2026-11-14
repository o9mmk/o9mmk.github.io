import * as T from 'three';
import {mesh} from './materials.js';

export function cylinder(parent,m,r,h,p){const o=mesh(new T.CylinderGeometry(r,r,h,40),m,parent,p);o.rotation.x=Math.PI/2;return o;}
export function wire(parent,material,points,r=.011){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(curve,48,r,8,false),material,parent);}
export function coil(parent,m,x,y,angle=0){
 const g=new T.Group();g.position.set(x,y,.32);g.rotation.z=angle;parent.add(g);
 const shape=new T.Shape();shape.absarc(-.37,0,.12,Math.PI/2,Math.PI*1.5);shape.absarc(.37,0,.12,-Math.PI/2,Math.PI/2);shape.closePath();
 for(const z of[-.16,.1])mesh(new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false,curveSegments:32}),m.dark,g,[0,0,z]);
 // Fine copper winding around a single bobbin, with poles along the real Z axis.
 for(let j=0;j<32;j++){
  const z=-.13+j*.007,points=[];
  for(let k=0;k<=64;k++){const a=k/64*Math.PI*2;points.push(new T.Vector3(Math.cos(a)*.37+(Math.cos(a)>0?.085:-.085),Math.sin(a)*.105,z));}
  mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points,true),64,.0035,5,true),m.copper,g);
 }
 for(let i=0;i<6;i++)cylinder(g,m.satinMetal,.039,.32,[(i-2.5)*.146,0,.015]);
 for(const x of[-.54,.54])cylinder(g,m.chrome,.021,.27,[x,0,-.015]);
 return g;
}
export function pot(parent,m,x,y){
 const g=new T.Group();g.position.set(x,y,0);parent.add(g);
 cylinder(g,m.satinMetal,.175,.16,[0,0,-.1]);cylinder(g,m.chrome,.178,.014,[0,0,-.185]);
 cylinder(g,m.brass,.062,.19,[0,0,.065]);cylinder(g,m.satinMetal,.033,.14,[0,0,.23]);
 mesh(new T.BoxGeometry(.28,.09,.035),m.phenolic,g,[0,.2,-.08]);
 for(let i=0;i<3;i++){
  const x=(i-1)*.09;mesh(new T.BoxGeometry(.035,.11,.018),m.brass,g,[x,.265,-.08]);
  cylinder(g,m.solder,.026,.018,[x,.29,-.065]);
 }
 return g;
}
export function selector(parent,m){
 const g=new T.Group();g.position.set(1.38,-2.2,-.035);g.rotation.z=.72;parent.add(g);
 mesh(new T.BoxGeometry(.15,.56,.025),m.phenolic,g);
 for(const x of[-.105,.105])mesh(new T.BoxGeometry(.025,.65,.22),m.satinMetal,g,[x,0,.015]);
 for(let i=0;i<4;i++)for(const x of[-.16,.16]){
  const y=-.22+i*.145;mesh(new T.BoxGeometry(.12,.035,.018),m.brass,g,[x,y,.02]);cylinder(g,m.solder,.023,.016,[x*1.18,y,.035]);
 }
 cylinder(g,m.chrome,.05,.06,[0,0,.075]);
 const blade=mesh(new T.BoxGeometry(.025,.055,.37),m.satinMetal,g,[0,0,.19]);blade.rotation.x=-.22;
 return g;
}
