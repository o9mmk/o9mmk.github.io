const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export function bodySurfaceZ(x,y,z){
 const front=smooth((z+.02)/.28),back=1-smooth((z+.28)/.24);
 const forearm=smooth((-x-.78)/1.45)*smooth((y+4.8)/1.15)*(1-smooth((y+1.8)/1.6));
 const belly=smooth((-x-.2)/1.25)*smooth((y+2)/1.4)*(1-smooth((y-.15)/1.1));
 return z-.19*front*forearm+.17*back*belly;
}
