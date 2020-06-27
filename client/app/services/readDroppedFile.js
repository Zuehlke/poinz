export default function readDroppedFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => reject('aborted');
    reader.onerror = () => reject('error');
    reader.onload = () => resolve(reader.result);

    reader.readAsDataURL(file);
  });
}
