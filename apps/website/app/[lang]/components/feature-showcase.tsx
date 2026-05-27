'use client';

import { useMemo, useState } from 'react';
import { renderRichText } from '../../lib/render-rich-text';

type FeatureItem = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

export function FeatureShowcase({ items }: { items: FeatureItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items]);

  return (
    <div className="feature-showcase">
      <div className="feature-grid">
        {items.map((item, index) => (
          <button
            key={item.title}
            className={`feature-card${index === activeIndex ? ' is-active' : ''}`}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span className="feature-card__eyebrow">{item.eyebrow}</span>
            <strong className="feature-card__title">
              {renderRichText(item.title, `feature-${index}`)}
            </strong>
            <span className="feature-card__body">{item.body}</span>
          </button>
        ))}
      </div>
      <div className="feature-phone">
        <img alt={activeItem.eyebrow} src={activeItem.image} />
      </div>
    </div>
  );
}
