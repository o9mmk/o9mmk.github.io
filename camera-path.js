export const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
export const socketPosition=i=>[(i%15-7)*.86,(4.5-Math.floor(i/15))*.7-.1,0];
export function cameraPose(t,keys){
 t=Math.max(0,Math.min(keys.at(-1).t,t));let i=keys.findIndex((k,j)=>j<keys.length-1&&t>=k.t&&t<keys[j+1].t);if(i<0)i=keys.length-2;
 const a=keys[i],b=keys[i+1],p=smooth((t-a.t)/(b.t-a.t));const blend=(x,y)=>x.map((n,j)=>n+(y[j]-n)*p);
 return{eye:blend(a.eye,b.eye),at:blend(a.at,b.at),fov:a.fov+(b.fov-a.fov)*p};
}
