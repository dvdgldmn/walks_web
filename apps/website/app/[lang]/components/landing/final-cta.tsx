import {
  PublicMediaItem,
  PublicTranslation,
  pickTranslation,
} from '../../../lib/content';
import { renderRichText } from '../../../lib/render-rich-text';

type Props = {
  translations: PublicTranslation[];
  media: PublicMediaItem[];
};

function QrFallback() {
  return (
    <svg viewBox="0 0 21 21" shapeRendering="crispEdges">
      <rect width="21" height="21" fill="#fff" />
      <g fill="#0E0E0E">
        <rect x="0" y="0" width="7" height="7" /><rect x="1" y="1" width="5" height="5" fill="#fff" /><rect x="2" y="2" width="3" height="3" />
        <rect x="14" y="0" width="7" height="7" /><rect x="15" y="1" width="5" height="5" fill="#fff" /><rect x="16" y="2" width="3" height="3" />
        <rect x="0" y="14" width="7" height="7" /><rect x="1" y="15" width="5" height="5" fill="#fff" /><rect x="2" y="16" width="3" height="3" />
        <rect x="8" y="2" width="1" height="1" /><rect x="10" y="0" width="1" height="2" /><rect x="9" y="4" width="1" height="2" /><rect x="11" y="5" width="1" height="2" />
        <rect x="2" y="9" width="1" height="2" /><rect x="4" y="8" width="2" height="1" /><rect x="7" y="9" width="1" height="3" />
        <rect x="9" y="9" width="1" height="1" /><rect x="11" y="8" width="2" height="2" /><rect x="14" y="9" width="1" height="1" /><rect x="16" y="10" width="2" height="1" /><rect x="19" y="9" width="1" height="2" />
        <rect x="3" y="11" width="1" height="2" /><rect x="6" y="11" width="2" height="1" /><rect x="9" y="12" width="2" height="1" /><rect x="13" y="11" width="3" height="1" /><rect x="17" y="13" width="2" height="1" />
        <rect x="8" y="14" width="2" height="2" /><rect x="11" y="15" width="1" height="3" /><rect x="13" y="14" width="2" height="1" /><rect x="16" y="15" width="3" height="1" />
        <rect x="9" y="17" width="1" height="2" /><rect x="12" y="18" width="2" height="1" /><rect x="15" y="17" width="1" height="3" /><rect x="18" y="18" width="2" height="2" />
      </g>
    </svg>
  );
}

export function LandingFinalCta({ translations, media }: Props) {
  const t = (key: string, fallback: string) =>
    pickTranslation(translations, 'download', key, fallback);

  const qrItem = media.find((m) => m.section === 'download' && m.slot === 'qr');
  const qrSrc = qrItem ? `/uploads/${qrItem.filePath}` : null;

  return (
    <section className="final-cta" id="download">
      <div className="wrap">
        <div className="eyebrow eyebrow--on-maroon" style={{ marginBottom: 18 }}>
          {t('eyebrow', 'Get the app · free forever')}
        </div>
        <h2 className="display final-cta__title">
          {renderRichText(t('title', 'Dosty<br><em>Walks.</em>'), 'final-cta-title')}
        </h2>
        <p className="final-cta__sub">
          {renderRichText(
            t('body', 'Free app. No&nbsp;ads inside. Every step turns into real food for Baku shelters.'),
            'final-cta-sub',
          )}
        </p>
        <div className="final-cta__row">
          <div className="final-cta__qr">
            {qrSrc ? (
              <img
                src={qrSrc}
                alt="QR code"
                style={{
                  display: 'block',
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            ) : (
              <QrFallback />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
