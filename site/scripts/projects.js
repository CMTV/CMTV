(()=>{var n=class{constructor(e,s){this.button=e,this.target=s,(this.button.hasAttribute("data-toggled")||this.target.hasAttribute("data-toggled"))&&this.setState(!0,!0),this.button.addEventListener("click",t=>{this.clickCallback&&!this.clickCallback(t,this)||this.setState(!this.state)})}setState(e,s=!1){this.state=e,e?[this.button,this.target].forEach(t=>t.setAttribute("data-toggled","")):[this.button,this.target].forEach(t=>t.removeAttribute("data-toggled")),s||this.changeCallback&&this.changeCallback(this.state,this)}};var c;(function(s){s.Search="search",s.More="more"})(c||(c={}));var g=class{},d=class extends g{constructor(){super(...arguments);this.type=c.Search}},u=class extends g{constructor(){super(...arguments);this.type=c.More}},f=class{constructor(e){this.RID=0;this.worker=new Worker("/site/scripts/workers/search.js"),this.worker.addEventListener("message",s=>{let t=s.data;t.id===this.RID&&e(t.resultHTML)})}requestSearch(e,s){let t=new d;t.id=++this.RID,t.text=e,t.tags=s,this.worker.postMessage(t)}requestMore(){let e=new u;e.id=++this.RID,this.worker.postMessage(e)}},p=class{constructor(){this.root=document.querySelector("main > .search"),this.input=this.root.querySelector(".main > input"),this.filterBtn=this.root.querySelector(".filterBtn"),this.filterPane=this.root.querySelector(".filter"),this.filterEmpty=this.filterPane.querySelector(".emptyFilter"),this.selectPane=this.root.querySelector(".tags"),this.setupTagTypeUi();let e,s;this.input.addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{this.value=this.input.value.trim(),this.value!==s&&this.triggerSearchUpdate(),s=this.value},200)}),this.filterTags=[],this.filterBtn.addEventListener("click",()=>{this.root.classList.contains("_selectTags")?(this.root.classList.remove("_selectTags"),this.filterPane.children.length===1&&this.root.classList.remove("_filterTags")):this.root.classList.add("_filterTags","_selectTags")}),this.tagMap={},this.selectPane.querySelectorAll(".tag[data-id]").forEach(t=>{let a=t.getAttribute("data-id");this.tagMap[a]=t,t.addEventListener("click",()=>this.updateFilterTags(a,t.classList.contains("_selected")?"remove":"add"))})}updateFilterTags(e,s){if(!(s==="add"&&this.filterTags.includes(e))&&!(s==="remove"&&!this.filterTags.includes(e))){if(s==="add"){let t=document.createElement("div");t.classList.add("filterTag"),t.setAttribute("data-id",e),t.innerHTML=e,t.addEventListener("click",()=>this.updateFilterTags(e,"remove")),this.filterTags.push(e),this.filterPane.appendChild(t)}s==="remove"&&(this.filterTags=this.filterTags.filter(t=>t!==e),this.filterPane.querySelector(`[data-id="${e}"]`).remove()),this.tagMap[e].classList.toggle("_selected",s==="add"),this.triggerSearchUpdate(),this.filterTags.length===0?(this.filterPane.querySelectorAll(":not(.emptyFilter)").forEach(t=>t.remove()),this.filterEmpty.removeAttribute("style"),this.root.classList.contains("_selectTags")||this.root.classList.remove("_filterTags")):this.filterEmpty.setAttribute("style","display: none")}}triggerSearchUpdate(){this.onSearchUpdate(this.value,this.filterTags)}setupTagTypeUi(){let e=[];this.selectPane.querySelectorAll(".tagType").forEach(i=>{let r=i.getAttribute("data-type"),o=this.selectPane.querySelector(`.tagTypePane[data-type="${r}"]`),h=new n(i,o);h.clickCallback=()=>(e.forEach(T=>T.setState(!1)),!0),e.push(h)});let s=this.selectPane.querySelector('.tagType[data-type="other"]'),t=this.selectPane.querySelector(".categories"),a=[];a.push(new n(s,t)),this.selectPane.querySelectorAll(".categories .category").forEach(i=>{let r=i.getAttribute("data-cat-id"),o=this.selectPane.querySelector(`.categoryPane[data-cat-id="${r}"]`);o.querySelector("header > i").addEventListener("click",()=>a[0].button.click()),a.push(new n(i,o))}),a.forEach(i=>{i.clickCallback=()=>(a.forEach(r=>r.setState(!1)),!0)})}},m=class{constructor(){this.searching=document.querySelector("main > .searching"),this.searchFailed=document.querySelector("main > .searchFailed"),this.results=document.querySelector("main > .searchResults")}toggleLoading(e){this.searching.classList.toggle("_showing",e)}toggleFailed(e){this.searchFailed.classList.toggle("_showing",e)}clearResults(){this.results.innerHTML=""}addResult(e){this.results.innerHTML+=e,e&&e.length>0&&this.shouldLoadMore()}shouldLoadMore(){return(document.documentElement.scrollTop+window.innerHeight)/document.documentElement.scrollHeight>=.8}};window.addEventListener("load",()=>{let l=!1,e=INITIAL_END||!1,s=new p,t=new m,a=new f(r=>{l=!1,t.toggleLoading(!1),e=r.charAt(0)==="!",r!==""?(e&&(r=r.substring(1)),t.addResult(r),e||i()):t.results.innerHTML===""&&t.toggleFailed(!0)});document.addEventListener("scroll",i),document.addEventListener("resize",i),i(),s.onSearchUpdate=(r,o)=>{t.toggleFailed(!1),t.toggleLoading(!0),t.clearResults(),a.requestSearch(r,o)};function i(){!e&&!l&&t.shouldLoadMore()&&(l=!0,t.toggleLoading(!0),a.requestMore())}});})();