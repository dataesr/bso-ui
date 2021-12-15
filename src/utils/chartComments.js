import sanitizeHtml from 'sanitize-html';

import { getURLSearchParams } from './helpers';

export default function customComments(data, id, intl, search = '') {
  const { displayComment } = getURLSearchParams(search);
  if (!displayComment) {
    return false;
  }
  let comments = 'Commentaire non rédigé';
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
      },
    );
  }
  return comments;
}
