export default function customComments(data, id, intl) {
  const comments = intl.messages[`${id}.comments`] ? intl.formatMessage({ id: `${id}.comments` }, data?.comments || []) : 'commentaire non rédigé';
  return comments;
}
