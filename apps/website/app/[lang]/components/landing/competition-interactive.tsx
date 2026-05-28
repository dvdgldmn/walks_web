'use client';

import { useEffect } from 'react';
import { COMPETITION_CAROUSEL_CSS } from './competition-carousel-style';

type Screen = {
  key: string;
  screenUrl: string;
  eyebrow: string;
  title: string;
  copy: string;
};

// Ports the template's §03 behaviour: desktop screen switcher + mobile drag carousel
// (Shadow DOM), driven by the CMS-resolved `screens` passed from the server component.
export function CompetitionInteractive({ screens }: { screens: Screen[] }) {
  useEffect(() => {
    const screenMap: Record<string, string> = {};
    screens.forEach((s) => {
      screenMap[s.key] = s.screenUrl;
    });

    const setPhoneScreen = (phone: HTMLImageElement | null, key: string) => {
      if (!phone || !screenMap[key]) return;
      const next = screenMap[key];
      const tail = next.split('/').pop() || next;
      if (phone.src.endsWith(tail)) return;
      phone.classList.add('swap');
      window.setTimeout(() => {
        phone.src = next;
        phone.classList.remove('swap');
      }, 180);
    };

    // ---- Desktop switcher ----
    const desktopRoot = document.querySelector('.smart-desktop');
    const desktopCards = desktopRoot
      ? Array.from(desktopRoot.querySelectorAll<HTMLElement>('.smart-cell'))
      : [];
    const desktopPhone = desktopRoot
      ? desktopRoot.querySelector<HTMLImageElement>('.iphone__screen')
      : null;

    const activateDesktop = (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, desktopCards.length - 1));
      desktopCards.forEach((card, i) => card.classList.toggle('active', i === nextIndex));
      if (desktopCards[nextIndex]) {
        setPhoneScreen(desktopPhone, desktopCards[nextIndex].dataset.screen || '');
      }
    };

    const desktopHandlers: Array<[HTMLElement, () => void]> = [];
    desktopCards.forEach((card, index) => {
      const handler = () => activateDesktop(index);
      card.addEventListener('click', handler);
      desktopHandlers.push([card, handler]);
    });
    activateDesktop(0);

    // ---- Mobile carousel (Shadow DOM) ----
    const mobileRoot = document.querySelector('.smart-mobile');
    const mobileHost = document.getElementById('smartMobileHost');
    let resizeHandler: (() => void) | null = null;
    let resizeTimer: number | undefined;
    let settleTimer: number | undefined;

    if (mobileRoot && mobileHost) {
      const shadow = mobileHost.shadowRoot || mobileHost.attachShadow({ mode: 'open' });
      const slidesHtml = screens
        .map(
          (item, index) => `
            <div class="slide">
              <div class="card${index === 0 ? ' active' : ''}" data-index="${index}" data-key="${item.key}">
                <div class="eyebrow">${item.eyebrow}</div>
                <h3>${item.title}</h3>
                <p>${item.copy}</p>
              </div>
            </div>`,
        )
        .join('');
      const dotsHtml = screens
        .map(
          (_, index) =>
            `<span class="dot${index === 0 ? ' active' : ''}" data-index="${index}"></span>`,
        )
        .join('');

      shadow.innerHTML = `
        <style>${COMPETITION_CAROUSEL_CSS}</style>
        <div class="track-viewport">
          <div class="track">${slidesHtml}</div>
        </div>
        <div class="phone-wrap">
          <div class="phone">
            <img class="screen" src="${screens[0]?.screenUrl ?? ''}" alt="Dosty Walks app screen">
          </div>
        </div>
        <div class="dots">${dotsHtml}</div>
      `;

      const track = shadow.querySelector<HTMLElement>('.track');
      const slides = Array.from(shadow.querySelectorAll<HTMLElement>('.slide'));
      const cards = Array.from(shadow.querySelectorAll<HTMLElement>('.card'));
      const dots = Array.from(shadow.querySelectorAll<HTMLElement>('.dot'));
      const screen = shadow.querySelector<HTMLImageElement>('.screen');

      let mobileIndex = 0;
      let dragActive = false;
      let dragStartX = 0;
      let dragStartTranslate = 0;
      let currentTranslate = 0;

      const activateMobile = (index: number) => {
        const nextIndex = Math.max(0, Math.min(index, cards.length - 1));
        mobileIndex = nextIndex;
        cards.forEach((card, i) => card.classList.toggle('active', i === nextIndex));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === nextIndex));
        setPhoneScreen(screen, screens[nextIndex].key);
      };

      const getTrackOffset = (index: number) => {
        const slide = slides[index];
        if (!slide || !track) return 0;
        return Math.max((track.clientWidth - slide.offsetWidth) / 2, 0) - slide.offsetLeft;
      };

      const applyTrackPosition = (x: number, immediate: boolean) => {
        currentTranslate = x;
        if (!track) return;
        track.classList.toggle('is-dragging', !!immediate);
        track.style.transform = `translate3d(${x}px, 0, 0)`;
        if (immediate) requestAnimationFrame(() => track.classList.remove('is-dragging'));
      };

      const getClosestIndex = (x: number) => {
        let bestIndex = 0;
        let bestDistance = Infinity;
        slides.forEach((_, index) => {
          const distance = Math.abs(getTrackOffset(index) - x);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
          }
        });
        return bestIndex;
      };

      const settleMobile = (targetIndex: number | undefined, immediate: boolean) => {
        if (settleTimer) clearTimeout(settleTimer);
        const nextIndex =
          typeof targetIndex === 'number' ? targetIndex : getClosestIndex(currentTranslate);
        applyTrackPosition(getTrackOffset(nextIndex), !!immediate);
        settleTimer = window.setTimeout(() => activateMobile(nextIndex), 180);
      };

      dots.forEach((dot, index) => {
        const activateDot = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof (e as Event & { stopImmediatePropagation?: () => void })
            .stopImmediatePropagation === 'function') {
            (e as Event & { stopImmediatePropagation: () => void }).stopImmediatePropagation();
          }
          settleMobile(index, false);
          return false;
        };
        dot.addEventListener('pointerdown', activateDot);
        dot.addEventListener('touchstart', activateDot, { passive: false });
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      if (track) {
        track.addEventListener('pointerdown', (e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          dragActive = true;
          dragStartX = e.clientX;
          dragStartTranslate = currentTranslate;
          if (track.setPointerCapture) track.setPointerCapture(e.pointerId);
          e.preventDefault();
        });
        track.addEventListener('pointermove', (e) => {
          if (!dragActive) return;
          applyTrackPosition(dragStartTranslate + (e.clientX - dragStartX), true);
          e.preventDefault();
        });
        const stopTrackDrag = (e: PointerEvent) => {
          if (!dragActive) return;
          dragActive = false;
          if (track.releasePointerCapture) {
            try {
              track.releasePointerCapture(e.pointerId);
            } catch {
              /* noop */
            }
          }
          settleMobile(undefined, false);
        };
        track.addEventListener('pointerup', stopTrackDrag);
        track.addEventListener('pointercancel', stopTrackDrag);
        track.addEventListener('pointerleave', stopTrackDrag);
      }

      activateMobile(0);
      requestAnimationFrame(() => settleMobile(0, true));

      resizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          activateDesktop(0);
          activateMobile(mobileIndex);
          settleMobile(mobileIndex, true);
        }, 120);
      };
      window.addEventListener('resize', resizeHandler);
    }

    return () => {
      desktopHandlers.forEach(([card, handler]) => card.removeEventListener('click', handler));
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (settleTimer) clearTimeout(settleTimer);
      if (mobileHost && mobileHost.shadowRoot) {
        mobileHost.shadowRoot.innerHTML = '';
      }
    };
  }, [screens]);

  return null;
}
