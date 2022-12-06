export default async function downloadFile({ content, name, type }) {
  const downloadUrl = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
