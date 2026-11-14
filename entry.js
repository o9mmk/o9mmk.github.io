const mobile=matchMedia('(max-width:700px)').matches;
const still=new URLSearchParams(location.search).has('still');
if(mobile&&!still){
 await import('./mobile-preview.js');
}else{
 const fonts=document.createElement('link');
 fonts.rel='stylesheet';
 fonts.href='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap';
 document.head.append(fonts);
 document.getElementById('mobilePreview').hidden=true;
 await import('./app.js');
}
