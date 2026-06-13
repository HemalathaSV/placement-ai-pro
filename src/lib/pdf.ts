// Browser PDF text extraction via pdfjs-dist.
export async function extractPdfText(file: File): Promise<{ text: string; pages: number }> {
  // @ts-expect-error - pdfjs-dist has no types for the .mjs build path
  const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
  // Use CDN worker matching installed version to avoid bundling issues.
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return { text: text.trim(), pages: doc.numPages };
}
