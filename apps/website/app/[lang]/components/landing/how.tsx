import { Fragment } from 'react';
import { PublicTranslation, pickTranslation } from '../../../lib/content';
import { renderRichText } from '../../../lib/render-rich-text';

type Props = { translations: PublicTranslation[] };

const STEPS = [
  {
    num: '01',
    disc: 'walk',
    tagKey: 'step1Tag',
    tagFallback: 'Walk',
    titleKey: 'step1Title',
    titleFallback: 'Open<br>the&nbsp;<em>app.</em>',
    bodyKey: 'step1Body',
    bodyFallback:
      'Steps count in&nbsp;the background via phone sensors. No&nbsp;manual tracking, no&nbsp;special equipment.',
  },
  {
    num: '02',
    disc: 'earn',
    tagKey: 'step2Tag',
    tagFallback: 'Earn',
    titleKey: 'step2Title',
    titleFallback: 'Steps&nbsp;=<br><em>coins.</em>',
    bodyKey: 'step2Body',
    bodyFallback:
      'Progress towards daily and seasonal milestones. Weekly chart like familiar fitness apps.',
  },
  {
    num: '03',
    disc: 'donate',
    tagKey: 'step3Tag',
    tagFallback: 'Donate',
    titleKey: 'step3Title',
    titleFallback: '500&nbsp;kg<br><em>to&nbsp;shelter.</em>',
    bodyKey: 'step3Body',
    bodyFallback:
      'At&nbsp;the end of&nbsp;the month, the platform delivers food to&nbsp;shelter. Guaranteed regardless of&nbsp;audience growth.',
  },
];

function Arrow() {
  return (
    <div className="flow__arrow" aria-hidden="true">
      <svg
        viewBox="0 0 64 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12 H58" />
        <polyline points="50,4 58,12 50,20" />
      </svg>
    </div>
  );
}

export function LandingHow({ translations }: Props) {
  const t = (key: string, fallback: string) =>
    pickTranslation(translations, 'how', key, fallback);

  return (
    <section className="band band--white" id="how">
      <div className="wrap">
        <div className="band__head">
          <div className="band__eyebrow">
            <span className="band__num">§ 01</span>
            <span className="eyebrow">{t('eyebrow', 'How it works')}</span>
          </div>
          <span className="eyebrow" style={{ opacity: 0.55 }}>
            {t('note', 'Steps → Coins → Food')}
          </span>
        </div>

        <div className="flow">
          {STEPS.map((step, index) => (
            <Fragment key={step.num}>
              <div className="flow__step">
                <div className={`flow__disc flow__disc--${step.disc}`}>
                  <span className="flow__disc-num">{step.num}</span>
                  <span className="flow__disc-tag">{t(step.tagKey, step.tagFallback)}</span>
                </div>
                <h3 className="flow__title">
                  {renderRichText(t(step.titleKey, step.titleFallback), `how-${step.num}-title`)}
                </h3>
                <p className="flow__body">
                  {renderRichText(t(step.bodyKey, step.bodyFallback), `how-${step.num}-body`)}
                </p>
              </div>
              {index < STEPS.length - 1 ? <Arrow /> : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
