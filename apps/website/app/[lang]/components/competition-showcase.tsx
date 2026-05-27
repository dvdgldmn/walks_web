'use client';

import { useMemo, useState } from 'react';
import { renderRichText } from '../../lib/render-rich-text';

type CompetitionItem = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

export function CompetitionShowcase({ items }: { items: CompetitionItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items]);

  return (
    <>
      <div className="smart-desktop">
        <div className="smart-grid">
          {items.map((item, index) => (
            <button
              className={`smart-cell${index === activeIndex ? ' active' : ''}`}
              key={`${item.eyebrow}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <span className="eyebrow">{item.eyebrow}</span>
              <h3>{renderRichText(item.title, `competition-desktop-${index}`)}</h3>
              <p>{item.body}</p>
            </button>
          ))}

          <div className="smart-center">
            <div className="iphone">
              <img alt={activeItem.eyebrow} src={activeItem.image} />
            </div>
          </div>
        </div>
      </div>

      <div className="smart-mobile">
        <div className="smart-mobile__track">
          {items.map((item, index) => (
            <button
              className="smart-mobile__slide"
              key={`${item.eyebrow}-mobile-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <div className={`smart-cell${index === activeIndex ? ' active' : ''}`}>
                <span className="eyebrow">{item.eyebrow}</span>
                <h3>{renderRichText(item.title, `competition-mobile-${index}`)}</h3>
                <p>{item.body}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="smart-mobile__phone">
          <div className="iphone">
            <img alt={activeItem.eyebrow} src={activeItem.image} />
          </div>
        </div>
        <div className="smart-mobile__dots">
            {items.map((item, index) => (
              <button
                aria-label={item.eyebrow}
                className={`smart-mobile__dot${index === activeIndex ? ' is-active' : ''}`}
                key={`${item.eyebrow}-dot-${index}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
        </div>
      </div>
    </>
  );
}
