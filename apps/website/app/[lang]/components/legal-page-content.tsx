import styles from './secondary-shell.module.css';

export function LegalPageContent({
  content,
  highlightQuestions = false,
}: {
  content: string;
  highlightQuestions?: boolean;
}) {
  const cleanQuestionLabel = (value: string) =>
    value.replace(/^\d+(?:\.\d+)?[\.\s]+/, '').trim();

  const blocks = String(content || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const [first, ...rest] = lines;
        const isStructuredHeading = /^\d+(?:\.\d+)?[\.\s]/.test(first);
        const looksLikeQuestion = highlightQuestions && (/\?$/.test(first) || isStructuredHeading);

        if (!rest.length) {
          return (
            <section className={styles.section} key={index}>
              {looksLikeQuestion ? (
                <p>
                  <strong className={styles.questionLead}>{cleanQuestionLabel(first)}</strong>
                </p>
              ) : (
                <p>{first}</p>
              )}
            </section>
          );
        }

        if (!isStructuredHeading) {
          return (
            <section className={styles.section} key={index}>
              {looksLikeQuestion ? (
                <>
                  <p>
                    <strong className={styles.questionLead}>{cleanQuestionLabel(first)}</strong>
                  </p>
                  {rest.map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </>
              ) : (
                lines.map((line, lineIndex) => (
                  <p key={lineIndex}>{line}</p>
                ))
              )}
            </section>
          );
        }

        return (
          <section className={styles.section} key={index}>
            <h2 className={highlightQuestions ? styles.questionHeading : undefined}>
              {highlightQuestions ? cleanQuestionLabel(first) : first}
            </h2>
            {rest.map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </section>
        );
      })}
    </>
  );
}
