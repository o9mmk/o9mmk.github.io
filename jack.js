import * as T from 'three';
import {mesh} from './materials.js';
import {JACK, JACK_NORMAL} from './guitar-shapes.js';
export const BOAT=[1.35,-3.92];
// A stamped recessed dish, with the socket mounted on its upper inclined wall.
export function jackCutout(){const p=new T.Path();p.absellipse(...BOAT,.34,.74,0,Math.PI*2,true,.82);return p;}
export function buildJack(parent,m){
 const chrome=m.chrome.clone();chrome.side=T.DoubleSide;chrome.roughness=.29;chrome.envMapIntensity=.45;chrome.normalMap=null;
 const axis=new T.Vector2(-.73,.68),across=new T.Vector2(.68,.73);
 const profile=[[.29,.69,.43],[.282,.675,.445],[.27,.65,.447],[.258,.62,.43],[.235,.56,.35],[.20,.48,.22],[.15,.36,.13],[.08,.19,.105],[.001,.002,.105]];
 const rings=new T.CatmullRomCurve3(profile.map(p=>new T.Vector3(...p))).getPoints(64).map(p=>[p.x,p.y,p.z]);
 const positions=[],uv=[],indices=[],segments=128;
 for(let r=0;r<rings.length;r++)for(let i=0;i<=segments;i++){
  const a=i/segments*Math.PI*2,[w,l,z]=rings[r];
  const along=Math.cos(a)*l,side=Math.sin(a)*w;
  positions.push(BOAT[0]+axis.x*along+across.x*side,BOAT[1]+axis.y*along+across.y*side,z);
  uv.push(i/segments,r/(rings.length-1));
 }
 for(let r=0;r<rings.length-1;r++)for(let i=0;i<segments;i++){
  // Leave an aperture in the upper wall for the angled socket.
  const mid=r*(segments+1)+i;const point=new T.Vector3(...positions.slice(mid*3,mid*3+3)).sub(new T.Vector3(...JACK));const n=new T.Vector3(...JACK_NORMAL).normalize();const depth=point.dot(n);const radial=point.clone().addScaledVector(n,-depth).length();if(radial<.10&&depth<.22)continue;
  const a=r*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,a+1,b,b+1);
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const normals=geo.attributes.normal;for(let r=0;r<rings.length;r++){const a=r*(segments+1),b=a+segments,n=new T.Vector3().fromBufferAttribute(normals,a).add(new T.Vector3().fromBufferAttribute(normals,b)).normalize();normals.setXYZ(a,n.x,n.y,n.z);normals.setXYZ(b,n.x,n.y,n.z);}mesh(geo,chrome,parent);
 const socket=new T.Group();socket.position.set(...JACK);socket.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),new T.Vector3(...JACK_NORMAL));parent.add(socket);
 mesh(new T.RingGeometry(.076,.144,64),chrome,socket,[0,0,-.005]);
 const ring=new T.Shape();for(let i=0;i<=6;i++){const a=i/6*Math.PI*2;const x=Math.cos(a)*.128,y=Math.sin(a)*.128;if(i===0)ring.moveTo(x,y);else ring.lineTo(x,y);}const hole=new T.Path();hole.absarc(0,0,.076,0,Math.PI*2,true);ring.holes.push(hole);
 mesh(new T.ExtrudeGeometry(ring,{depth:.035,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:5,curveSegments:64}),chrome,socket);
 mesh(new T.TorusGeometry(.081,.009,10,40),chrome,socket,[0,0,.038]);
 const sleeve=chrome.clone();sleeve.color.set("#343a38");sleeve.roughness=.38;const tube=mesh(new T.CylinderGeometry(.075,.075,.28,40,1,true),sleeve,socket,[0,0,-.14]);tube.rotation.x=Math.PI/2;
 mesh(new T.CircleGeometry(.074,40),m.dark,socket,[0,0,-.28]);
 for(const d of[-.61,.61]){
  const x=BOAT[0]+axis.x*d,y=BOAT[1]+axis.y*d;
  const screw=mesh(new T.CylinderGeometry(.032,.032,.025,18),chrome,parent,[x,y,.45]);screw.rotation.x=Math.PI/2;
  mesh(new T.BoxGeometry(.045,.007,.006),m.dark,parent,[x,y,.466]);
 }
}
