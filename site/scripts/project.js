(()=>{var n=class{constructor(t,e){this.button=t,this.target=e,(this.button.hasAttribute("data-toggled")||this.target.hasAttribute("data-toggled"))&&this.setState(!0,!0),this.button.addEventListener("click",l=>{this.clickCallback&&!this.clickCallback(l,this)||this.setState(!this.state)})}setState(t,e=!1){this.state=t,t?[this.button,this.target].forEach(l=>l.setAttribute("data-toggled","")):[this.button,this.target].forEach(l=>l.removeAttribute("data-toggled")),e||this.changeCallback&&this.changeCallback(this.state,this)}};var s=class{constructor(t){if(!t)return;let e,l=()=>e/50,o;function i(){let r=t.scrollLeft,g=l(),c=o-t.scrollLeft,h=g>=Math.abs(c)?c:Math.sign(c)*g;t.scrollBy(h,0),h!==c&&(r===t.scrollLeft||t.scrollLeft===o||requestAnimationFrame(i))}t.addEventListener("wheel",r=>{r.preventDefault(),e=t.scrollWidth-t.clientWidth,o=Math.min(e,Math.max(0,t.scrollLeft+r.deltaY)),requestAnimationFrame(i)})}};window.addEventListener("load",()=>{document.querySelectorAll("main > .blocks > .block").forEach(a=>{let t=a.querySelector("header > .showBtn"),e=a.querySelector(".contentContainer"),l=new n(t,e);l.changeCallback=o=>{let i=o?"eye-slash":"eye",r=o?"Скрыть подробности":"Раскрыть подробности";t.querySelector("i").className=`fa-solid fa-${i}`,t.setAttribute("title",r)}}),new s(document.querySelector(".mainBlock > .mainBar > .facts")),new s(document.querySelector(".mainBlock > .links")),document.querySelectorAll("[data-pswp-gallery]").forEach(a=>new s(a))});})();