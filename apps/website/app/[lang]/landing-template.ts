import { cache } from 'react';
import { readFileSync } from 'fs';
import path from 'path';

type LandingTemplateParts = {
  styles: string;
  markup: string;
  scripts: string[];
};

const LANDING_TEMPLATE_PATH = path.join(
  process.cwd(),
  'public',
  'landing-template.html',
);

function extractBody(html: string) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) {
    throw new Error('Landing template body not found');
  }

  return match[1];
}

function extractStyles(html: string) {
  const match = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!match) {
    throw new Error('Landing template styles not found');
  }

  return match[1];
}

function extractExecutableScripts(body: string) {
  const scripts: string[] = [];

  const markup = body.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (fullMatch, rawAttrs = '', scriptContent = '') => {
      const attrs = String(rawAttrs);
      const hasSrc = /\bsrc\s*=/.test(attrs);
      const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
      const type = (typeMatch?.[1] || '').trim().toLowerCase();

      if (hasSrc || type === 'application/json') {
        return fullMatch;
      }

      scripts.push(String(scriptContent).trim());
      return '';
    },
  );

  return {
    markup,
    scripts,
  };
}

export const getLandingTemplateParts = cache((): LandingTemplateParts => {
  const html = readFileSync(LANDING_TEMPLATE_PATH, 'utf8');
  const styles = extractStyles(html);
  const body = extractBody(html);
  const { markup, scripts } = extractExecutableScripts(body);

  return {
    styles,
    markup,
    scripts,
  };
});
