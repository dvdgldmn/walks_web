'use client';

import { useEffect } from 'react';

// Loads the hero background Lottie (self-hosted lottie-web + /assets/animations/welcome.json)
// and applies the same responsive viewBox adjustment the template used. Mascot stays hidden.
export function HeroAnimation() {
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let anim: any = null;

    (async () => {
      const lottie = (await import('lottie-web')).default;
      if (cancelled) return;

      const bgTarget = document.getElementById('hero-anim-target');
      const mascotTarget = document.getElementById('hero-mascot-target');
      if (!bgTarget) return;

      bgTarget.innerHTML = '';
      bgTarget.classList.add('hero__lottie--scene');
      if (mascotTarget) {
        mascotTarget.style.visibility = 'hidden';
      }

      anim = lottie.loadAnimation({
        container: bgTarget,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/assets/animations/welcome.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMin slice',
        },
      });

      anim.addEventListener('DOMLoaded', () => {
        const svg = bgTarget.querySelector('svg');
        if (!svg) return;
        const viewBox = (svg.getAttribute('viewBox') || '')
          .trim()
          .split(/\s+/)
          .map(Number);
        if (viewBox.length !== 4 || viewBox.some((n) => Number.isNaN(n))) return;
        const [x, y, width, height] = viewBox;
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth || 1440;
        let scale = 0.94;
        let liftRatio = 0.2;
        if (viewportWidth <= 380) {
          scale = 0.78;
          liftRatio = -0.15;
        } else if (viewportWidth <= 560) {
          scale = 0.82;
          liftRatio = -0.12;
        } else if (viewportWidth <= 980) {
          scale = 0.88;
          liftRatio = -0.05;
        }
        const expandedWidth = Math.round(width / scale);
        const expandedHeight = Math.round(height / scale);
        const offsetX = Math.round((expandedWidth - width) / 2);
        const offsetY = Math.round((expandedHeight - height) / 2);
        const liftY = Math.round(height * liftRatio);
        svg.setAttribute(
          'viewBox',
          `${x - offsetX} ${y - offsetY + liftY} ${expandedWidth} ${expandedHeight}`,
        );
      });
    })();

    return () => {
      cancelled = true;
      if (anim && typeof anim.destroy === 'function') {
        anim.destroy();
      }
    };
  }, []);

  return null;
}
