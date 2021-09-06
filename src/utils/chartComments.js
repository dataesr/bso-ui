export function simpleComments(data, id, intl) {
  let comments = '';

  if (data && data.length > 0) {
    const { y, publicationDate, name } = data[0];
    comments = intl.formatMessage(
      { id: `${id}.comments` },
      {
        a: y || '',
        b: publicationDate || '',
        c: publicationDate + 1 || '',
        d: name || '',
      },
    );
  }
  return comments;
}

export function longComments(data, id, intl) {
  let comments = '';
  if (data && data.length > 0) {
    const first = data[0];
    const second = data[1];
    const third = data[2];

    const indMax = second?.data.length - 1;

    comments = intl.formatMessage(
      { id: `${id}.comments` },
      {
        a: second?.name,
        b: first?.name,
        c: 2013 + indMax,
        d: first?.data[indMax] - second?.data[indMax],
        e: second?.data[indMax],
        f: first?.data[indMax],
        g: 2013 + indMax - 1,
        h: first?.data[indMax - 1] - second?.data[indMax - 1],
        i: second?.data[indMax - 1],
        j: first?.data[indMax - 1],
        k: second?.data[indMax - 1] - third?.data[indMax - 1],
        l: third?.name,
        m: second?.name,
      },
    );
  }
  return comments;
}

export function complexComments(data, lastObservationSnap, id, intl) {
  let comments = '';

  if (data && data.length > 0) {
    const journalArticleOpened = data.find(
      (el) => el.key === 'journal-article' && el.parent === 'opened',
    )?.value;
    const journalArticleClosed = data.find(
      (el) => el.key === 'journal-article' && el.parent === 'closed',
    )?.value;
    const ratio1 = journalArticleOpened / (journalArticleOpened + journalArticleClosed);
    const bookChapterOpened = data.find(
      (el) => el.key === 'book-chapter' && el.parent === 'opened',
    )?.value;
    const bookChapterClosed = data.find(
      (el) => el.key === 'book-chapter' && el.parent === 'closed',
    )?.value;
    const ratio2 = bookChapterOpened / (bookChapterOpened + bookChapterClosed);

    comments = intl.formatMessage(
      { id: `${id}.comments` },
      {
        a: lastObservationSnap,
        b: journalArticleOpened,
        c: journalArticleClosed,
        d: Math.floor(ratio1 * 100),
        e: bookChapterOpened,
        f: bookChapterClosed,
        g: Math.floor(ratio2 * 100),
      },
    );
  }
  return comments;
}
