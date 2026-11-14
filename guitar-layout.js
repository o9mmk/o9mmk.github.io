export const JACK=[1.13,-3.715,.255];
export const JACK_NORMAL=[.48,-.44,.759];
export const NUT=6.2, SCALE=9.38;
export const NOTES=[{name:'E',n:6,hz:82.406},{name:'A',n:5,hz:110},{name:'D',n:4,hz:146.832},{name:'G',n:3,hz:195.998},{name:'B',n:2,hz:246.942},{name:'E',n:1,hz:329.628}];
export const tunerPosition=i=>[-.285+i*.059,6.66+i*.32];
export const stringX=(i,y)=>{const f=(y+3.18)/SCALE;return(i-2.5)*(.15*(1-f)+.098*f);};
export const fretY=n=>NUT-SCALE*(1-2**(-n/12));
