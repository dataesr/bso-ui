import sanitizeHtml from 'sanitize-html';

import { getURLSearchParams } from './helpers';

export default function customComments(data, id, intl) {
  const { commentsName, displayComment } = getURLSearchParams(intl, id);
  if (!displayComment) {
    return false;
  }
  let comment = 'Commentaire non rédigé';
  const values = {};
  data?.ctas?.forEach((cta, index) => {
    values[`cta${index}`] = (chunks) => (
      <a href={cta} target='_blank' rel='noreferrer'>
        {chunks}
      </a>
    );
  });
  if (data) {
    comment = intl.formatMessage(
      { id: `${id}.comments`, defaultMessage: 'Commentaire non rédigé' },
      {
        ...(data.comments || {}),
        commentsName,
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
  return comment;
}
