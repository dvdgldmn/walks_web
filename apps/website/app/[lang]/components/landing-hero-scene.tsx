'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

function getSceneTuning(viewportWidth: number) {
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

  return { scale, liftRatio };
}

function tuneSvgViewBox(container: HTMLDivElement) {
  const svg = container.querySelector('svg');
  if (!svg) {
    return;
  }

  const viewBox = (svg.getAttribute('viewBox') || '')
    .trim()
    .split(/\s+/)
    .map(Number);

  if (viewBox.length !== 4 || viewBox.some((n) => Number.isNaN(n))) {
    return;
  }

  const [x, y, width, height] = viewBox;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1440;
  const { scale, liftRatio } = getSceneTuning(viewportWidth);
  const expandedWidth = Math.round(width / scale);
  const expandedHeight = Math.round(height / scale);
  const offsetX = Math.round((expandedWidth - width) / 2);
  const offsetY = Math.round((expandedHeight - height) / 2);
  const liftY = Math.round(height * liftRatio);

  svg.setAttribute(
    'viewBox',
    `${x - offsetX} ${y - offsetY + liftY} ${expandedWidth} ${expandedHeight}`,
  );
}

export function LandingHeroScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    animationRef.current?.destroy();
    container.innerHTML = '';

    const animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/animations/welcome.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMin slice',
      },
    });

    animationRef.current = animation;

    const applyViewBox = () => tuneSvgViewBox(container);
    animation.addEventListener('DOMLoaded', applyViewBox);
    window.addEventListener('resize', applyViewBox);

    return () => {
      window.removeEventListener('resize', applyViewBox);
      animation.removeEventListener('DOMLoaded', applyViewBox);
      animation.destroy();
    };
  }, []);

  return <div aria-hidden="true" className="hero__lottie hero__lottie--scene" ref={containerRef} />;
}
