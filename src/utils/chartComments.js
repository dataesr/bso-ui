export default function customComments(data, id, intl) {
  let comments = 'commentaire non rédigé';
  if (data && data.length > 0) {
    comments = intl.formatMessage(
      { id: `${id}.comments` },
      data.comments || 'commentaire non rédigé',
    );
  }
  return comments;
}
