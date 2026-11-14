import {surface} from './surface-textures.js';
import * as T from 'three';
import {materials} from './materials.js';
import {woodMaps} from './wood-textures.js';
export function guitarMaterials(){
 const m=materials(),micro=surface('metal');
 m.chrome=new T.MeshPhysicalMaterial({color:'#c3c6c2',metalness:1,roughness:.28,roughnessMap:micro.roughnessMap,normalMap:micro.normalMap,normalScale:new T.Vector2(.012,.012),envMapIntensity:.5});
 m.satinMetal=new T.MeshPhysicalMaterial({color:'#b3b2aa',metalness:1,roughness:.44,roughnessMap:micro.roughnessMap,anisotropy:.18,envMapIntensity:.7});
 m.poleMetal=new T.MeshStandardMaterial({color:'#777971',metalness:.9,roughness:.48,roughnessMap:micro.roughnessMap});
 m.maple=new T.MeshPhysicalMaterial({...woodMaps('maple'),color:'#fffaf0',roughness:.46,bumpScale:.001,clearcoat:.25,clearcoatRoughness:.3});
 m.rosewood=new T.MeshStandardMaterial({...woodMaps('rose'),roughness:.63,bumpScale:.002});
 m.pickguard=new T.MeshPhysicalMaterial({color:'#e7e5da',roughness:.25,ior:1.46,clearcoat:.15,clearcoatRoughness:.26});
 m.guardEdge=new T.MeshStandardMaterial({color:'#252722',roughness:.5});
 m.pickup=new T.MeshPhysicalMaterial({color:'#dfdac6',roughness:.36,ior:1.46,clearcoat:.08,clearcoatRoughness:.3});
 m.body=new T.MeshPhysicalMaterial({...woodMaps(),roughnessMap:null,roughness:.2,bumpScale:.00003,clearcoat:1,clearcoatRoughness:.1,ior:1.5});
 m.dot=new T.MeshStandardMaterial({color:'#cfc7ad',roughness:.5});
 m.stringMetal=new T.MeshStandardMaterial({color:'#b8b7b0',metalness:1,roughness:.36,envMapIntensity:.75});
 m.wood=new T.MeshStandardMaterial({color:'#896039',roughness:.9});
 return m;
}
export function finishBody(geo){const p=geo.attributes.position,uv=[];for(let i=0;i<p.count;i++)uv.push((p.getX(i)+3)/6,(p.getY(i)+5.5)/8.5);geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return geo;}
