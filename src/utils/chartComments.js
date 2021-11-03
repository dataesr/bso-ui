export default function customComments(data, id, intl) {
  let comments = 'commentaire non rédigé';
  if (data) {
    comments = intl.formatMessage(
      { id: `${id}.comments` },
      {
        ...(data.comments || {}),
        linebreak: (chunks) => (
          <>
            {chunks}
            <br />
          </>
        ),
      },
    );
  }
  return comments;
}
