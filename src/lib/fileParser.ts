import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
// We use the CDN for the worker to avoid complex build configuration in this environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function parseFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
        return parsePdf(file);
    } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
    ) {
        return parseDocx(file);
    } else {
        throw new Error('Formato de arquivo não suportado. Use PDF ou DOCX.');
    }
}

async function parsePdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullHtml = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });

        // Sort items by Y (descending) then X (ascending)
        // PDF coordinates: (0,0) is bottom-left usually, but pdf.js gives transform matrix
        // transform[5] is Y translation. Higher Y is usually higher on page in PDF coords, 
        // but let's check relative difference.
        const items = (textContent.items as any[]).sort((a, b) => {
            const yDiff = b.transform[5] - a.transform[5];
            if (Math.abs(yDiff) > 5) return yDiff; // Tolerance for same line
            return a.transform[4] - b.transform[4]; // Sort by X
        });

        let currentY = -1;
        let lineText = '';
        let pageHtml = '';

        for (const item of items) {
            const y = item.transform[5];
            const text = item.str;

            if (currentY === -1) {
                currentY = y;
                lineText = text;
            } else if (Math.abs(y - currentY) < 8) { // Same line tolerance
                // Add space if x gap is significant, otherwise just append
                // For simplicity, we just add a space
                lineText += ' ' + text;
            } else {
                // New line detected
                if (lineText.trim()) {
                    pageHtml += `<p>${lineText}</p>`;
                }
                currentY = y;
                lineText = text;
            }
        }
        // Add last line
        if (lineText.trim()) {
            pageHtml += `<p>${lineText}</p>`;
        }

        // Wrap page content in a div that simulates the page dimensions
        // We use min-height to allow editing to expand it
        fullHtml += `<div class="page-content" style="position: relative; min-height: ${viewport.height}px; width: 100%; max-width: ${viewport.width}px; margin: 0 auto; padding: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">${pageHtml}</div>`;
    }

    return fullHtml;
}

async function parseDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
}
