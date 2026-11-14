import * as T from 'three';
import{surface}from'./surface-textures.js';
export function materials(){
 const metal=surface('metal'),cloth=surface('cloth'),paint=surface('paint');
 const physical=(color,roughness,metalness,extra={})=>new T.MeshPhysicalMaterial({color,roughness,metalness,...extra});
 const alloy=(color,roughness,anisotropy)=>physical(color,roughness,1,{...metal,normalScale:new T.Vector2(.22,.22),anisotropy,envMapIntensity:1.15});
 const fabric=color=>physical(color,.94,0,{...cloth,normalScale:new T.Vector2(1.2,1.2),sheen:.65,sheenRoughness:.8,sheenColor:new T.Color(color),envMapIntensity:.35});
 const plug=color=>physical(color,.4,0,{...paint,clearcoat:.2,clearcoatRoughness:.3,normalScale:new T.Vector2(.12,.12)});
 return{
  enamel:physical('#d7c7a0',.42,0,{...paint,clearcoat:.45,clearcoatRoughness:.22,normalScale:new T.Vector2(.1,.1)}),
  navy:physical('#142538',.55,.25,{...paint,normalScale:new T.Vector2(.25,.25)}),
  brass:alloy('#c0a16a',.34,.5),chrome:alloy('#cbd1d7',.25,.65),copper:alloy('#b66f45',.32,.45),
  dark:physical('#121b22',.82,0,{...paint}),red:fabric('#a83422'),blue:fabric('#24364c'),ivory:fabric('#c3ad80'),
  redPlug:plug('#68281e'),bluePlug:plug('#182434'),ivoryPlug:plug('#9d8b66'),
  pcb:physical('#233c33',.59,.1,{...paint}),
  amber:new T.MeshStandardMaterial({color:'#efb262',emissive:'#ff9a43',emissiveIntensity:1,roughness:.35}),
  ink:new T.MeshBasicMaterial({color:'#1d3046'})
 };
}
export function mesh(g,m,parent,p=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
