(()=>{importScripts("/site/vendor/lzutf8/lzutf8.min.js","/site/vendor/lunr/lunr.min.js","/site/vendor/lunr/lunr-stemmer.min.js","/site/vendor/lunr/lunr-ru.min.js","/site/vendor/lunr/lunr-multi.min.js");var m=class{},c=class{reInit(t){this.ids=t,this.currentI=0}more(){let t=this.ids.length-this.currentI,e=[];return t<=0||(t<c.batchSize*3/2?e=this.ids.slice(this.currentI):e=this.ids.slice(this.currentI,this.currentI+c.batchSize),this.currentI+=c.batchSize,this.isEnd=this.currentI>=this.ids.length),e}},d=c;d.batchSize=20;var p=class{constructor(){this.ready=!1;let e=["tagIndex.json.lz","projectIndex.json.lz","results.json.lz"].map(s=>{let r="/site/search/"+s;return fetch(r).then(a=>a.text())});Promise.all(e).then(s=>{this.tagIndex=this.decompress(s[0]),this.tagNumStrIds=Object.keys(this.tagIndex),lunr.multiLanguage("en","ru"),this.projectIndex=lunr.Index.load(this.decompress(s[1])),this.results=this.decompress(s[2]),this.projectNumIds=Object.keys(this.results).map(r=>+r),this.ready=!0,this.pendingCallback&&this.pendingCallback(),l.ids=o.projectNumIds,l.currentI=Math.min(d.batchSize,l.ids.length)})}decompress(t){return JSON.parse(LZUTF8.decompress(t,{inputEncoding:"BinaryString"}))}whenReady(t){if(this.ready){t();return}this.pendingCallback=t}search(t,e){let s=[],r=this.projectNumIds;e.forEach(i=>{r=r.filter(n=>this.tagIndex[i].includes(n))});let a;if(t&&t.length>0){let i=t.split(" ").map(n=>n+"~1 "+n+"*").join(" ");a=this.projectIndex.search(i)}else a=this.projectIndex.search("");return a.forEach(i=>{let n=+i.ref;r.includes(n)&&s.push(n)}),s}getHtmlProjectById(t){let e=this.results[t],s="/projects/"+e.id,r="/projects/"+e.id+"/icon."+e.iconExt,a=e.tagIds?e.tagIds.map(u=>this.tagNumStrIds[u]).slice(0,5):[],i="";switch(e.type){case"in":i="Потребитель";break;case"out":i="Производитель";break;case"mix":i="Производитель и потребитель";break}return`
            <div class="searchResult">
                <a class="icon" href="${s}">
                    <img src="${r}" loading="lazy">
                </a>
                
                <div class="infoBlock">
                    <div class="arrows">
                        <div class="bgArrow"></div>
                        <div class="borderArrow"></div>
                    </div>

                    <div class="statusBg status--${e.status}"></div>

                    <header>
                        <a class="icon" href="${s}"><img src="${r}" loading="lazy"></a>
                        <a class="title" href="${s}">${e.title}</a>
                    </header>

                    <div class="desc">${e.desc}</div>

                    <footer>
                        <img class="type" title="${i}" src="/site/graphics/${e.type}.svg">
                        ${a.length>0?'<i class="fa-solid fa-hashtag"></i>'+a.map(u=>`<div class="tag">${u}</div>`).join(""):""}
                    </footer>
                </div>
            </div>
        `.trim()}},g=self,o=new p,l=new d;onmessage=h=>{let t=h.data;o.whenReady(()=>{if(t.type==="search"){let r=t;l.reInit(o.search(r.text,r.tags))}let e=l.more(),s=new m;s.id=t.id,s.resultHTML=e.map(r=>o.getHtmlProjectById(r)).join(""),s.resultHTML!==""&&l.isEnd&&(s.resultHTML="!"+s.resultHTML),g.postMessage(s)})};})();
