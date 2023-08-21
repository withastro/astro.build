import{g as n}from"./dom.54c34b5f.js";const o=10;for(const e of n("[data-marquee]",HTMLElement))new ResizeObserver(([t])=>{e.style.animationDuration=`${t.contentRect.width/o}s`}).observe(e);
