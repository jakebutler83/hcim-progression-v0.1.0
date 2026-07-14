(() => {
  const TILE_URL = 'https://raw.githubusercontent.com/mejrs/layers_osrs/refs/heads/master/mapsquares/-1/{z}/{plane}_{x}_{gameY}.png';
  const MAP_CENTER = [3200, 3200]; // Leaflet CRS.Simple uses [y, x]
  const MIN_ZOOM = -4;
  const MAX_ZOOM = 8;
  const DEFAULT_ZOOM = -2;
  const ONLINE_GRACE_MS = 10 * 60_000;
  const DELAYED_GRACE_MS = 2 * 60_000;
  const SURFACE_MAX_Y = 6400;
  const MAIN_SURFACE_BOUNDS = [[2250, 700], [4450, 4450]];
  const PRIF_SURFACE_BOUNDS = [[5450, 2050], [6400, 3550]];
  const LOCAL_MAP_RADIUS = 640;
  const MARKER_ICON_STORAGE_KEY = 'hcim-live-map-player-icons-v2';
  function markerStorageKey(){return `${MARKER_ICON_STORAGE_KEY}:${window.HCIM_CURRENT_USER?.uid||'guest'}`;}


  const CITY_LABELS = [
    { name:'Varrock', x:3210, y:3424, tier:'major' },
    { name:'Falador', x:2965, y:3379, tier:'major' },
    { name:'Lumbridge', x:3222, y:3218, tier:'major' },
    { name:'Ardougne', x:2662, y:3305, tier:'major' },
    { name:'Civitas illa Fortis', x:1678, y:3112, tier:'major' },
    { name:'Prifddinas', x:3263, y:6065, tier:'major' },
    { name:'Great Kourend', x:1643, y:3670, tier:'major' },
    { name:'Port Sarim', x:3029, y:3217, tier:'town' },
    { name:'Rimmington', x:2957, y:3214, tier:'town' },
    { name:'Draynor Village', x:3093, y:3244, tier:'town' },
    { name:'Al Kharid', x:3293, y:3183, tier:'town' },
    { name:'Edgeville', x:3087, y:3496, tier:'town' },
    { name:'Barbarian Village', x:3082, y:3420, tier:'town' },
    { name:'Taverley', x:2894, y:3456, tier:'town' },
    { name:'Burthorpe', x:2899, y:3544, tier:'town' },
    { name:'Catherby', x:2804, y:3434, tier:'town' },
    { name:"Seers' Village", x:2725, y:3485, tier:'town' },
    { name:'Yanille', x:2544, y:3095, tier:'town' },
    { name:'Tree Gnome Stronghold', x:2461, y:3444, tier:'town' },
    { name:'Tree Gnome Village', x:2525, y:3167, tier:'town' },
    { name:'Rellekka', x:2668, y:3632, tier:'town' },
    { name:'Neitiznot', x:2310, y:3780, tier:'town' },
    { name:'Jatizso', x:2418, y:3801, tier:'town' },
    { name:'Canifis', x:3496, y:3488, tier:'town' },
    { name:"Mort'ton", x:3489, y:3289, tier:'town' },
    { name:'Burgh de Rott', x:3495, y:3211, tier:'town' },
    { name:'Port Phasmatys', x:3687, y:3502, tier:'town' },
    { name:'Shilo Village', x:2852, y:2954, tier:'town' },
    { name:'Brimhaven', x:2772, y:3178, tier:'town' },
    { name:'Musa Point', x:2917, y:3175, tier:'town' },
    { name:'Sophanem', x:3304, y:2789, tier:'town' },
    { name:'Pollnivneach', x:3359, y:2978, tier:'town' },
    { name:'Nardah', x:3429, y:2892, tier:'town' },
    { name:'Lletya', x:2340, y:3163, tier:'town' },
    { name:'Hosidius', x:1744, y:3598, tier:'town' },
    { name:'Port Piscarilius', x:1800, y:3738, tier:'town' },
    { name:'Lovakengj', x:1510, y:3816, tier:'town' },
    { name:'Arceuus', x:1690, y:3880, tier:'town' },
    { name:'Shayzien', x:1480, y:3600, tier:'town' },
    { name:'Aldarin', x:1375, y:2945, tier:'town' },
    { name:'Cam Torum', x:1440, y:9560, tier:'town' }
  ];

  const MARKER_ICONS = {
    partyhat: { label: 'Partyhat', url: 'https://oldschool.runescape.wiki/images/Blue_partyhat.png' },
    dragonScimitar: { label: 'Dragon scimitar', url: 'https://oldschool.runescape.wiki/images/Dragon_scimitar.png' },
    abyssalWhip: { label: 'Abyssal whip', url: 'https://oldschool.runescape.wiki/images/Abyssal_whip.png' },
    fireCape: { label: 'Fire cape', url: 'https://oldschool.runescape.wiki/images/Fire_cape.png' },
    runeScimitar: { label: 'Rune scimitar', url: 'https://oldschool.runescape.wiki/images/Rune_scimitar.png' },
    amuletOfGlory: { label: 'Amulet of glory', url: 'https://oldschool.runescape.wiki/images/Amulet_of_glory.png' },
    dragonDagger: { label: 'Dragon dagger', url: 'https://oldschool.runescape.wiki/images/Dragon_dagger.png' },
    coins: { label: 'Coins', url: 'https://oldschool.runescape.wiki/images/Coins_10000.png' },
    lobster: { label: 'Lobster', url: 'https://oldschool.runescape.wiki/images/Lobster.png' },
    hcimHelm: { label: 'HCIM helm', url: 'https://oldschool.runescape.wiki/images/Hardcore_ironman_helm.png' }
  };

  let unsubscribe = null;
  let currentLocations = [];
  let selectedUid = '';
  let refreshTimer = null;
  let map = null;
  let tileLayer = null;
  let lastStructureSignature = '';
  const markers = new Map();
  const lastSurfaceByUid = new Map();
  let followSelectedPlayer = true;
  let cityLabelLayer = null;
  let hasPresentedMap = false;
  let activeMapContextKey = 'surface-main';
  let activeTilePlane = 0;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[ch]);
  }
  function timestampMs(value) {
    if (!value) return 0;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value.seconds === 'number') return value.seconds * 1000;
    const n = Number(value); return Number.isFinite(n) ? n : 0;
  }
  function presenceState(location) {
    const updated = timestampMs(location.updatedAt);
    if (location.online === false) return 'offline';
    if (!updated) return location.__lastPresence || 'connecting';
    const age = Math.max(0, Date.now() - updated);
    if (age < DELAYED_GRACE_MS) return 'online';
    if (age < ONLINE_GRACE_MS) return 'delayed';
    return 'offline';
  }
  const isFresh = location => presenceState(location) !== 'offline';
  function statusLabel(location) {
    return ({online:'Online', delayed:'Connection delayed', connecting:'Connecting', offline:'Offline'})[presenceState(location)];
  }
  function statusText(location) {
    const updated = timestampMs(location.updatedAt);
    if (!updated) return 'Never synced';
    const seconds = Math.max(0, Math.round((Date.now() - updated) / 1000));
    if (seconds < 5) return 'Live now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  }
  function loadMarkerIconChoices() {
    try { const v = JSON.parse(localStorage.getItem(markerStorageKey()) || '{}'); return v && typeof v === 'object' ? v : {}; }
    catch (_) { return {}; }
  }
  function markerIconKey(uid) { const c=loadMarkerIconChoices(); return MARKER_ICONS[c[uid]] ? c[uid] : 'hcimHelm'; }
  function markerIcon(uid) { return MARKER_ICONS[markerIconKey(uid)] || MARKER_ICONS.hcimHelm; }
  function saveMarkerIconChoice(uid,key) { if(!uid||!MARKER_ICONS[key])return; const c=loadMarkerIconChoices(); c[uid]=key; localStorage.setItem(markerStorageKey(),JSON.stringify(c)); }
  function markerIconOptions(uid) { const s=markerIconKey(uid); return Object.entries(MARKER_ICONS).map(([k,i])=>`<option value="${escapeHtml(k)}" ${k===s?'selected':''}>${escapeHtml(i.label)}</option>`).join(''); }

  function isSurfaceCoordinate(location) {
    const x = Number(location?.x), y = Number(location?.y);
    return Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 12800 && y >= 0 && y < SURFACE_MAX_Y;
  }

  function mapContextFor(location) {
    const x = Number(location?.x), y = Number(location?.y), plane = Math.max(0, Math.min(3, Number(location?.plane) || 0));
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return { key:'surface-main', label:'Surface world', plane:0, bounds:MAIN_SURFACE_BOUNDS, center:MAP_CENTER, zoom:DEFAULT_ZOOM, labels:'main' };
    }
    if (y >= 5450 && y < SURFACE_MAX_Y && x >= 2050 && x <= 3550) {
      return { key:`surface-prif-${plane}`, label:plane ? `Prifddinas • floor ${plane}` : 'Prifddinas region', plane, bounds:PRIF_SURFACE_BOUNDS, center:[y,x], zoom:1, labels:'prif' };
    }
    if (y < 5000) {
      return { key:`surface-main-${plane}`, label:plane ? `Surface world • floor ${plane}` : 'Surface world', plane, bounds:MAIN_SURFACE_BOUNDS, center:[y,x], zoom:DEFAULT_ZOOM, labels:'main' };
    }
    const radius = LOCAL_MAP_RADIUS;
    return {
      key:`local-${Math.floor(x/256)}-${Math.floor(y/256)}-${plane}`,
      label:plane ? `Local area • floor ${plane}` : 'Dungeon / local area',
      plane,
      bounds:[[y-radius,x-radius],[y+radius,x+radius]],
      center:[y,x],
      zoom:2,
      labels:'local'
    };
  }

  function displayLocation(location) {
    const x=Number(location?.x), y=Number(location?.y), plane=Math.max(0,Math.min(3,Number(location?.plane)||0));
    if(!Number.isFinite(x)||!Number.isFinite(y)) return null;
    if(isSurfaceCoordinate(location)) lastSurfaceByUid.set(location.uid||'',{x,y,plane,held:false});
    return {x,y,plane,held:false};
  }

  function applyMapContext(location, recenter=false) {
    if(!map) return;
    const context=mapContextFor(location);
    const changed=context.key!==activeMapContextKey || context.plane!==activeTilePlane;
    activeMapContextKey=context.key;
    activeTilePlane=context.plane;
    map.setMaxBounds(context.bounds);
    map.options.maxBoundsViscosity=0.85;
    if(changed){ tileLayer?.redraw(); renderCityLabels(); }
    if(recenter || changed) map.setView(context.center, Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), context.zoom)), {animate:false});
    const updated=document.getElementById('liveMapUpdated');
    if(updated) updated.textContent=`${context.label} • ${followSelectedPlayer?'following selected player':'free map view'}`;
  }

  function tileUrl(coords) {
    return TILE_URL.replace('{z}', coords.z).replace('{plane}', activeTilePlane).replace('{x}', coords.x).replace('{gameY}', -(1 + coords.y));
  }


  function cityLabelHtml(city) {
    return `<span class="osrs-city-label osrs-city-label-${city.tier}">${escapeHtml(city.name)}</span>`;
  }

  function renderCityLabels() {
    if (!map) return;
    if (cityLabelLayer) cityLabelLayer.remove();
    cityLabelLayer = L.layerGroup();
    const context = mapContextFor(currentLocations.find(x => (x.uid||'') === selectedUid));
    CITY_LABELS.filter(city => {
      if(context.labels==='main') return city.y < 5000;
      if(context.labels==='prif') return city.y >= 5450 && city.y < SURFACE_MAX_Y;
      return Math.abs(city.x-context.center[1]) <= LOCAL_MAP_RADIUS && Math.abs(city.y-context.center[0]) <= LOCAL_MAP_RADIUS;
    }).forEach(city => {
      const icon = L.divIcon({
        className: 'osrs-city-label-icon',
        html: cityLabelHtml(city),
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
      L.marker([city.y, city.x], {
        icon,
        interactive: false,
        keyboard: false,
        zIndexOffset: 150
      }).addTo(cityLabelLayer);
    });
    cityLabelLayer.addTo(map);
    updateCityLabelVisibility();
  }

  function updateCityLabelVisibility() {
    const root = document.getElementById('hcimWorldMap');
    if (!root || !map) return;
    root.classList.toggle('show-town-labels', map.getZoom() >= -0.5);
  }

  function presentMapWhenVisible(centerOnFirstOpen = false) {
    const route = document.getElementById('live-map');
    if (!map || !route?.classList.contains('active-route')) return;
    requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      tileLayer?.redraw();
      if (centerOnFirstOpen && !hasPresentedMap) {
        hasPresentedMap = true;
        map.setView(MAP_CENTER, DEFAULT_ZOOM, { animate: false });
      }
      setTimeout(() => {
        map?.invalidateSize({ pan: false });
        if (followSelectedPlayer && selectedUid) followSelected(false);
      }, 120);
    });
  }

  function markerHtml(location) {
    const icon = markerIcon(location.uid || '');
    return `<div class="leaflet-player-marker ${isFresh(location)?'':'stale'} ${selectedUid===(location.uid||'')?'selected':''}">
      <span class="anchored-marker-icon-wrap"><img class="anchored-marker-icon" src="${escapeHtml(icon.url)}" alt="${escapeHtml(icon.label)}"></span>
      <span class="anchored-marker-label">${escapeHtml(location.playerName || 'Player')}</span>
    </div>`;
  }

  function initMap() {
    const root = document.getElementById('hcimWorldMap');
    if (!root || map || !window.L) return;
    map = L.map(root, {
      crs: L.CRS.Simple,
      center: MAP_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
      attributionControl: false,
      maxBounds: MAIN_SURFACE_BOUNDS,
      maxBoundsViscosity: 0.85
    });
    tileLayer = L.tileLayer('', {
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      minNativeZoom: 0,
      maxNativeZoom: 4,
      tileSize: 256,
      noWrap: true,
      updateWhenZooming: false,
      keepBuffer: 3
    });
    tileLayer.getTileUrl = tileUrl;
    tileLayer.on('tileerror', event => {
      // Negative display zooms are rendered from native zoom 0 tiles. A failed
      // request should not leave Leaflet permanently blank after a resize.
      event?.tile?.classList?.add('hcim-map-tile-error');
    });
    tileLayer.addTo(map);
    renderCityLabels();
    map.on('zoomend', updateCityLabelVisibility);
    map.on('dragstart zoomstart', () => { followSelectedPlayer=false; updateFollowButton(); });
    map.on('dblclick', () => setFollow(true));
    setTimeout(() => map.invalidateSize(), 0);
    presentMapWhenVisible(true);
  }

  function resetCamera() {
    if (!map) return;
    followSelectedPlayer = false;
    const selected=currentLocations.find(x=>(x.uid||'')===selectedUid);
    const context=mapContextFor(selected);
    applyMapContext(selected,true);
    map.setView(context.center, context.zoom, { animate:true });
    updateFollowButton();
  }
  function setFollow(enabled) { followSelectedPlayer=enabled; updateFollowButton(); if(enabled) followSelected(true); }
  function followSelected(animate=true) {
    if (!map || !followSelectedPlayer) return;
    const selected=currentLocations.find(x=>(x.uid||'')===selectedUid); if(!selected)return;
    const p=displayLocation(selected); if(!p)return;
    applyMapContext(selected,false);
    const targetZoom=Math.max(map.getZoom(), 2);
    map.setView([p.y,p.x],targetZoom,{animate});
  }
  function updateFollowButton() {
    const b=document.getElementById('centerLiveMapBtn'); if(!b)return;
    b.textContent=followSelectedPlayer?'Following player':'Resume live follow'; b.classList.toggle('primary',followSelectedPlayer);
  }
  function updateFocusLabel(location) {
    const label=document.getElementById('trueOsrsMapFocus'); if(!label||!location)return;
    const context=mapContextFor(location);
    label.textContent=`${location.playerName||'Player'} • ${context.label} • World ${location.world||'—'} • ${location.x}, ${location.y}, plane ${location.plane??0}`;
  }
  function selectLocation(location,follow=true) { selectedUid=location.uid||''; applyMapContext(location,true); if(follow)setFollow(true); updateFocusLabel(location); render(true); }

  function renderMarkers(locations) {
    if(!map)return;
    const active=new Set();
    locations.forEach(location=>{
      const uid=location.uid||''; const p=displayLocation(location); if(!uid||!p)return;
      active.add(uid);
      const icon=L.divIcon({className:'hcim-leaflet-div-icon',html:markerHtml(location),iconSize:[34,34],iconAnchor:[17,17]});
      let marker=markers.get(uid);
      if(!marker){ marker=L.marker([p.y,p.x],{icon,riseOnHover:true}).addTo(map); marker.on('click',()=>selectLocation(location,true)); markers.set(uid,marker); }
      else { marker.setLatLng([p.y,p.x]); marker.setIcon(icon); marker.off('click'); marker.on('click',()=>selectLocation(location,true)); }
      marker.setZIndexOffset(selectedUid===uid?1000:0);
      marker.bindTooltip(`${location.playerName||'Player'}${p.held?' (last surface position)':''}`,{direction:'top',offset:[0,-14],opacity:.95});
    });
    for(const [uid,marker] of markers){ if(!active.has(uid)){map.removeLayer(marker);markers.delete(uid);} }
  }

  function structureSignature(locations){return locations.map(l=>[l.uid||'',l.playerName||'',l.world??'',l.regionId??'',l.x??'',l.y??'',l.plane??''].join('|')).join('~');}
  function refreshPresenceOnly(){
    const ordered=[...currentLocations].sort((a,b)=>Number(isFresh(b))-Number(isFresh(a))||String(a.playerName||'').localeCompare(String(b.playerName||'')));
    const count=document.getElementById('liveMapOnlineCount'); if(count)count.textContent=`${ordered.filter(isFresh).length} online`;
    ordered.forEach(location=>{
      const uid=location.uid||''; const fresh=isFresh(location);
      const card=document.querySelector(`.group-live-member-card[data-uid="${CSS.escape(uid)}"]`);
      if(card){card.classList.toggle('online',fresh);card.classList.toggle('offline',!fresh);const st=card.querySelector('.live-member-main > span');if(st)st.textContent=`${statusLabel(location)} • World ${location.world||'—'}`;const t=card.querySelector('time');if(t)t.textContent=statusText(location);}
    });
    renderMarkers(ordered);
  }
  function render(force=false){
    const list=document.getElementById('groupLiveMemberList'); if(!list)return;
    const ordered=[...currentLocations].sort((a,b)=>Number(isFresh(b))-Number(isFresh(a))||String(a.playerName||'').localeCompare(String(b.playerName||'')));
    const live=ordered.filter(isFresh), signature=structureSignature(ordered);
    if(!force&&signature===lastStructureSignature){refreshPresenceOnly();if(followSelectedPlayer)followSelected(false);return;}
    lastStructureSignature=signature;
    if(!selectedUid&&live.length)selectedUid=live[0].uid||'';
    const selected=ordered.find(x=>(x.uid||'')===selectedUid);
    renderMarkers(ordered); if(selected){updateFocusLabel(selected);if(followSelectedPlayer)followSelected(false);}
    list.innerHTML=ordered.length?ordered.map(location=>{
      const fresh=isFresh(location), sel=selectedUid===(location.uid||''), d=displayLocation(location);
      return `<article class="group-live-member-card ${fresh?'online':'offline'} ${sel?'selected':''}" data-uid="${escapeHtml(location.uid||'')}">
      <button class="live-member-focus" type="button" data-focus-uid="${escapeHtml(location.uid||'')}"><span class="live-member-avatar live-member-item-avatar"><img src="${escapeHtml(markerIcon(location.uid||'').url)}" alt="${escapeHtml(markerIcon(location.uid||'').label)}"></span><span class="live-member-main"><strong>${escapeHtml(location.playerName||'Unknown player')}</strong><span>${escapeHtml(statusLabel(location))} • World ${escapeHtml(location.world||'—')}</span><small>Region ${escapeHtml(location.regionId??'—')} • ${escapeHtml(location.x??'—')}, ${escapeHtml(location.y??'—')} • Plane ${escapeHtml(location.plane??'—')}</small></span></button>
      <div class="live-member-card-foot"><time>${escapeHtml(statusText(location))}</time><label class="marker-icon-picker">Map icon<select data-marker-icon-uid="${escapeHtml(location.uid||'')}" aria-label="Choose map icon">${markerIconOptions(location.uid||'')}</select></label><button type="button" class="live-member-full-map" data-full-map-uid="${escapeHtml(location.uid||'')}">Open full view</button></div></article>`;
    }).join(''):`<div class="group-live-empty"><strong>No companion locations yet</strong><p>Link the RuneLite companion and enable location sharing to appear here.</p></div>`;
    list.querySelectorAll('[data-focus-uid]').forEach(b=>b.addEventListener('click',()=>{const l=ordered.find(x=>(x.uid||'')===b.dataset.focusUid);if(l)selectLocation(l,true);}));
    list.querySelectorAll('[data-marker-icon-uid]').forEach(s=>{s.addEventListener('click',e=>e.stopPropagation());s.addEventListener('change',()=>{saveMarkerIconChoice(s.dataset.markerIconUid||'',s.value);render(true);});});
    list.querySelectorAll('[data-full-map-uid]').forEach(b=>b.addEventListener('click',()=>{const l=ordered.find(x=>(x.uid||'')===b.dataset.fullMapUid);if(l)selectLocation(l,true);toggleFullscreenMap();}));
    const count=document.getElementById('liveMapOnlineCount');if(count)count.textContent=`${live.length} online`;
    const updated=document.getElementById('liveMapUpdated');if(updated){const c=mapContextFor(selected);updated.textContent=ordered.length?`${c.label} • ${followSelectedPlayer?'following selected player':'free map view'}`:'Waiting for first sync';}
    updateFollowButton();
  }

  function subscribe(groupId){
    if(!groupId||!window.firebase||!firebase.firestore)return; if(unsubscribe)unsubscribe();
    unsubscribe=firebase.firestore().collection('groups').doc(groupId).collection('locations').onSnapshot({includeMetadataChanges:true},snapshot=>{
      const previousByUid=new Map(currentLocations.map(i=>[i.uid||'',i]));
      currentLocations=snapshot.docs.map(doc=>{const incoming={uid:doc.id,...doc.data()},previous=previousByUid.get(doc.id),im=timestampMs(incoming.updatedAt),pm=timestampMs(previous?.updatedAt);if(previous&&(!im||im<pm))return previous;const state=presenceState(incoming);incoming.__lastPresence=state==='connecting'?(previous?.__lastPresence||'connecting'):state;return incoming;});render();
    },error=>{console.error('Live group map failed:',error);const list=document.getElementById('groupLiveMemberList');if(list)list.innerHTML=`<div class="group-live-empty error"><strong>Could not load live locations</strong><p>${escapeHtml(error.message)}</p></div>`;});
  }
  function fullscreenTarget(){return document.querySelector('.true-osrs-map-card');}
  function updateFullscreenButton(){const label=document.fullscreenElement?'Exit full view':'Open full view';['openDoogleMapBtn','internalFullMapBtn'].forEach(id=>{const b=document.getElementById(id);if(b)b.textContent=label;});setTimeout(()=>map?.invalidateSize(),80);}
  async function toggleFullscreenMap(){const target=fullscreenTarget();if(!target)return;try{if(document.fullscreenElement)await document.exitFullscreen();else if(target.requestFullscreen)await target.requestFullscreen();else{target.classList.toggle('map-fullscreen-fallback');document.body.classList.toggle('map-fullscreen-open',target.classList.contains('map-fullscreen-fallback'));}}catch(e){target.classList.toggle('map-fullscreen-fallback');document.body.classList.toggle('map-fullscreen-open',target.classList.contains('map-fullscreen-fallback'));}updateFullscreenButton();}
  function install(){
    initMap();
    document.getElementById('centerLiveMapBtn')?.addEventListener('click',()=>setFollow(true));
    document.getElementById('reloadTrueMapBtn')?.addEventListener('click',()=>{tileLayer?.redraw();resetCamera();});
    document.getElementById('openDoogleMapBtn')?.addEventListener('click',toggleFullscreenMap);
    document.getElementById('internalFullMapBtn')?.addEventListener('click',toggleFullscreenMap);
    document.addEventListener('fullscreenchange',updateFullscreenButton);
    updateFullscreenButton();

    const liveRoute=document.getElementById('live-map');
    if(liveRoute&&!liveRoute.__hcimMapObserved){
      liveRoute.__hcimMapObserved=true;
      new MutationObserver(()=>presentMapWhenVisible(true)).observe(liveRoute,{attributes:true,attributeFilter:['class']});
    }
    document.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-route="live-map"],[data-target="live-map"],[data-open-route="live-map"]');
      if(trigger)setTimeout(()=>presentMapWhenVisible(true),0);
    });
    window.addEventListener('resize',()=>presentMapWhenVisible(false));
    presentMapWhenVisible(true);

    const groupId=window.HCIM_ACTIVE_GROUP_ID;if(groupId)subscribe(groupId);
    if(!refreshTimer)refreshTimer=setInterval(refreshPresenceOnly,5000);
  }
  window.addEventListener('hcim-group-ready',event=>{install();subscribe(event.detail?.groupId||window.HCIM_ACTIVE_GROUP_ID);});
  window.addEventListener('hcim-session-reset',()=>{if(unsubscribe){unsubscribe();unsubscribe=null;}locations.clear();selectedUid=null;followSelected=true;markers.forEach(marker=>marker.remove());markers.clear();renderPlayerList();});
  document.addEventListener('DOMContentLoaded',install);
  window.addEventListener('hcim-leaflet-ready', install);
})();
