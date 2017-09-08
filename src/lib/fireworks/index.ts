import { FireWorksRenderrer, Spark } from './fireworks'

function _cvs(cvs) {
    if ( typeof cvs === 'string') {
      cvs = document.querySelector(cvs);
    }
    return cvs;
}

export default function(cvs) {
   const fwr = new FireWorksRenderrer(_cvs(cvs) );
   fwr.cvs.addEventListener('mousedown', function (e) {
     fwr.explode(e.clientX, e.clientY);
   }, false);
   fwr.cvs.addEventListener('touchstart', function (e) {
     fwr.explode(e.touches[0].pageX, e.touches[0].pageY);
   }, false);
   setInterval(fwr.render.bind(fwr), 0);
   setInterval(fwr.update.bind(fwr), 1000 / 60 );
   return fwr;
}

