import {
  PublicMediaItem,
  PublicTranslation,
  pickTranslation,
} from '../../../lib/content';
import { renderRichText } from '../../../lib/render-rich-text';
import { landingMediaSrc } from './landing-media';
import { CompetitionInteractive } from './competition-interactive';

type Props = {
  translations: PublicTranslation[];
  media: PublicMediaItem[];
};

const CELLS = [
  {
    key: 'leaderboard',
    cellClass: 'smart-cell--tl',
    slot: 'screen-1',
    screenFallback: '/assets/brand/ui-leaderboard.png',
    eyebrowFallback: 'Leaderboard',
    titleFallback: 'Race<br>in&nbsp;<em>real</em><br>time.',
    bodyFallback:
      "Nationwide leaderboard. See your position every second — and who&apos;s leading in&nbsp;Baku.",
  },
  {
    key: 'groups',
    cellClass: 'smart-cell--tr',
    slot: 'screen-2',
    screenFallback: '/assets/brand/ui-hero-phone.png',
    eyebrowFallback: 'Groups',
    titleFallback: 'Teams and<br><em>companies.</em>',
    bodyFallback:
      'Create a&nbsp;private group — friends, colleagues, corporate team. Compete within your circle.',
  },
  {
    key: 'recognition',
    cellClass: 'smart-cell--bl',
    slot: 'screen-3',
    screenFallback: '/assets/brand/ui-milestone-path.png',
    eyebrowFallback: 'Recognition',
    titleFallback: 'Month.<br>Season.<br><em>Year.</em>',
    bodyFallback:
      'Each period brings its own recognition. From daily streaks to&nbsp;annual awards and a&nbsp;publicly verified top.',
  },
  {
    key: 'habit',
    cellClass: 'smart-cell--br',
    slot: 'screen-4',
    screenFallback: '/assets/brand/ui-stack.png',
    eyebrowFallback: 'Habit',
    titleFallback: 'Not a&nbsp;<em>campaign</em>—<br>a habit.',
    bodyFallback:
      'Game mechanics embedded in&nbsp;daily behavior. You return effortlessly, continue without reminders.',
  },
] as const;

export function LandingCompetition({ translations, media }: Props) {
  const c = (key: string, fallback: string) =>
    pickTranslation(translations, 'competition', key, fallback);

  const screens = CELLS.map((cell, i) => {
    const n = i + 1;
    return {
      key: cell.key,
      screenUrl: landingMediaSrc(media, 'competition', cell.slot, cell.screenFallback),
      eyebrow: c(`card${n}Eyebrow`, cell.eyebrowFallback),
      title: c(`card${n}Title`, cell.titleFallback),
      copy: c(`card${n}Body`, cell.bodyFallback),
    };
  });

  return (
    <section className="band band--ink">
      <div className="wrap">
        <div className="band__head">
          <div className="band__eyebrow">
            <span className="band__num">§ 03</span>
            <span className="eyebrow eyebrow--on-dark">
              {c('eyebrow', 'Live competition engine')}
            </span>
          </div>
          <span className="eyebrow eyebrow--on-dark">{c('note', 'Walk. Compete. Help.')}</span>
        </div>

        <div className="smart-desktop">
          <div className="smart-grid">
            {CELLS.map((cell, i) => (
              <div
                key={cell.key}
                className={`smart-cell ${cell.cellClass}${i === 0 ? ' active' : ''}`}
                data-screen={cell.key}
              >
                <span className="eyebrow">{screens[i].eyebrow}</span>
                <h3>{renderRichText(screens[i].title, `comp-${cell.key}-title`)}</h3>
                <p>{renderRichText(screens[i].copy, `comp-${cell.key}-copy`)}</p>
              </div>
            ))}

            <div className="smart-center">
              <div className="iphone">
                <img
                  className="iphone__screen"
                  src={screens[0].screenUrl}
                  alt="Dosty Walks app screen"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="smart-mobile" aria-label="Live competition mobile carousel">
          <div className="smart-mobile-host" id="smartMobileHost" />
        </div>
      </div>

      <CompetitionInteractive screens={screens} />
    </section>
  );
}
