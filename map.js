(() => {
const target=document.getElementById('school-map');
const link=document.getElementById('amap-link');
// GCJ-02 gate coordinates from the user-provided Amap share link.
// POI B0MGA5EGPK: 上海市滴水湖学校(199号门), verified 2026-10-07.
const SCHOOL=[30.906925,121.957425];
let map;
const observer=new IntersectionObserver(entries=>{
 if(!entries.some(e=>e.isIntersecting))return;
 if(map){map.invalidateSize();return;}
 if(!window.L){return;}
 map=L.map(target,{scrollWheelZoom:false}).setView(SCHOOL,17);
 // Preserve the current deployment's map layer.
 const tiles=L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',{
   subdomains:['1','2','3','4'],
   maxZoom:18,
   attribution:'&copy; 高德地图'
 }).addTo(map);
 const marker=L.marker(SCHOOL,{icon:L.divIcon({className:'school-pin',iconSize:[28,28],iconAnchor:[14,14]}),title:'上海市滴水湖学校199号门，打开高德地图',alt:'上海市滴水湖学校199号门，打开高德地图'}).addTo(map);
 marker.bindTooltip('滴水湖学校 · 199号门',{permanent:true,direction:'top',offset:[0,-17],className:'school-label'});
 marker.on('click',()=>window.location.assign(link.href));
}, {root:document.getElementById('pages'),threshold:0.1});
observer.observe(target);
})();
