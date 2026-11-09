(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const embedded = JSON.parse($('paper-data').textContent);
  let data = embedded;
  const dinnerMap = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('부산 롯데캐슬 드메르 라메르');

  function filterPapers() {
    const query = $('search').value.trim().toLocaleLowerCase('ko');
    let total = 0;
    document.querySelectorAll('.schedule-row').forEach(row => {
      row.hidden = !row.dataset.search.includes(query);
      if (!row.hidden) total++;
    });
    $('program').hidden = Boolean(query);
    ['a', 'b'].forEach(session => {
      const hasRows = [...$(`schedule-${session}`).children].some(row => !row.hidden);
      $(session === 'a' ? 'papers' : 'session-b').hidden = Boolean(query) && !hasRows;
    });
    $('count').textContent = query ? `검색 결과 ${total}편 / 16편` : `발표자료 ${total}편`;
    $('empty').classList.toggle('show', total === 0);
  }

  function render(current) {
    const events = current.events.map(event => ({time:event[0], title:event[1], detail:event[2]}));
    events.splice(2, 0, ...current.plenary.map(p => ({time:p.time,title:`${p.label} · ${p.title}`,detail:`${p.speaker} · ${p.affiliation} · 좌장 ${p.chair}`,file:p.file})));
    $('timeline').innerHTML = events.map(event => {
      const link = event.file || (event.title === '만찬' ? dinnerMap : null);
      const content = `<div class="event-title">${esc(event.title)}</div><div class="event-detail">${esc(event.detail)}</div>`;
      return `<div class="event"><div class="time">${esc(event.time)}</div>${link ? `<a class="event-link" href="${esc(link)}" target="_blank" rel="noopener">${content}</a>` : `<div>${content}</div>`}</div>`;
    }).join('');
    const starts = {A:15*60+5, B:16*60+30};
    ['A','B'].forEach(session => {
      const container = $(`schedule-${session.toLowerCase()}`);
      container.replaceChildren();
      current.papers.filter(p => p.session === session).forEach((p,i) => {
        const minutes = starts[session] + i*5;
        const time = `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
        const row = document.createElement('tr');
        row.className = 'schedule-row';
        row.dataset.search = [p.code,p.title,p.authors,p.affiliation,...p.keywords].join(' ').toLocaleLowerCase('ko');
        row.innerHTML = `<td class="schedule-time" data-label="시간">${time}</td><td class="schedule-code" data-label="코드">${esc(p.code)}</td><td data-label="발표 제목"><a class="schedule-title" href="${esc(encodeURI(p.file))}" target="_blank" rel="noopener">${esc(p.title)} ↗</a></td><td class="schedule-authors" data-label="저자">${esc(p.authors)}</td><td class="schedule-affiliation" data-label="소속">${esc(p.affiliation)}</td>`;
        container.appendChild(row);
      });
    });
    filterPapers();
  }
  $('search').addEventListener('input',filterPapers);
  render(data);
  if (location.protocol !== 'file:') {
    fetch('papers.json').then(response => {if (!response.ok) throw new Error('Data unavailable');return response.json();})
      .then(next => {
        if (!Array.isArray(next.papers) || next.papers.length !== 16 || !Array.isArray(next.plenary) || next.plenary.length !== 2 || !Array.isArray(next.events) || !Array.isArray(next.ads)) return;
        data=next;render(data);
      }).catch(() => {});
  }

  const dialog=$('ad-modal');
  const storageKey='kmrts-autumn-2026-all-ads-viewed-v2';
  const viewedAds=new Set();
  let adsCompleted=false;
  try {adsCompleted=sessionStorage.getItem(storageKey)==='1';} catch {}
  let adIndex=0;
  let previousFocus=null;
  const allAdsViewed=()=>adsCompleted || data.ads.every(ad=>viewedAds.has(ad.image));
  function showAd(index) {
    if (!data.ads[index]) return;
    const nextHadFocus=document.activeElement===$('ad-next');
    adIndex=index;
    const ad=data.ads[index];
    viewedAds.add(ad.image);
    $('ad-image').src=ad.image;
    $('ad-image').alt=`${ad.name} 후원 광고`;
    $('ad-open').href=ad.image;
    $('ad-name').textContent=ad.name;
    $('ad-count').textContent=`${index+1} / ${data.ads.length}`;
    $('ad-prev').disabled=index===0;
    $('ad-next').disabled=index===data.ads.length-1;
    $('ad-close').disabled=!allAdsViewed();
    $('ad-help').textContent=allAdsViewed() ? '모든 후원사 광고를 확인했습니다.' : '광고 3개를 모두 확인하면 닫기 버튼이 활성화됩니다.';
    if (!dialog.open) {
      previousFocus=document.activeElement;
      dialog.showModal();
      document.body.style.overflow='hidden';
    }
    if (nextHadFocus && $('ad-next').disabled && allAdsViewed()) $('ad-close').focus();
  }
  $('ad-close').addEventListener('click',()=>{if(allAdsViewed()) dialog.close();});
  $('ad-prev').addEventListener('click',()=>showAd(adIndex-1));
  $('ad-next').addEventListener('click',()=>showAd(adIndex+1));
  dialog.addEventListener('cancel',event=>{if(!allAdsViewed()) event.preventDefault();});
  dialog.addEventListener('close',()=>{
    document.body.style.overflow='';
    if (allAdsViewed()) {
      adsCompleted=true;
      try {sessionStorage.setItem(storageKey,'1');} catch {}
    }
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  });
  dialog.addEventListener('click',event=>{
    if (event.target!==dialog || !allAdsViewed()) return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();
  });
  dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape' && !allAdsViewed()) {event.preventDefault();event.stopPropagation();return;}
    if(event.key==='ArrowRight') {event.preventDefault();showAd(adIndex+1);}
    if(event.key==='ArrowLeft') {event.preventDefault();showAd(adIndex-1);}
  });
  document.querySelectorAll('[data-ad-index]').forEach(button=>button.addEventListener('click',()=>showAd(Number(button.dataset.adIndex))));
  if(!adsCompleted) showAd(0);
})();
