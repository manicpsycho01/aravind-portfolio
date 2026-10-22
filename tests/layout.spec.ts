import { expect, test } from "@playwright/test";

/**
 * Layout audit across the screen-size matrix (phones, landscape phone, tablets, laptops, desktops) on
 * every page, with animations off so the final layout is measured: no sideways overflow, no text off
 * screen or overlapping other text, nothing under 10.5px, 44px touch targets, the whole name on the
 * first screen, and the next section kept off the first screen. Runs once (in the desktop project).
 */
const VIEWPORTS = [[320,568,1],[360,740,1],[390,844,1],[393,852,1],[430,932,1],[844,390,1],[768,1024,1],[820,1180,1],[1024,768,0],[1024,1366,1],[1280,600,0],[1280,800,0],[1366,768,0],[1440,900,0],[1536,864,0],[1920,1080,0],[2560,1440,0]] as const;
const PAGES = ["/", "/work/tagmycredit", "/work/crew-ops-advisor", "/work/fridgemate-ai", "/nope"];

for (const [w, h, touch] of VIEWPORTS) {
  test(`layout audit ${w}x${h}`, async ({ browser }, info) => {
    test.skip(info.project.name !== "desktop", "the matrix sets its own viewports");
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: !!touch, isMobile: !!touch && w < 1024, reducedMotion: "reduce", baseURL: info.project.use.baseURL });
    const issues: string[] = [];
    for (const path of PAGES) {
      const p = await ctx.newPage();
      await p.goto(path, { waitUntil: "networkidle" });
      await p.waitForTimeout(300);
      const r: string[] = await p.evaluate(({w,h,touch,path}) => {
      const out=[]; const vw=document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth>vw+1) out.push(`page overflow ${document.documentElement.scrollWidth}>${vw}`);
      const clippedByAncestor = (el)=>{ let p=el.parentElement; while(p&&p!==document.body){ const o=getComputedStyle(p); if(["hidden","clip","auto","scroll"].includes(o.overflowX)) return true; p=p.parentElement;} return false; };
      const hidden=(el)=>{ for(let e=el;e;e=e.parentElement){ const s=getComputedStyle(e); if(s.display==="none"||s.visibility==="hidden"||+s.opacity===0||e.getAttribute?.("aria-hidden")==="true") return true;} return false; };
      const inFixed=(el)=>{ for(let e=el;e;e=e.parentElement){ if(getComputedStyle(e).position==="fixed") return true;} return false; };
      const leaves=[...document.querySelectorAll("body *")].filter(el=>[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1));
      const vis=[];
      for (const el of leaves){
        if (hidden(el)) continue;
        const r=el.getBoundingClientRect(); if(r.width<=2||r.height<=2) continue;
        const fs=parseFloat(getComputedStyle(el).fontSize);
        const txt=el.textContent.trim().slice(0,40);
        if (fs<10.5) out.push(`tiny text ${fs}px "${txt}"`);
        if ((r.right>vw+1||r.left<-1) && !clippedByAncestor(el) && !inFixed(el)) out.push(`offscreen x ${Math.round(r.left)}..${Math.round(r.right)} "${txt}"`);
        if (!inFixed(el) && !el.closest("[aria-roledescription=carousel],.marquee,[data-marquee]")) vis.push({el,r:{l:r.left,t:r.top+scrollY,ri:r.right,b:r.bottom+scrollY},txt});
      }
      // overlaps between unrelated visible text boxes (use text range rects for precision)
      const boxes=vis.map(v=>{ const rg=document.createRange(); rg.selectNodeContents(v.el); const rs=[...rg.getClientRects()].filter(x=>x.width>1&&x.height>1).map(x=>({l:x.left,t:x.top+scrollY+x.height*0.3,ri:x.right,b:x.bottom+scrollY-x.height*0.3})); return {...v,rs}; });
      for (let i=0;i<boxes.length;i++) for (let j=i+1;j<boxes.length;j++){
        const A=boxes[i],B=boxes[j]; if(A.el.contains(B.el)||B.el.contains(A.el)) continue;
        let hit=false;
        for(const a of A.rs) for(const c of B.rs){ const ox=Math.min(a.ri,c.ri)-Math.max(a.l,c.l), oy=Math.min(a.b,c.b)-Math.max(a.t,c.t); if(ox>3&&oy>3) hit=true; }
        if(hit) out.push(`overlap "${A.txt}" × "${B.txt}"`);
      }
      if (touch) for (const el of document.querySelectorAll("a,button")) {
        if (hidden(el)) continue; const r=el.getBoundingClientRect(); if(!r.width) continue;
        if (el.closest("p")) continue; if (/skip to content/i.test(el.textContent)) continue; if (el.matches("[aria-label$=home]")) continue;
        if (r.height<43.5 && r.width<43.5 || r.height<43.5 && !el.closest("[aria-roledescription=carousel]")) out.push(`small target ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute("aria-label")||el.textContent).trim().slice(0,30)}"`);
      }
      if (path==="/") { const man=document.querySelector("#about"); if (man && man.getBoundingClientRect().top < h - 1) out.push(`next section visible on first screen at ${Math.round(man.getBoundingClientRect().top)}`); const ls=[...document.querySelectorAll("h1 [data-line]")]; const last=ls.at(-1).getBoundingClientRect(); const right=Math.max(...ls.map(l=>l.getBoundingClientRect().right));
        if (right>vw) out.push(`name wider than screen ${Math.round(right)}`); if (w>=768 && h>=500 && last.bottom>h) out.push(`name below fold ${Math.round(last.bottom)}>${h}`); }
      return [...new Set(out)];
    }, { w, h, touch, path });
      issues.push(...r.map((x) => `${path}: ${x}`));
      await p.close();
    }
    await ctx.close();
    expect(issues).toEqual([]);
  });
}
