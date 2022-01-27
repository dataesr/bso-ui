import sanitizeHtml from 'sanitize-html';

import { getURLSearchParams } from './helpers';

export default function customComments(data, id, intl, search = '') {
  const { displayComment } = getURLSearchParams(search);
  if (!displayComment) {
    return false;
  }
  let comments = 'Commentaire non rédigé';
  const values = {};
  data?.ctas?.forEach((cta, index) => {
    values[`cta${index}`] = (chunks) => (
      <a href={cta} target='_blank' rel='noreferrer'>
        {chunks}
      </a>
    );
  });
  if (data) {
    comments = intl.formatMessage(
      { id: `${id}.comments` },
      {
        ...(data.comments || {}),
        linebreak: (chunks) => (
          <>
            {sanitizeHtml(chunks)}
            <br />
          </>
        ),
        ...values,
      },
    );
  }
  return comments;
}
