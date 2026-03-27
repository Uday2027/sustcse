import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import fetch from 'node-fetch';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

interface ApplicationPDFData {
  serialNumber: string;
  title: string;            // Subject line
  to: string;               // Addressed to (e.g. "The Chairman, Dept. of CSE")
  body: string;             // Main body text
  studentName: string;
  studentId?: string;
  session?: string;
  date: string;             // ISO string
  departmentName?: string;
}

interface StampOptions {
  existingPdfUrl: string;
  signerName: string;
  designation?: string;
  signatureImageUrl: string;
  sealImageUrl?: string;
  comment?: string;
  stepLabel: string;
  timestamp: string;
  stepNumber: number;       // Which step (1, 2, 3...) to position boxes side by side
}

/**
 * Generates an official A4 department application PDF from form data.
 * The document is styled like a formal university application letter.
 */
export const generateApplicationPDF = async (data: ApplicationPDFData): Promise<Buffer> => {
  const {
    serialNumber, title, to, body, studentName,
    studentId, session, date, departmentName
  } = data;

  // Strip Windows carriage returns — WinAnsi font encoding cannot handle \r
  const clean = (s?: string) => (s || '').replace(/\r/g, '');
  const cleanTitle       = clean(title);
  const cleanTo          = clean(to);
  const cleanBody        = clean(body);
  const cleanStudentName = clean(studentName);
  const cleanDept        = clean(departmentName);

  try {
    const pdfDoc = await PDFDocument.create();

    // A4 page (595.28 x 841.89 pts)
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const boldFont    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const italicFont  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const margin = 60;
    const contentWidth = width - margin * 2;

    // ─── LETTERHEAD ────────────────────────────────────────────────────────────
    // Top border line
    page.drawRectangle({ x: margin, y: height - 50, width: contentWidth, height: 2, color: rgb(0.1, 0.2, 0.5) });

    // University name
    page.drawText('SHAHJALAL UNIVERSITY OF SCIENCE AND TECHNOLOGY', {
      x: margin, y: height - 75,
      size: 12, font: boldFont, color: rgb(0.1, 0.2, 0.5),
    });

    // Department name
    page.drawText(cleanDept || 'Department of Computer Science and Engineering', {
      x: margin, y: height - 92,
      size: 9.5, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    // Sub-divider
    page.drawRectangle({ x: margin, y: height - 103, width: contentWidth, height: 0.5, color: rgb(0.7, 0.7, 0.8) });

    // ─── SERIAL + DATE ─────────────────────────────────────────────────────────
    page.drawText(`Ref: ${serialNumber}`, {
      x: margin, y: height - 120,
      size: 8.5, font: boldFont, color: rgb(0.2, 0.2, 0.5),
    });

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const dateText = `Date: ${formattedDate}`;
    page.drawText(dateText, {
      x: width - margin - regularFont.widthOfTextAtSize(dateText, 8.5),
      y: height - 120,
      size: 8.5, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    // ─── ADDRESSED TO ──────────────────────────────────────────────────────────
    let cursorY = height - 155;

    page.drawText('To,', {
      x: margin, y: cursorY,
      size: 10, font: regularFont, color: rgb(0, 0, 0),
    });
    cursorY -= 16;

    // Allow multi-line "to" field
    const toLines = cleanTo.split('\n');
    for (const line of toLines) {
      page.drawText(line, {
        x: margin, y: cursorY,
        size: 10, font: boldFont, color: rgb(0, 0, 0),
      });
      cursorY -= 14;
    }

    cursorY -= 12;

    // ─── SUBJECT ────────────────────────────────────────────────────────────────
    page.drawText('Subject: ', {
      x: margin, y: cursorY,
      size: 10, font: boldFont, color: rgb(0, 0, 0),
    });
    page.drawText(cleanTitle, {
      x: margin + boldFont.widthOfTextAtSize('Subject: ', 10),
      y: cursorY,
      size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.5),
    });

    cursorY -= 20;
    // Underline subject line
    page.drawRectangle({ x: margin, y: cursorY + 2, width: contentWidth, height: 0.5, color: rgb(0.8, 0.8, 0.8) });
    cursorY -= 12;

    // ─── SALUTATION ────────────────────────────────────────────────────────────
    page.drawText('Respected Sir/Madam,', {
      x: margin, y: cursorY,
      size: 10, font: italicFont, color: rgb(0.2, 0.2, 0.2),
    });
    cursorY -= 20;

    // ─── BODY TEXT ────────────────────────────────────────────────────────────
    // Word-wrap body text at contentWidth
    const lines: string[] = [];
    const paragraphs = cleanBody.split('\n');

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push(''); // empty line for paragraph spacing
        continue;
      }
      
      const words = paragraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = regularFont.widthOfTextAtSize(testLine, 10);
        if (testWidth > contentWidth - 10 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    for (const line of lines) {
      if (cursorY < 180) break; // stop before signature area — page limit
      page.drawText(line, {
        x: margin, y: cursorY,
        size: 10, font: regularFont, color: rgb(0, 0, 0),
      });
      cursorY -= 15;
    }

    cursorY -= 15;

    // ─── CLOSING ───────────────────────────────────────────────────────────────
    page.drawText('Yours sincerely,', {
      x: margin, y: cursorY,
      size: 10, font: italicFont, color: rgb(0.2, 0.2, 0.2),
    });
    cursorY -= 40;

    // ─── STUDENT INFO BLOCK ────────────────────────────────────────────────────
    // Left: signature placeholder
    page.drawRectangle({ x: margin, y: cursorY - 5, width: 120, height: 0.5, color: rgb(0, 0, 0) });
    cursorY -= 15;

    page.drawText(cleanStudentName, {
      x: margin, y: cursorY,
      size: 9, font: boldFont, color: rgb(0, 0, 0),
    });
    cursorY -= 12;

    if (studentId) {
      page.drawText(`ID: ${studentId}`, {
        x: margin, y: cursorY,
        size: 8, font: regularFont, color: rgb(0.3, 0.3, 0.3),
      });
      cursorY -= 12;
    }
    if (session) {
      page.drawText(`Session: ${session}`, {
        x: margin, y: cursorY,
        size: 8, font: regularFont, color: rgb(0.3, 0.3, 0.3),
      });
    }

    // ─── BOTTOM BORDER ────────────────────────────────────────────────────────
    page.drawRectangle({ x: margin, y: 40, width: contentWidth, height: 0.5, color: rgb(0.7, 0.7, 0.8) });
    page.drawText(`SUST Application Portal  ·  ${serialNumber}  ·  ${formattedDate}`, {
      x: margin, y: 28,
      size: 7, font: regularFont, color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('PDF generation failed', { error: msg });
    throw createError(500, `Failed to generate application PDF: ${msg}`);
  }
};

/**
 * Merges two PDFs: the base application + one attachment.
 */
export const mergePDFs = async (basePdfBytes: Buffer, attachmentUrl: string): Promise<Buffer> => {
  try {
    const baseDoc = await PDFDocument.load(basePdfBytes);
    const attachRes = await fetch(attachmentUrl);
    if (!attachRes.ok) throw new Error(`Failed to fetch attachment: ${attachmentUrl}`);
    const attachBytes = await attachRes.arrayBuffer();
    const attachDoc = await PDFDocument.load(attachBytes);

    const pages = await baseDoc.copyPages(attachDoc, attachDoc.getPageIndices());
    pages.forEach(p => baseDoc.addPage(p));

    return Buffer.from(await baseDoc.save());
  } catch (error) {
    logger.warn('Failed to merge PDF attachment', { attachmentUrl });
    throw createError(500, 'Failed to merge PDF attachments');
  }
};

/**
 * Stamps a PDF with a signature box and optional seal.
 * Positions boxes sequentially from the bottom-right so multiple approvers don't overlap.
 */
export const stampPDFWithSignature = async (options: StampOptions): Promise<Buffer> => {
  const {
    existingPdfUrl,
    signerName,
    designation,
    signatureImageUrl,
    sealImageUrl,
    stepLabel,
    timestamp,
    stepNumber = 1,
  } = options;

  const clean = (s?: string) => (s || '').replace(/\r/g, '');
  const cleanSignerName = clean(signerName);
  const cleanDesignation = clean(designation);
  const cleanStepLabel = clean(stepLabel);

  try {
    // Fetch existing PDF
    const pdfResponse = await fetch(existingPdfUrl);
    if (!pdfResponse.ok) throw new Error(`Failed to fetch PDF from ${existingPdfUrl}`);
    const pdfBytes = await pdfResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Embed signature
    const sigImageResponse = await fetch(signatureImageUrl);
    if (!sigImageResponse.ok) throw new Error('Failed to fetch signature image');
    const sigImageBytes = await sigImageResponse.arrayBuffer();
    const isPng = signatureImageUrl.toLowerCase().includes('.png') || signatureImageUrl.toLowerCase().includes('png');
    const sigImage = isPng
      ? await pdfDoc.embedPng(sigImageBytes)
      : await pdfDoc.embedJpg(sigImageBytes);

    // Embed seal (optional)
    let sealImage = null;
    if (sealImageUrl) {
      const sealResponse = await fetch(sealImageUrl);
      if (sealResponse.ok) {
        const sealBytes = await sealResponse.arrayBuffer();
        const isSealPng = sealImageUrl.toLowerCase().includes('.png') || sealImageUrl.toLowerCase().includes('png');
        sealImage = isSealPng
          ? await pdfDoc.embedPng(sealBytes)
          : await pdfDoc.embedJpg(sealBytes);
      }
    }

    // Operate on last page
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    const boldFont    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Each stamp box is 195pts wide. Place side-by-side from right to left.
    const boxW = 185;
    const boxH = 108;
    const boxMargin = 8;
    const boxY = 50;
    const boxX = width - (boxW + boxMargin) * stepNumber - boxMargin;

    // Background
    lastPage.drawRectangle({
      x: boxX, y: boxY,
      width: boxW, height: boxH,
      color: rgb(0.97, 0.98, 1),
      borderColor: rgb(0.2, 0.3, 0.65),
      borderWidth: 1,
    });

    // Step label / role header
    lastPage.drawRectangle({
      x: boxX, y: boxY + boxH - 18,
      width: boxW, height: 18,
      color: rgb(0.2, 0.3, 0.65),
    });
    lastPage.drawText(cleanStepLabel.substring(0, 28), {
      x: boxX + 6, y: boxY + boxH - 13,
      size: 7.5, font: boldFont, color: rgb(1, 1, 1),
    });

    // Signature image
    lastPage.drawImage(sigImage, {
      x: boxX + 6, y: boxY + 46, width: 80, height: 38,
    });

    // Seal image (right side of box)
    if (sealImage) {
      lastPage.drawImage(sealImage, {
        x: boxX + boxW - 52, y: boxY + 42,
        width: 46, height: 52, opacity: 0.75,
      });
    }

    // Divider
    lastPage.drawRectangle({
      x: boxX + 6, y: boxY + 43, width: boxW - 12, height: 0.5,
      color: rgb(0.7, 0.75, 0.85),
    });

    // Signer name
    lastPage.drawText(cleanSignerName, {
      x: boxX + 6, y: boxY + 31,
      size: 8, font: boldFont, color: rgb(0, 0, 0),
    });

    // Designation
    if (designation) {
      lastPage.drawText(cleanDesignation.substring(0, 30), {
        x: boxX + 6, y: boxY + 20,
        size: 7, font: regularFont, color: rgb(0.3, 0.3, 0.3),
      });
    }

    // Timestamp
    lastPage.drawText(`Signed: ${new Date(timestamp).toLocaleDateString('en-GB')}`, {
      x: boxX + 6, y: boxY + 8,
      size: 6, font: regularFont, color: rgb(0.5, 0.5, 0.5),
    });

    const resultBytes = await pdfDoc.save();
    return Buffer.from(resultBytes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown PDF stamping error';
    logger.error('PDF stamping failed', { error: message });
    throw createError(500, `Failed to sign PDF: ${message}`);
  }
};
