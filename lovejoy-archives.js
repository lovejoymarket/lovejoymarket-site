(function(root){
  'use strict';
  const normalizeIndex=(index,total)=>((index%total)+total)%total;
  const chooseAlbum=(data,id)=>data.albums.find(album=>album.id===id)||data.albums.find(album=>album.id===data.featuredAlbum)||data.albums[0];
  root.LoveJoyArchives={normalizeIndex,chooseAlbum};
  if(typeof document==='undefined')return;
  const viewer=document.querySelector('#album-viewer');
  const data=root.LoveJoyArchivesData;
  if(!viewer||!data?.albums?.length)return;
  const query=new URLSearchParams(location.search);
  let album=chooseAlbum(data,query.get('album')),index=0;
  const main=viewer.querySelector('[data-main-photo]'),thumbs=viewer.querySelector('[data-thumbnails]');
  const list=document.querySelector('[data-album-list]');
  function showPhoto(next){
    index=normalizeIndex(next,album.photos.length);
    const photo=album.photos[index];
    main.src=photo.src;main.alt=photo.alt;main.removeAttribute('width');main.removeAttribute('height');
    viewer.querySelector('[data-photo-count]').textContent=`Photo ${index+1} of ${album.photos.length}`;
    viewer.querySelector('[data-photo-caption]').textContent=`${album.title} ♡`;
    [...thumbs.children].forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));
    const url=new URL(location.href);url.searchParams.set('album',album.id);url.searchParams.set('photo',String(index+1));
    history.replaceState(null,'',url);
  }
  function selectAlbum(selected,photoIndex=0){
    album=selected;
    for(const selector of ['[data-album-name]','[data-album-heading]','[data-album-crumb]'])document.querySelector(selector).textContent=album.title;
    document.querySelector('[data-album-total]').textContent=String(album.photos.length);
    document.querySelector('[data-album-description]').textContent=album.description||'';
    const credit=album.photographer;
    for(const selector of ['[data-photographer]','[data-photo-credit]']){
      const link=document.querySelector(selector);link.href=credit.url;link.textContent=selector==='[data-photographer]'?credit.name:`${credit.name} · ${credit.handle}`;
    }
    thumbs.replaceChildren();
    album.photos.forEach((photo,i)=>{
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`View photo ${i+1}: ${photo.alt}`);
      const image=document.createElement('img');image.src=photo.src;image.alt='';image.loading='lazy';button.append(image);button.addEventListener('click',()=>showPhoto(i));thumbs.append(button);
    });
    [...list.children].forEach(button=>button.setAttribute('aria-current',String(button.dataset.albumId===album.id)));
    viewer.querySelector('[data-prev]').disabled=viewer.querySelector('[data-next]').disabled=album.photos.length<2;
    showPhoto(photoIndex);
  }
  data.albums.filter(item=>item.photos?.length).forEach(item=>{
    const button=document.createElement('button');button.type='button';button.className='archive-album';button.dataset.albumId=item.id;
    const image=document.createElement('img');image.src=item.photos[0].src;image.alt='';image.loading='lazy';
    const label=document.createElement('span');label.textContent=item.title;const count=document.createElement('small');count.textContent=`${item.photos.length} photos`;label.append(count);button.append(image,label);button.addEventListener('click',()=>selectAlbum(item));list.append(button);
  });
  viewer.querySelector('[data-prev]').addEventListener('click',()=>showPhoto(index-1));
  viewer.querySelector('[data-next]').addEventListener('click',()=>showPhoto(index+1));
  viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(index+(event.key==='ArrowRight'?1:-1));}});
  const stage=viewer.querySelector('[data-stage]');let start;
  stage.addEventListener('touchstart',event=>{const t=event.changedTouches[0];start={x:t.clientX,y:t.clientY};},{passive:true});
  stage.addEventListener('touchend',event=>{if(!start)return;const t=event.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))showPhoto(index+(dx<0?1:-1));start=null;},{passive:true});
  const initial=Number(query.get('photo')||1)-1;
  selectAlbum(album,Number.isInteger(initial)?initial:0);
})(globalThis);
