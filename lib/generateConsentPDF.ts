import jsPDF from 'jspdf';

interface ConsentFormData {
  firstName: string;
  lastName: string;
  dob: Date | null;
  signature?: string | null;
}

export const generateConsentPDF = (data: ConsentFormData) => {
  const doc = new jsPDF();

  const marginLeft = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - marginLeft * 2;
  let y = 20;

  // Use today's date for patient signature date stamp
  const todayStr = new Date().toLocaleDateString('en-US');

  const lineGap = 6;

  const write = (text: string, size = 11, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, marginLeft, y);
    y += lines.length * lineGap;
  };

  // Title
  write('Telemedicine Consent Form', 14, true);
  y += 4;

  // Patient info
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  write(`Patient Name: ${fullName || '_______________________________'}`);
  write(
    `Date of Birth: ${
      data.dob ? data.dob.toLocaleDateString('en-US') : '_______________________________'
    }`
  );

  y += 6;

  // Sections
  write('Purpose of Telemedicine', 12, true);
  write(
    'Telemedicine involves the use of electronic communications to provide medical consultation, diagnosis, treatment, education, and follow-up care without an in-person visit.'
  );

  y += 4;

  write('Nature of Telemedicine Services', 12, true);
  write(
    'Telemedicine services may include video, audio, or digital communication. I may ask questions and receive explanations about my care.'
  );

  y += 4;

  write('Benefits', 12, true);
  write('• Improved access to care');
  write('• Convenience and reduced travel');
  write('• Timely consultations');

  y += 4;

  write('Risks and Limitations', 12, true);
  write('• Technical failures or disruptions');
  write('• Limitations compared to physical examination');
  write('• Privacy risks despite security measures');

  y += 4;

  write('Privacy and Confidentiality', 12, true);
  write(
    'My medical information will be protected in accordance with applicable privacy laws and reasonable security practices.'
  );

  y += 4;

  write('Alternatives', 12, true);
  write('I understand I may choose in-person care instead of telemedicine at any time.');

  y += 4;

  write('Consent', 12, true);
  write(
    'By signing below, I acknowledge that I understand and consent to receive healthcare services via telemedicine.'
  );

  // ===== LARGE SIGNATURE AREA (matches uploaded PDF) =====
  y += 16;

  if (data.signature) {
    // If signature exists, display only the signature and date
    doc.text('Patient Signature:', marginLeft, y);
    doc.addImage(data.signature, 'PNG', marginLeft + 50, y - 10, 35, 14);
    doc.text(`Date: ${todayStr}`, marginLeft + 125, y);
  } else {
    // If no signature, show blank lines
    doc.text(
      `Patient Signature: ________________________________        Date: ${todayStr}`,
      marginLeft,
      y
    );
  }

  y += 22;

  doc.text(
    'Provider Signature: _______________________________        Date: ____________________',
    marginLeft,
    y
  );

  // Preview in browser instead of downloading
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};
