(()=>{importScripts("/site/vendor/lzutf8/lzutf8.min.js","/site/vendor/lunr/lunr.min.js","/site/vendor/lunr/lunr-stemmer.min.js","/site/vendor/lunr/lunr-ru.min.js","/site/vendor/lunr/lunr-multi.min.js");var m=class{},c=class{reInit(t){this.ids=t,this.currentI=0}more(){let t=this.ids.length-this.currentI,e=[];return t<=0||(t<c.batchSize*3/2?e=this.ids.slice(this.currentI):e=this.ids.slice(this.currentI,this.currentI+c.batchSize),this.currentI+=c.batchSize,this.isEnd=this.currentI>=this.ids.length),e}},d=c;d.batchSize=20;var p=class{constructor(){this.ready=!1;let e=["tagIndex.json.lz","projectIndex.json.lz","results.json.lz"].map(s=>{let r="/site/search/"+s;return fetch(r).then(i=>i.text())});Promise.all(e).then(s=>{this.tagIndex=this.decompress(s[0]),this.tagNumStrIds=Object.keys(this.tagIndex),lunr.multiLanguage("en","ru"),this.projectIndex=lunr.Index.load(this.decompress(s[1])),this.results=this.decompress(s[2]),this.projectNumIds=Object.keys(this.results).map(r=>+r),this.ready=!0,l.ids=o.projectNumIds,l.currentI=Math.min(d.batchSize,l.ids.length),this.pendingCallback&&this.pendingCallback()})}decompress(t){return JSON.parse(LZUTF8.decompress(t,{inputEncoding:"BinaryString"}))}whenReady(t){if(this.ready){t();return}this.pendingCallback=t}search(t,e){let s=[],r=this.projectNumIds;e.forEach(n=>{r=r.filter(a=>this.tagIndex[n].includes(a))});let i;if(t&&t.length>0){let n=t.split(" ").map(a=>a+"~1 "+a+"*").join(" ");i=this.projectIndex.search(n)}else i=this.projectIndex.search("");return i.forEach(n=>{let a=+n.ref;r.includes(a)&&s.push(a)}),s}getHtmlProjectById(t){let e=this.results[t],s="/projects/"+e.id,r=e.tagIds?e.tagIds.map(h=>this.tagNumStrIds[h]).slice(0,5):[],i="";switch(e.type){case"in":i="Потребитель";break;case"out":i="Производитель";break;case"mix":i="Производитель и потребитель";break}let n="";e.featured&&(n=`
                <div class="featured status--${e.status}">
                    <i class="fa-solid fa-star"></i>
                    <div class="hover" title="Важный проект"></div>
                </div>
            `);let a=`<img src="${e.icon.url}" ${e.icon.invertible?'class="invertible"':""} loading="lazy">`;return`
            <div class="searchResult">
                <a class="icon" href="${s}">
                    ${a}
                </a>
                
                <div class="infoBlock">
                    <div class="arrows">
                        <div class="bgArrow"></div>
                        <div class="borderArrow"></div>
                    </div>

                    <div class="statusBg status--${e.status}"></div>

                    ${n}

                    <header>
                        <a class="icon" href="${s}">${a}</a>
                        <a class="title" href="${s}">${e.title}</a>
                    </header>

                    <div class="desc">${e.desc}</div>

                    <footer>
                        <img class="type" title="${i}" src="/site/graphics/${e.type}.svg">
                        ${r.length>0?'<i class="fa-solid fa-hashtag"></i>'+r.map(h=>`<div class="tag">${h}</div>`).join(""):""}
                    </footer>
                </div>
            </div>
        `.trim()}},g=self,o=new p,l=new d;onmessage=u=>{let t=u.data;o.whenReady(()=>{if(t.type==="search"){let r=t;l.reInit(o.search(r.text,r.tags))}let e=l.more(),s=new m;s.id=t.id,s.resultHTML=e.map(r=>o.getHtmlProjectById(r)).join(""),s.resultHTML!==""&&l.isEnd&&(s.resultHTML="!"+s.resultHTML),g.postMessage(s)})};})();
