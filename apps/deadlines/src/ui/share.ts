/* Hands a file to the person. On iOS the share sheet is the dependable route (Save to Files,
   AirDrop, Calendar); elsewhere a normal download. Resolves to false if they cancelled. */
export async function shareFile(text: string, name: string, type: string, title: string): Promise<boolean> {
  try {
    const file = new File([text], name, { type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title });
      return true;
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return false;
  }
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}
