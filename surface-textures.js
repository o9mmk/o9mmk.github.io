import * as T from 'three';
const SIZE=512,TAU=Math.PI*2;
function texture(data){const t=new T.DataTexture(data,SIZE,SIZE,T.RGBAFormat);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;t.needsUpdate=true;return t;}
export function surface(kind){
 const height=new Float32Array(SIZE*SIZE),color=new Uint8Array(SIZE*SIZE*4),rough=new Uint8Array(color.length);let seed=7817;
 const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const rows=Array.from({length:SIZE},()=>rand());
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
  const i=y*SIZE+x,u=x/SIZE,v=y/SIZE,n=rand(),broad=(Math.sin(u*TAU*3+Math.cos(v*TAU*2))+Math.cos(v*TAU*4))*.5;let h,c,r;
  if(kind==='cloth'){
   const a=(u+v)*8,b=(u-v)*8,over=((Math.floor(a)+Math.floor(b))%2+2)%2;
   const pa=Math.pow(.5+.5*Math.cos(TAU*a),.6),pb=Math.pow(.5+.5*Math.cos(TAU*b),.6);
   h=(over?pa:pb)*.65+Math.min(pa,pb)*.2+(n-.5)*.08;c=.62+h*.36;r=.76+n*.15;
  }else if(kind==='metal'){h=.48+(rows[y]-.5)*.07+(n-.5)*.015;c=.81+broad*.035+(n-.5)*.04;r=.9+broad*.015+(rows[y]-.5)*.025+(n-.5)*.015;}
  else{h=.5+(n-.5)*.08+broad*.015;c=.94+broad*.018+(n-.5)*.015;r=.65+broad*.12+n*.1;}
  height[i]=h;const p=i*4,q=Math.round(c*255),s=Math.round(r*255);color.set([q,q,q,255],p);rough.set([s,s,s,255],p);
 }
 const normal=new Uint8Array(color.length);const strength=kind==='cloth'?2.5:kind==='metal'?.7:.6;
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){const dx=(height[y*SIZE+(x+1)%SIZE]-height[y*SIZE+(x+SIZE-1)%SIZE])*strength,dy=(height[((y+1)%SIZE)*SIZE+x]-height[((y+SIZE-1)%SIZE)*SIZE+x])*strength,l=Math.hypot(dx,dy,1),p=(y*SIZE+x)*4;normal.set([Math.round(127.5-dx/l*127.5),Math.round(127.5+dy/l*127.5),Math.round(127.5+127.5/l),255],p);}
 const map=texture(color);map.colorSpace=T.SRGBColorSpace;return{map,normalMap:texture(normal),roughnessMap:texture(rough)};
}
export function cableMaterial(base,length,radius){const m=base.clone();for(const k of['map','normalMap','roughnessMap']){m[k]=base[k].clone();m[k].repeat.set(length/(Math.PI*2*radius)*1.4,1.4);m[k].needsUpdate=true;}m.userData.ownedMaps=true;return m;}
export function releaseCableMaterial(m){if(!m.userData.ownedMaps)return;for(const k of['map','normalMap','roughnessMap'])m[k]?.dispose();m.dispose();}
