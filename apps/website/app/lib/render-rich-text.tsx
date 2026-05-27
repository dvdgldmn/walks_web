import { ReactNode } from 'react';

function normalizeLegacyMarkup(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/nbsp;/gi, ' ')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/span class="[^"]*"/gi, '')
    .replace(/\/spanbr/gi, '<br>')
    .replace(/\/span/gi, '')
    .replace(/spanbr/gi, '<br>')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/(^|[\s>])br(?=$|[\s<])/gi, '$1\n')
    .replace(/(^|[\s>])em([^<>\n]+?)\/em(?=$|[\s<])/gi, '$1<em>$2</em>');
}

function pushTextWithBreaks(nodes: ReactNode[], value: string, keyPrefix: string) {
  const parts = value.split('\n');
  parts.forEach((part, index) => {
    if (part) {
      nodes.push(part);
    }

    if (index < parts.length - 1) {
      nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
    }
  });
}

function parseSimpleMarkup(value: string, keyPrefix: string): ReactNode[] {
  const normalized = normalizeLegacyMarkup(value);
  const match = /<(em|strong)>(.*?)<\/\1>/i.exec(normalized);

  if (!match || match.index === undefined) {
    const cleaned = normalized.replace(/<\/?[^>]+>/g, '');
    const nodes: ReactNode[] = [];
    pushTextWithBreaks(nodes, cleaned, keyPrefix);
    return nodes;
  }

  const nodes: ReactNode[] = [];
  const before = normalized.slice(0, match.index);
  const tag = match[1].toLowerCase();
  const inner = match[2];
  const after = normalized.slice(match.index + match[0].length);

  if (before) {
    nodes.push(...parseSimpleMarkup(before, `${keyPrefix}-before`));
  }

  const children = parseSimpleMarkup(inner, `${keyPrefix}-${tag}`);
  if (tag === 'em') {
    nodes.push(<em key={`${keyPrefix}-${tag}`}>{children}</em>);
  } else {
    nodes.push(<strong key={`${keyPrefix}-${tag}`}>{children}</strong>);
  }

  if (after) {
    nodes.push(...parseSimpleMarkup(after, `${keyPrefix}-after`));
  }

  return nodes;
}

export function renderRichText(value: string, keyPrefix = 'rich') {
  return <>{parseSimpleMarkup(value, keyPrefix)}</>;
}
