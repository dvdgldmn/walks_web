import { Fragment } from 'react';
import { PublicTranslation, pickTranslation } from '../../../lib/content';

type Props = { translations: PublicTranslation[] };

const SEPARATORS = ['🐾', '👟', '🥣', '🏅'];

export function LandingMarquee({ translations }: Props) {
  const items = [
    pickTranslation(translations, 'marquee', 'item1', 'WALK. COMPETE. EARN. HELP.'),
    pickTranslation(translations, 'marquee', 'item2', '500KG OF FOOD DELIVERED TO SHELTERS'),
    pickTranslation(translations, 'marquee', 'item3', 'EVERY MONTH'),
    pickTranslation(translations, 'marquee', 'item4', 'EVERY STEP COUNTS'),
  ];

  // Two identical copies for a seamless CSS loop (matches the template).
  const copies = [0, 1];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {copies.map((copy) =>
          items.map((item, index) => (
            <Fragment key={`${copy}-${index}`}>
              <span className="marquee__item">{item}</span>
              <span className="marquee__sep">{SEPARATORS[index]}</span>
            </Fragment>
          )),
        )}
      </div>
    </div>
  );
}
