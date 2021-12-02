import sanitizeHtml from 'sanitize-html';

export default function customComments(data, id, intl) {
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
