import {GuitarSound} from './sound.js';
// Keep the same AudioContext when upgrading the image preview to 3D.
export const audio=new GuitarSound();
export const session={sound:false,initialScene:0};
