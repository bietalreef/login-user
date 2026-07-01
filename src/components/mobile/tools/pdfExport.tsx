/**
 * pdfExport.tsx — تصدير PDF
 * ══════════════════════════
 * يستخدم dynamic import لتجنب crash
 * في حال عدم توفر html2canvas أو jspdf
 *
 * Fix: uses scale:1, JPEG, maxCanvasWidth/Height,
 * and foreignObjectRendering:false to avoid
 * DataCloneError (out of memory in web worker).
 */

/** Maximum canvas dimension (pixels) to prevent OOM */
const MAX_CANVAS_DIM = 4096;

/**
 * يحوّل عنصر HTML إلى ملف PDF ويقوم بتحميله مباشرة
 * يُستخدم في مولّد العروض والعقود والفواتير
 */
export async function downloadPdfFromElement(
  element: HTMLElement,
  fileName: string,
  onStart?: () => void,
  onEnd?: () => void,
) {
  try {
    onStart?.();

    // Dynamic imports — لن تنهار الأداة إذا لم تتوفر المكتبات
    let html2canvas: any;
    let jsPDF: any;

    try {
      const h2cModule = await import('html2canvas');
      html2canvas = h2cModule.default || h2cModule;
      const jspdfModule = await import('jspdf');
      jsPDF = jspdfModule.jsPDF || jspdfModule.default;
    } catch (importErr) {
      console.warn('PDF libraries not available, falling back to print:', importErr);
      fallbackPrint(element, fileName);
      return;
    }

    // Compute safe scale: keep canvas within MAX_CANVAS_DIM
    const rect = element.getBoundingClientRect();
    const safeScale = Math.min(
      1,
      MAX_CANVAS_DIM / (rect.width || 1),
      MAX_CANVAS_DIM / (rect.height || 1),
    );

    // تحويل العنصر إلى صورة — low-memory settings
    const canvas = await html2canvas(element, {
      scale: safeScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: false,   // avoids worker serialisation crash
      removeContainer: true,            // clean up cloned DOM immediately
      imageTimeout: 5000,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // أبعاد A4 بالمليمتر
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    // Use JPEG (≈10× smaller than PNG) to avoid DataCloneError
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF('p', 'mm', 'a4');

    // حساب نسبة العرض والارتفاع
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // إذا المحتوى أطول من صفحة واحدة — تقسيم على عدة صفحات
    let position = 0;
    let remainingHeight = imgHeight;

    while (remainingHeight > 0) {
      if (position > 0) pdf.addPage();

      pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);
      remainingHeight -= A4_HEIGHT_MM;
      position += A4_HEIGHT_MM;
    }

    // تحميل الملف
    pdf.save(`${fileName}.pdf`);
  } catch (err: any) {
    console.error('PDF export error:', err);

    // Specific handling for DataCloneError / OOM
    if (
      err?.name === 'DataCloneError' ||
      err?.message?.includes('out of memory') ||
      err?.message?.includes('DataCloneError')
    ) {
      console.warn('html2canvas OOM — falling back to browser print');
    }

    // Fallback: فتح نافذة طباعة
    fallbackPrint(element, fileName);
  } finally {
    onEnd?.();
  }
}

/** Fallback — يفتح نافذة طباعة المتصفح */
function fallbackPrint(element: HTMLElement, fileName: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    // Collect all stylesheets from the parent document
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    printWindow.document.write(
      `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${fileName}</title>${styles}<style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Cairo',sans-serif;direction:rtl;padding:20mm}@page{size:A4;margin:15mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${element.innerHTML}</body></html>`
    );
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}
