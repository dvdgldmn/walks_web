import {
  PublicMediaItem,
  PublicTranslation,
  pickTranslation,
} from '../../../lib/content';
import { renderRichText } from '../../../lib/render-rich-text';
import { landingMediaSrc } from './landing-media';

type Props = {
  translations: PublicTranslation[];
  media: PublicMediaItem[];
};

export function LandingSeason({ translations, media }: Props) {
  const t = (key: string, fallback: string) =>
    pickTranslation(translations, 'season', key, fallback);

  const phoneSrc = landingMediaSrc(
    media,
    'season',
    'phone',
    '/assets/brand/ui-milestone-path.png',
  );

  return (
    <section className="band band--pink" id="season">
      <div className="wrap">
        <div className="band__head">
          <div className="band__eyebrow">
            <span className="band__num">§ 04</span>
            <span className="eyebrow">{t('eyebrow', 'Season Pass')}</span>
          </div>
          <span className="eyebrow" style={{ opacity: 0.55 }}>
            {t('note', '90 days · ~30 milestones')}
          </span>
        </div>

        <div className="duo duo--reverse">
          <div className="duo__phone">
            <img
              className="duo__phone-img"
              src={phoneSrc}
              alt="Season game path with milestones and rewards"
            />
          </div>
          <div>
            <h2 className="display duo__title">
              {renderRichText(
                t('title', 'Season —<br><em>90 days.</em><br>Join in.'),
                'season-title',
              )}
            </h2>
            <p className="duo__body" style={{ color: 'rgba(0,0,0,.75)' }}>
              {renderRichText(
                t(
                  'body',
                  'Rolling seasons: join whenever you like — while the season is&nbsp;live. ~30&nbsp;milestones with reward unlocks. Pro subscription unlocks premium rewards but&nbsp;<strong>gives no&nbsp;speed advantage</strong>. Impact is&nbsp;fair for everyone.',
                ),
                'season-body',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
