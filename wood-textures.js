import * as T from 'three';
import {bodyOutline} from './guitar-shapes.js';
let photographedGrain;
try{
 const image=await new T.ImageLoader().loadAsync('./assets/fine-grained-wood-2k.jpg');
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
 const context=canvas.getContext('2d');if(!context)throw Error('Wood texture canvas unavailable');
 context.drawImage(image,0,0,1024,1024);photographedGrain=context.getImageData(0,0,1024,1024).data;
}catch(error){console.warn('Photographic wood unavailable; using procedural grain.',error);}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
function hash(x,y){let h=Math.imul(x,374761393)^Math.imul(y,668265263);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;}
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iy),hash(ix+1,iy),fx),T.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),fx),fy);}
function tex(data,n,color=false){const t=new T.DataTexture(data,n,n);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.generateMipmaps=true;t.minFilter=T.LinearMipmapLinearFilter;t.anisotropy=16;t.needsUpdate=true;return t;}
function edgeField(){const n=192,out=new Float32Array(n*n),points=bodyOutline().getPoints(12);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const px=x/(n-1)*6-3,py=y/(n-1)*8.5-5.5;let best=100;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dy=b.y-a.y,t=clamp(((px-a.x)*dx+(py-a.y)*dy)/(dx*dx+dy*dy||1));best=Math.min(best,(px-a.x-t*dx)**2+(py-a.y-t*dy)**2);}out[y*n+x]=Math.sqrt(best);}return{n,out};}
export function woodMaps(kind='body'){
 const n=kind==='body'?1024:512,map=new Uint8Array(n*n*4),bump=new Uint8Array(map.length),rough=new Uint8Array(map.length),field=kind==='body'?edgeField():null;
 const palette=kind==='rose'?[[45,30,23],[77,51,37]]:kind==='maple'?[[189,156,105],[231,207,166]]:[[153,105,49],[208,163,87]];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const u=x/(n-1),v=y/(n-1),warp=noise(u*5,v*3)*.7+noise(u*13,v*5)*.11;
  const ring=u*(kind==='body'?31:48)+warp*5.6+Math.sin(v*3.7+u*8)*.65,grain=Math.pow(.5+.5*Math.sin(ring*Math.PI*2),12);
  const fine=noise(u*350,v*8),pores=Math.pow(noise(u*540,v*150),12),broad=noise(u*9,v*4);
  let col=palette[0].map((a,i)=>T.MathUtils.lerp(a,palette[1][i],.38+broad*.5));
  if(field){const fx=u*(field.n-1),fy=v*(field.n-1),ix=Math.floor(fx),iy=Math.floor(fy),at=(a,b)=>field.out[Math.min(field.n-1,b)*field.n+Math.min(field.n-1,a)],d=T.MathUtils.lerp(T.MathUtils.lerp(at(ix,iy),at(ix+1,iy),fx-ix),T.MathUtils.lerp(at(ix,iy+1),at(ix+1,iy+1),fx-ix),fy-iy);const red=[95,33,18],black=[18,15,12];col=col.map((c,i)=>T.MathUtils.lerp(red[i],c,smooth((d-.25)/.7)));col=col.map((c,i)=>T.MathUtils.lerp(black[i],c,smooth((d-.07)/.31)));}
  const sample=((Math.floor(v*1023)*1024+Math.floor(u*1023))*4);
  const luminance=photographedGrain?(.2126*photographedGrain[sample]+.7152*photographedGrain[sample+1]+.0722*photographedGrain[sample+2])/255:.3;
  // Use photographed irregular fibers under the stain; the lacquer itself remains smooth.
  const shade=photographedGrain?clamp(1+(luminance-.31)*(kind==='rose'?1.1:kind==='body'?.8:.28),.73,1.13):1-grain*(kind==='rose'?.12:.055)-(1-fine)*.045-pores*.1,p=(y*n+x)*4;
  map.set([...col.map(c=>Math.round(clamp(c*shade,0,255))),255],p);
  const h=Math.round(photographedGrain?120+luminance*85:155-grain*23-pores*28);bump.set([h,h,h,255],p);
  const r=Math.round(195+noise(u*39,v*21)*28+pores*20);rough.set([r,r,r,255],p);
 }
 return{map:tex(map,n,true),bumpMap:tex(bump,n),roughnessMap:tex(rough,n)};
}
export function planarWood(geo){const p=geo.attributes.position,uv=[];for(let i=0;i<p.count;i++)uv.push((p.getX(i)+.55)/1.1,p.getY(i)/10);geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return geo;}
