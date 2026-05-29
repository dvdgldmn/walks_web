// Shadow-DOM styles for the §03 mobile carousel.
export const COMPETITION_CAROUSEL_CSS = `
  :host { display:block; width:100%; }
  * { box-sizing:border-box; }
  .track-viewport {
    overflow:hidden;
    padding-top:6px;
  }
  .track {
    display:flex;
    gap:18px;
    padding:0 max(32px, calc((100% - min(320px, calc(100vw - 48px))) / 2)) 4px;
    margin:0 -32px;
    will-change:transform;
    transition:transform .35s cubic-bezier(.2,.7,.2,1);
    user-select:none;
    -webkit-user-select:none;
    touch-action:none;
    cursor:grab;
  }
  .track.is-dragging { transition:none; cursor:grabbing; }
  .slide { flex:0 0 min(320px, calc(100vw - 48px)); }
  .card {
    min-height:248px;
    padding:20px 20px 18px;
    border-radius:28px;
    background:rgba(255,255,255,.04);
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    opacity:.38;
    transform:translateY(10px);
    transition:opacity .28s ease, transform .28s ease, background .28s ease, box-shadow .28s ease;
  }
  .card.active {
    opacity:1;
    transform:translateY(0);
    background:rgba(255,255,255,.1);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
  }
  .eyebrow {
    color:rgba(255,255,255,.42);
    font-size:13px;
    margin-bottom:18px;
    font-family:Inter, system-ui, sans-serif;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.02em;
  }
  .card.active .eyebrow { color:rgba(255,255,255,.56); }
  h3 {
    font-family:var(--display-font), Impact, sans-serif;
    font-size:clamp(44px, 12vw, 72px);
    text-transform:uppercase;
    line-height:.88;
    letter-spacing:-1.2px;
    margin:0 0 18px;
    color:#fff;
    font-weight:400;
    max-width:6.8ch;
  }
  h3 em { font-style:normal; color:#F5C842; }
  p {
    font-size:15px;
    line-height:1.48;
    color:rgba(255,255,255,.46);
    margin:0;
    font-family:Inter, system-ui, sans-serif;
    max-width:16.5rem;
  }
  .card.active p {
    color:rgba(255,255,255,.68);
  }
  .dots {
    display:flex;
    justify-content:center;
    align-items:center;
    gap:8px;
    margin:18px 0 0;
    font-size:0;
    line-height:0;
    -webkit-tap-highlight-color:transparent;
    user-select:none;
    -webkit-user-select:none;
  }
  .dot {
    width:8px;
    height:8px;
    border-radius:999px;
    background:rgba(255,255,255,.12);
    display:inline-block;
    transition:background .25s, width .25s;
    touch-action:none;
  }
  .dot.active { width:22px; background:#F5C842; }
  .phone-wrap {
    display:flex;
    justify-content:center;
    pointer-events:none;
  }
  .phone {
    width:280px;
    background:#0A0A0A;
    border-radius:48px;
    padding:12px;
    box-shadow:
      0 0 0 2px rgba(255,255,255,.04),
      0 40px 80px -20px rgba(0,0,0,.7),
      0 12px 28px -8px rgba(0,0,0,.5);
  }
  .screen {
    display:block;
    width:100%;
    aspect-ratio:9 / 19.5;
    object-fit:cover;
    object-position:top center;
    border-radius:38px;
    transition:opacity .25s ease;
  }
  .screen.swap { opacity:0; }
  @media (max-width:560px) {
    .track {
      padding:0 max(32px, calc((100% - min(320px, calc(100vw - 48px))) / 2)) 4px;
      margin:0 -32px;
    }
    .phone { width:280px; }
  }
  @media (max-width:420px) {
    .track { gap:14px; }
    /* Narrower than viewport so the next card's edge peeks on the right (~35-45px hint). */
    .slide { flex-basis:calc(100vw - 100px); max-width:calc(100vw - 100px); }
    .card {
      min-height:224px;
      padding:18px 18px 16px;
    }
    .eyebrow {
      font-size:12px;
      margin-bottom:16px;
    }
    h3 {
      font-size:clamp(38px, 11vw, 56px);
      margin-bottom:16px;
    }
    p {
      font-size:14px;
      max-width:15.5rem;
    }
  }
`;
