(()=>{var o=class{constructor(t,a){this.button=t,this.target=a,(this.button.hasAttribute("data-toggled")||this.target.hasAttribute("data-toggled"))&&this.setState(!0,!0),this.button.addEventListener("click",e=>{this.clickCallback&&!this.clickCallback(e,this)||this.setState(!this.state)})}setState(t,a=!1){this.state=t,t?[this.button,this.target].forEach(e=>e.setAttribute("data-toggled","")):[this.button,this.target].forEach(e=>e.removeAttribute("data-toggled")),a||this.changeCallback&&this.changeCallback(this.state,this)}};window.addEventListener("load",()=>{document.querySelectorAll("main > .blocks > .block").forEach(l=>{let t=l.querySelector("header > .showBtn"),a=l.querySelector(".contentContainer"),e=new o(t,a);e.changeCallback=i=>{let s=i?"eye-slash":"eye",g=i?"Скрыть подробности":"Раскрыть подробности";t.querySelector("i").className=`fa-solid fa-${s}`,t.setAttribute("title",g)}})});})();