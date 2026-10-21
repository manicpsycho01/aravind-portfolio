export const PRELOAD_KEY = "as-preloaded";

/** Inline, render-blocking: flags the first visit so the preloader shows before paint. */
export const PRELOAD_SCRIPT = `try{if(!sessionStorage.getItem("${PRELOAD_KEY}")&&matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.setAttribute("data-preload","")}catch(e){}`;
