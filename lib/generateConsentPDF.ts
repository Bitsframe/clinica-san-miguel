import jsPDF from 'jspdf';

interface ConsentFormData {
  firstName: string;
  lastName: string;
  dob: Date | null;
  signature?: string | null;
}

interface GenerateConsentOptions {
  /** If true (default), open preview in new tab */
  preview?: boolean;
  /** Callback to receive the generated PDF data URL */
  onReady?: (dataUrl: string) => void;
  /** Type of form to generate */
  formType?: 'telemedicine' | 'hipaa' | 'general' | 'combined';
}

export const generateConsentPDF = (data: ConsentFormData, options: GenerateConsentOptions = {}) => {
  const doc = new jsPDF();
  const { preview = true, onReady, formType = 'telemedicine' } = options;

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

  // Generate based on form type
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  if (formType === 'combined') {
    // ===== PAGE 1: TELEMEDICINE CONSENT =====
    write('Telemedicine Consent Form', 14, true);
    y += 4;

    write(`Patient Name: ${fullName || '_______________________________'}`);
    write(`Date of Birth: ${data.dob ? data.dob.toLocaleDateString('en-US') : '_______________________________'}`);

    y += 6;

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

    y += 16;

    if (data.signature) {
      doc.text('Patient Signature:', marginLeft, y);
      doc.addImage(data.signature, 'PNG', marginLeft + 50, y - 10, 35, 14);
      doc.text(`Date: ${todayStr}`, marginLeft + 125, y);
    } else {
      doc.text(`Patient Signature: ________________________________        Date: ${todayStr}`, marginLeft, y);
    }

    y += 22;

    doc.text('Provider Signature: _______________________________        Date: ____________________', marginLeft, y);

    // ===== PAGE 2: HIPAA COMPLIANCE =====
    doc.addPage();
    y = 20; // Reset y position for new page

    write('Clinica San Miguel', 16, true);
    y += 8;
    
    write('HIPAA Compliance Acknowledgement', 14, true);
    y += 6;

    write(
      "I acknowledge that I have received and reviewed Clinica San Miguel's Notice of Privacy Practices. I understand that my protected health information (PHI) may be used or disclosed for treatment, payment, and healthcare operations as permitted under the Health Insurance Portability and Accountability Act (HIPAA)."
    );

    y += 10;

    // Draw table
    const tableStartY = y;
    const rowHeight = 20;
    const col1Width = 70;
    const col2Width = contentWidth - col1Width;

    // Patient Name row
    doc.rect(marginLeft, tableStartY, col1Width, rowHeight);
    doc.rect(marginLeft + col1Width, tableStartY, col2Width, rowHeight);
    doc.text('Patient Name:', marginLeft + 3, tableStartY + 12);
    doc.text(fullName || '_______________________________', marginLeft + col1Width + 5, tableStartY + 12);

    // Date row
    doc.rect(marginLeft, tableStartY + rowHeight, col1Width, rowHeight);
    doc.rect(marginLeft + col1Width, tableStartY + rowHeight, col2Width, rowHeight);
    doc.text('Date:', marginLeft + 3, tableStartY + rowHeight + 12);
    doc.text(todayStr, marginLeft + col1Width + 5, tableStartY + rowHeight + 12);

    // Signature row
    doc.rect(marginLeft, tableStartY + rowHeight * 2, col1Width, rowHeight);
    doc.rect(marginLeft + col1Width, tableStartY + rowHeight * 2, col2Width, rowHeight);
    doc.text('Patient / Guardian Signature:', marginLeft + 3, tableStartY + rowHeight * 2 + 12);
    
    if (data.signature) {
      doc.addImage(data.signature, 'PNG', marginLeft + col1Width + 5, tableStartY + rowHeight * 2 + 3, 30, 12);
    } else {
      doc.text('_______________________________', marginLeft + col1Width + 5, tableStartY + rowHeight * 2 + 12);
    }

    y = tableStartY + rowHeight * 3 + 10;

    write('By signing this form, I acknowledge that I understand how my medical information may be used and shared.');

    // ===== PAGE 3: GENERAL/SURGERY CONSENT =====
    doc.addPage();
    y = 20; // Reset y position for new page

    write('Clinica San Miguel', 16, true);
    y += 8;
  
    write('General / Surgery Consent Form', 14, true);
    y += 6;

    write(
      'I hereby voluntarily consent to medical evaluation, treatment, diagnostic procedures, and/or surgical procedures as deemed necessary by the physicians and healthcare professionals of Clinica San Miguel. I understand the nature, purpose, potential risks, benefits, and alternatives to the proposed treatment or procedure.'
    );

    y += 4;

    write(
      'I acknowledge that no guarantees have been made regarding the results of any treatment or surgery. I authorize the attending physician and medical staff to administer medications and perform any necessary procedures related to my care.'
    );

    y += 10;

    // Draw table for General/Surgery Consent
    const generalTableStartY = y;
    const generalRowHeight = 20;
    const generalCol1Width = 70;
    const generalCol2Width = contentWidth - generalCol1Width;

    // Patient Name row
    doc.rect(marginLeft, generalTableStartY, generalCol1Width, generalRowHeight);
    doc.rect(marginLeft + generalCol1Width, generalTableStartY, generalCol2Width, generalRowHeight);
    doc.text('Patient Name:', marginLeft + 3, generalTableStartY + 12);
    doc.text(fullName || '_______________________________', marginLeft + generalCol1Width + 5, generalTableStartY + 12);

    // Date row
    doc.rect(marginLeft, generalTableStartY + generalRowHeight, generalCol1Width, generalRowHeight);
    doc.rect(marginLeft + generalCol1Width, generalTableStartY + generalRowHeight, generalCol2Width, generalRowHeight);
    doc.text('Date:', marginLeft + 3, generalTableStartY + generalRowHeight + 12);
    doc.text(todayStr, marginLeft + generalCol1Width + 5, generalTableStartY + generalRowHeight + 12);

    // Patient/Guardian Signature row
    doc.rect(marginLeft, generalTableStartY + generalRowHeight * 2, generalCol1Width, generalRowHeight);
    doc.rect(marginLeft + generalCol1Width, generalTableStartY + generalRowHeight * 2, generalCol2Width, generalRowHeight);
    doc.text('Patient / Guardian Signature:', marginLeft + 3, generalTableStartY + generalRowHeight * 2 + 12);
  
    if (data.signature) {
      doc.addImage(data.signature, 'PNG', marginLeft + generalCol1Width + 5, generalTableStartY + generalRowHeight * 2 + 3, 30, 12);
    } else {
      doc.text('_______________________________', marginLeft + generalCol1Width + 5, generalTableStartY + generalRowHeight * 2 + 12);
    }

    // Physician Signature row
    doc.rect(marginLeft, generalTableStartY + generalRowHeight * 3, generalCol1Width, generalRowHeight);
    doc.rect(marginLeft + generalCol1Width, generalTableStartY + generalRowHeight * 3, generalCol2Width, generalRowHeight);
    doc.text('Physician Signature:', marginLeft + 3, generalTableStartY + generalRowHeight * 3 + 12);
    doc.text('_______________________________', marginLeft + generalCol1Width + 5, generalTableStartY + generalRowHeight * 3 + 12);

    y = generalTableStartY + generalRowHeight * 4 + 10;

    write('By signing above, I confirm that I have read, understood, and voluntarily agreed to this consent.');

  } else if (formType === 'hipaa') {
    // HIPAA Compliance Acknowledgement
    write('Clinica San Miguel', 16, true);
    y += 8;
    
    write('HIPAA Compliance Acknowledgement', 14, true);
    y += 6;

    write(
      "I acknowledge that I have received and reviewed Clinica San Miguel's Notice of Privacy Practices. I understand that my protected health information (PHI) may be used or disclosed for treatment, payment, and healthcare operations as permitted under the Health Insurance Portability and Accountability Act (HIPAA)."
    );

    y += 10;

    // Draw table
    const tableStartY = y;
    const rowHeight = 20;
    const col1Width = 70;
    const col2Width = contentWidth - col1Width;

    // Patient Name row
    doc.rect(marginLeft, tableStartY, col1Width, rowHeight);
    doc.rect(marginLeft + col1Width, tableStartY, col2Width, rowHeight);
    doc.text('Patient Name:', marginLeft + 3, tableStartY + 12);
    doc.text(fullName || '_______________________________', marginLeft + col1Width + 5, tableStartY + 12);

    // Date row
    doc.rect(marginLeft, tableStartY + rowHeight, col1Width, rowHeight);
    doc.rect(marginLeft + col1Width, tableStartY + rowHeight, col2Width, rowHeight);
    doc.text('Date:', marginLeft + 3, tableStartY + rowHeight + 12);
    doc.text(todayStr, marginLeft + col1Width + 5, tableStartY + rowHeight + 12);

    // Signature row
    doc.rect(marginLeft, tableStartY + rowHeight * 2, col1Width, rowHeight);
    doc.rect(marginLeft + col1Width, tableStartY + rowHeight * 2, col2Width, rowHeight);
    doc.text('Patient / Guardian Signature:', marginLeft + 3, tableStartY + rowHeight * 2 + 12);
    
    if (data.signature) {
      doc.addImage(data.signature, 'PNG', marginLeft + col1Width + 5, tableStartY + rowHeight * 2 + 3, 30, 12);
    } else {
      doc.text('_______________________________', marginLeft + col1Width + 5, tableStartY + rowHeight * 2 + 12);
    }

    y = tableStartY + rowHeight * 3 + 10;

    write('By signing this form, I acknowledge that I understand how my medical information may be used and shared.');

  } else if (formType === 'general') {
      // General / Surgery Consent Form
    write('Clinica San Miguel', 16, true);
    y += 8;
    
      write('General / Surgery Consent Form', 14, true);
    y += 6;

      write(
        'I hereby voluntarily consent to medical evaluation, treatment, diagnostic procedures, and/or surgical procedures as deemed necessary by the physicians and healthcare professionals of Clinica San Miguel. I understand the nature, purpose, potential risks, benefits, and alternatives to the proposed treatment or procedure.'
      );

      y += 4;

      write(
        'I acknowledge that no guarantees have been made regarding the results of any treatment or surgery. I authorize the attending physician and medical staff to administer medications and perform any necessary procedures related to my care.'
      );

    y += 10;

      // Draw table
      const tableStartY = y;
      const rowHeight = 20;
      const col1Width = 70;
      const col2Width = contentWidth - col1Width;

      // Patient Name row
      doc.rect(marginLeft, tableStartY, col1Width, rowHeight);
      doc.rect(marginLeft + col1Width, tableStartY, col2Width, rowHeight);
      doc.text('Patient Name:', marginLeft + 3, tableStartY + 12);
      doc.text(fullName || '_______________________________', marginLeft + col1Width + 5, tableStartY + 12);

      // Date row
      doc.rect(marginLeft, tableStartY + rowHeight, col1Width, rowHeight);
      doc.rect(marginLeft + col1Width, tableStartY + rowHeight, col2Width, rowHeight);
      doc.text('Date:', marginLeft + 3, tableStartY + rowHeight + 12);
      doc.text(todayStr, marginLeft + col1Width + 5, tableStartY + rowHeight + 12);

      // Patient/Guardian Signature row
      doc.rect(marginLeft, tableStartY + rowHeight * 2, col1Width, rowHeight);
      doc.rect(marginLeft + col1Width, tableStartY + rowHeight * 2, col2Width, rowHeight);
      doc.text('Patient / Guardian Signature:', marginLeft + 3, tableStartY + rowHeight * 2 + 12);
    
      if (data.signature) {
        doc.addImage(data.signature, 'PNG', marginLeft + col1Width + 5, tableStartY + rowHeight * 2 + 3, 30, 12);
      } else {
        doc.text('_______________________________', marginLeft + col1Width + 5, tableStartY + rowHeight * 2 + 12);
      }

      // Physician Signature row
      doc.rect(marginLeft, tableStartY + rowHeight * 3, col1Width, rowHeight);
      doc.rect(marginLeft + col1Width, tableStartY + rowHeight * 3, col2Width, rowHeight);
      doc.text('Physician Signature:', marginLeft + 3, tableStartY + rowHeight * 3 + 12);
      doc.text('_______________________________', marginLeft + col1Width + 5, tableStartY + rowHeight * 3 + 12);

      y = tableStartY + rowHeight * 4 + 10;

      write('By signing above, I confirm that I have read, understood, and voluntarily agreed to this consent.');


  } else {
    // Telemedicine Consent Form (default)
    write('Telemedicine Consent Form', 14, true);
    y += 4;

    write(`Patient Name: ${fullName || '_______________________________'}`);
    write(`Date of Birth: ${data.dob ? data.dob.toLocaleDateString('en-US') : '_______________________________'}`);

    y += 6;

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

    y += 16;

    if (data.signature) {
      doc.text('Patient Signature:', marginLeft, y);
      doc.addImage(data.signature, 'PNG', marginLeft + 50, y - 10, 35, 14);
      doc.text(`Date: ${todayStr}`, marginLeft + 125, y);
    } else {
      doc.text(`Patient Signature: ________________________________        Date: ${todayStr}`, marginLeft, y);
    }

    y += 22;

    doc.text('Provider Signature: _______________________________        Date: ____________________', marginLeft, y);
  }

  // Return blob URL for external opening
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Provide data URL to caller if requested
  const pdfDataUrl = doc.output('dataurlstring');
  if (onReady) {
    onReady(pdfDataUrl);
  }

  // Return URL so caller can open it
  return pdfUrl;
};
