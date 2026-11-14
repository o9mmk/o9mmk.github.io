import * as T from 'three';
import {mergeVertices} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js';
import {bodySurfaceZ} from './body-contour.js';

export function contourBody(source){
 // ExtrudeGeometry supplies face normals along its outline. Average distinct
 // directions at coincident vertices before subdivision, not the adaptive triangles.
 const sourceP=source.attributes.position,sourceN=source.attributes.normal,shared=new Map();
 source.computeBoundingBox();const minZ=Math.round(source.boundingBox.min.z*1e5),maxZ=Math.round(source.boundingBox.max.z*1e5);
 const key=i=>[sourceP.getX(i),sourceP.getY(i),sourceP.getZ(i)].map(v=>Math.round(v*1e5)).join(',');
 for(let i=0;i<sourceP.count;i++){
  const k=key(i);if(!shared.has(k))shared.set(k,new Map());
  const n=new T.Vector3().fromBufferAttribute(sourceN,i);shared.get(k).set(n.toArray().map(v=>Math.round(v*1e5)).join(','),n);
 }
 for(const[k,directions]of shared){
  const values=[...directions.values()],z=Number(k.split(',')[2]);
  const n=new T.Vector3();if(z===maxZ)n.set(0,0,1);else if(z===minZ)n.set(0,0,-1);else for(const d of values)n.add(d);
  shared.set(k,n.normalize());
 }
 for(let i=0;i<sourceP.count;i++){const n=shared.get(key(i));sourceN.setXYZ(i,n.x,n.y,n.z);}
 const p=source.attributes.position,normals=source.attributes.normal,vertices=[],normalData=[],indices=source.index?.array;
 const point=i=>[p.getX(i),p.getY(i),p.getZ(i),normals.getX(i),normals.getY(i),normals.getZ(i)];
 const distance=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
 function split(a,b,c,depth=0){
  const ab=distance(a,b),bc=distance(b,c),ca=distance(c,a),largest=Math.max(ab,bc,ca);
  if(largest>.09&&depth<9){
   const mid=(a,b)=>a.map((n,i)=>(n+b[i])*.5);
   if(largest===ab){const m=mid(a,b);split(a,m,c,depth+1);split(m,b,c,depth+1);}
   else if(largest===bc){const m=mid(b,c);split(a,b,m,depth+1);split(a,m,c,depth+1);}
   else{const m=mid(c,a);split(a,b,m,depth+1);split(m,b,c,depth+1);}return;
  }
  for(const v of[a,b,c]){
   const [x,y,z,nx,ny,nz]=v,e=.001;
   const fx=(bodySurfaceZ(x+e,y,z)-bodySurfaceZ(x-e,y,z))/(2*e);
   const fy=(bodySurfaceZ(x,y+e,z)-bodySurfaceZ(x,y-e,z))/(2*e);
   const fz=(bodySurfaceZ(x,y,z+e)-bodySurfaceZ(x,y,z-e))/(2*e);
   const n=new T.Vector3(nx-fx*nz/fz,ny-fy*nz/fz,nz/fz).normalize();
   vertices.push(x,y,bodySurfaceZ(x,y,z));normalData.push(n.x,n.y,n.z);
  }
 }
 for(let i=0;i<(indices?.length??p.count);i+=3)split(point(indices?indices[i]:i),point(indices?indices[i+1]:i+1),point(indices?indices[i+2]:i+2));
 const raw=new T.BufferGeometry();raw.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
 // Transform surface normals with the deformation, avoiding tessellation-shaped reflections.
 raw.setAttribute('normal',new T.Float32BufferAttribute(normalData,3));
 const result=mergeVertices(raw,.00001);raw.dispose();source.dispose();return result;
}
