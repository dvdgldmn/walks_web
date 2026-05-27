'use client';

export default function AdminHomePage() {
  return (
    <main className="page-wrap">
      <div className="page-head">
        <h1>Dosty Walks Admin</h1>
        <p>Core CMS for translations, media, legal pages, and global settings.</p>
      </div>
      <div className="grid-4">
        {[
          ['Translations', 'AZ / EN texts by section'],
          ['Media', 'Images, QR, and section assets'],
          ['Pages', 'Privacy Policy and Terms of Use'],
          ['Settings', 'Logo, SEO, socials, store links'],
        ].map(([title, text]) => (
          <div className="panel" key={title}>
            <h2>{title}</h2>
            <p className="muted">{text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
