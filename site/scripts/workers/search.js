(()=>{importScripts("/site/vendor/lzutf8/lzutf8.min.js","/site/vendor/lunr/lunr.min.js","/site/vendor/lunr/lunr-stemmer.min.js","/site/vendor/lunr/lunr-ru.min.js","/site/vendor/lunr/lunr-multi.min.js");var m=class{},l=class{reInit(e){this.ids=e,this.currentI=0}more(){let e=this.ids.length-this.currentI,s=[];return e===0||(e<l.batchSize*3/2?s=this.ids.slice(this.currentI):s=this.ids.slice(this.currentI,this.currentI+l.batchSize),this.currentI+=l.batchSize,this.isEnd=this.currentI>=this.ids.length),s}},o=l;o.batchSize=20;var p=class{constructor(){this.ready=!1;let s=["tagIndex.json.lz","projectIndex.json.lz","results.json.lz"].map(t=>{let r="/site/search/"+t;return fetch(r).then(a=>a.text())});Promise.all(s).then(t=>{this.tagIndex=this.decompress(t[0]),this.tagNumStrIds=Object.keys(this.tagIndex),lunr.multiLanguage("en","ru"),this.projectIndex=lunr.Index.load(this.decompress(t[1])),this.results=this.decompress(t[2]),this.projectNumIds=Object.keys(this.results).map(r=>+r),this.ready=!0,this.pendingCallback&&this.pendingCallback()})}decompress(e){return JSON.parse(LZUTF8.decompress(e,{inputEncoding:"BinaryString"}))}whenReady(e){if(this.ready){e();return}this.pendingCallback=e}search(e,s){let t=[],r=this.projectNumIds;s.forEach(i=>{r=r.filter(n=>this.tagIndex[i].includes(n))});let a;if(e&&e.length>0){let i=e.split(" ").map(n=>n+"~1 "+n+"*").join(" ");a=this.projectIndex.search(i)}else a=this.projectIndex.search("");return a.forEach(i=>{let n=+i.ref;r.includes(n)&&t.push(n)}),t}getHtmlProjectById(e){let s=this.results[e],t="/projects/"+s.id,r="/projects/"+s.id+"/icon."+s.iconExt,a=s.tagIds.map(d=>this.tagNumStrIds[d]),i="";switch(s.type){case"in":i="Потребитель";break;case"out":i="Производитель";break;case"mix":i="Производитель и потребитель";break}return`
            <div class="searchResult">
                <a class="icon" href="${t}">
                    <img src="${r}" loading="lazy">
                </a>
                
                <div class="infoBlock">
                    <div class="arrows">
                        <div class="bgArrow"></div>
                        <div class="borderArrow"></div>
                    </div>

                    <div class="statusBg status--${s.status}"></div>

                    <header>
                        <a class="icon" href="${t}"><img src="${r}" loading="lazy"></a>
                        <a class="title" href="${t}">${s.title}</a>
                    </header>

                    <div class="desc">${s.desc}</div>

                    <footer>
                        <img class="type" title="${i}" src="/site/graphics/${s.type}.svg">
                        ${a.length>0?'<i class="fa-solid fa-hashtag"></i>'+a.map(d=>`<div class="tag">${d}</div>`).join(""):""}
                    </footer>
                </div>
            </div>
        `.trim()}},g=self,h=new p,u=new o;onmessage=c=>{let e=c.data;h.whenReady(()=>{if(e.type==="search"){let r=e;u.reInit(h.search(r.text,r.tags))}let s=u.more(),t=new m;t.id=e.id,t.resultHTML=s.map(r=>h.getHtmlProjectById(r)).join(""),u.isEnd&&(t.resultHTML="!"+t.resultHTML),g.postMessage(t)})};})();
