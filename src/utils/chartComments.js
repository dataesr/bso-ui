export default function customComments(data, id, intl) {
  let comments = '';
  if (data && data.length > 0) {
    comments = intl.formatMessage(
      { id: `${id}.comments` },
      data.comments || '',
    );
  }
  return comments;
}
