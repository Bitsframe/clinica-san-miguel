import jsPDF from 'jspdf';
import { supabase } from '../supabaseClient';

interface ConsentFormData {
  [key: string]: any;
}

interface GenerateConsentOptions {
  /** If true (default), open preview in new tab */
  preview?: boolean;
  /** Callback to receive the generated PDF data URL */
  onReady?: (dataUrl: string) => void;
  /** Type of form to generate */
  formType?: 'telemedicine' | 'hipaa' | 'general' | 'combined';
}

export const generateConsentPDF = async (data: ConsentFormData, options: GenerateConsentOptions = {}) => {
  const doc = new jsPDF();
  const { preview = true, onReady, formType = 'telemedicine' } = options;
  const marginLeft = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - marginLeft * 2;
  let y = 20;
  const lineGap = 6;

  // Helper to write text
  const write = (text: string, size = 11, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, marginLeft, y);
    y += lines.length * lineGap;
  };

  // Helper to render a table
  const renderTable = (rows: string[][]) => {
    const rowHeight = 20;
    const col1Width = 70;
    const col2Width = contentWidth - col1Width;
    let tableY = y;
    rows.forEach(([label, value], idx) => {
      doc.rect(marginLeft, tableY, col1Width, rowHeight);
      doc.rect(marginLeft + col1Width, tableY, col2Width, rowHeight);
      doc.text(label, marginLeft + 3, tableY + 12);
      let fillValue = value || '_______________________________';
      // Autofill patient name
      if (label.trim().toLowerCase() === 'patient name:' && data.patient_name) {
        fillValue = data.patient_name;
      }
      // Autofill date
      if (label.trim().toLowerCase().startsWith('date') && (!value || value === '_______________________________')) {
        let dateVal = data.signed_date || new Date();
        if (dateVal instanceof Date) {
          fillValue = dateVal.toLocaleDateString('en-US');
        } else if (typeof dateVal === 'string') {
          const parsed = new Date(dateVal);
          fillValue = isNaN(parsed.getTime()) ? dateVal : parsed.toLocaleDateString('en-US');
        } else {
          fillValue = new Date().toLocaleDateString('en-US');
        }
      }
      // Autofill patient/guardian signature
      if ((label.toLowerCase().includes('patient') || label.toLowerCase().includes('guardian')) && label.toLowerCase().includes('signature')) {
        const sigData = data.signature || data.patientSignature || null;
        if (sigData) {
          // Draw signature image in the cell
          doc.addImage(sigData, 'PNG', marginLeft + col1Width + 5, tableY + 2, 60, 16);
          fillValue = '';
        }
      }
      if (fillValue) {
        doc.text(fillValue, marginLeft + col1Width + 5, tableY + 12);
      }
      tableY += rowHeight;
    });
    y = tableY + 10;
  };

  if (formType === 'combined') {
    // Fetch all three forms and render each on a separate page
    const { data: allRows, error } = await supabase
      .from('forms')
      .select('content,name')
      .in('name', [
        'Telemedicine Consent Form',
        'HIPAA Compliance Acknowledgement',
        'General / Surgery Consent Form'
      ])
      .eq('is_active', true);
    if (error || !allRows || allRows.length === 0) {
      write('Error loading form content.', 14, true);
    } else {
      allRows.forEach((row, idx) => {
        if (idx > 0) {
          doc.addPage();
          y = 20;
        }
        const contentObj = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
        const blocks = contentObj?.blocks || [];
        for (const block of blocks) {
          switch (block.type) {
            case 'heading':
              write(block.text, block.size || 14, true);
              y += 4;
              break;
            case 'paragraph':
              write(block.text);
              y += 4;
              break;
            case 'list':
              block.items.forEach((item: string) => {
                write('• ' + item);
              });
              y += 4;
              break;
            case 'field':
              // Autofill patient name for all forms
              let fieldValue = data[block.key] || '_______________________________';
              if (block.label.toLowerCase() === 'patient name' && data.patient_name) {
                fieldValue = data.patient_name;
              }
              if (block.label.toLowerCase().includes('date')) {
                let dateVal = data[block.key] || data.signed_date || new Date();
                if (dateVal instanceof Date) {
                  fieldValue = dateVal.toLocaleDateString('en-US');
                } else if (typeof dateVal === 'string') {
                  const parsed = new Date(dateVal);
                  fieldValue = isNaN(parsed.getTime()) ? dateVal : parsed.toLocaleDateString('en-US');
                } else {
                  fieldValue = new Date().toLocaleDateString('en-US');
                }
              }
              if (block.label.toLowerCase().includes('signature') || block.label.toLowerCase().includes('date')) {
                doc.text(`${block.label}:`, marginLeft, y);
                if (fieldValue && fieldValue !== '_______________________________') {
                  // If value is present, just show the value
                  doc.text(fieldValue, marginLeft + 50, y);
                } else {
                  // If no value, draw the line
                  doc.line(marginLeft + 50, y, marginLeft + 170, y);
                }
                y += 12;
              } else {
                write(`${block.label}: ${fieldValue}`);
                y += 4;
              }
              break;
            case 'signature':
              doc.text(`${block.label}:`, marginLeft, y);
              let sigData = null;
              // Only autofill patient signature if not provider signature
              if (!block.label.toLowerCase().includes('provider')) {
                sigData = data[block.key] || data.signature || data.patientSignature || null;
              } else {
                sigData = data[block.key] || null;
              }
              if (sigData) {
                doc.addImage(sigData, 'PNG', marginLeft + 50, y - 10, 35, 14);
              } else {
                doc.line(marginLeft + 50, y, marginLeft + 170, y); // Draw a long line for signature
              }
              y += 22;
              break;
            case 'table':
              renderTable(block.rows);
              break;
            default:
              break;
          }
        }
      });
    }
  } else {
    // Fetch single form
    const { data: formRows, error } = await supabase
      .from('forms')
      .select('content')
      .eq('name',
        formType === 'telemedicine' ? 'Telemedicine Consent Form'
        : formType === 'general' ? 'General / Surgery Consent Form'
        : formType === 'hipaa' ? 'HIPAA Compliance Acknowledgement'
        : 'Telemedicine Consent Form'
      )
      .eq('is_active', true)
      .limit(1);
    if (error || !formRows || !formRows[0]?.content) {
      write('Error loading form content.', 14, true);
    } else {
      const contentObj = typeof formRows[0].content === 'string'
        ? JSON.parse(formRows[0].content)
        : formRows[0].content;
      const blocks = contentObj.blocks;
      for (const block of blocks) {
        switch (block.type) {
          case 'heading':
            write(block.text, block.size || 14, true);
            y += 4;
            break;
          case 'paragraph':
            write(block.text);
            y += 4;
            break;
          case 'list':
            block.items.forEach((item: string) => {
              write('• ' + item);
            });
            y += 4;
            break;
          case 'field':
            let fieldValue = data[block.key] || '_______________________________';
            if (block.label.toLowerCase() === 'patient name' && data.patient_name) {
              fieldValue = data.patient_name;
            }
            // Format date of birth to only show date
            if (block.label.toLowerCase().includes('date of birth') && data.dob) {
              let dobVal = data.dob;
              if (dobVal instanceof Date) {
                fieldValue = dobVal.toLocaleDateString('en-US');
              } else if (typeof dobVal === 'string') {
                const parsed = new Date(dobVal);
                fieldValue = isNaN(parsed.getTime()) ? dobVal : parsed.toLocaleDateString('en-US');
              } else {
                fieldValue = new Date().toLocaleDateString('en-US');
              }
            }
            // Other date fields
            if (block.label.toLowerCase().includes('date') && !block.label.toLowerCase().includes('date of birth')) {
              let dateVal = data[block.key] || data.signed_date || new Date();
              if (dateVal instanceof Date) {
                fieldValue = dateVal.toLocaleDateString('en-US');
              } else if (typeof dateVal === 'string') {
                const parsed = new Date(dateVal);
                fieldValue = isNaN(parsed.getTime()) ? dateVal : parsed.toLocaleDateString('en-US');
              } else {
                fieldValue = new Date().toLocaleDateString('en-US');
              }
            }
            if (block.label.toLowerCase().includes('signature') || block.label.toLowerCase().includes('date')) {
              doc.text(`${block.label}:`, marginLeft, y);
              if (fieldValue && fieldValue !== '_______________________________') {
                doc.text(fieldValue, marginLeft + 50, y);
              } else {
                doc.line(marginLeft + 50, y, marginLeft + 170, y);
              }
              y += 12;
            } else {
              write(`${block.label}: ${fieldValue}`);
              y += 4;
            }
            break;
          case 'signature':
            doc.text(`${block.label}:`, marginLeft, y);
            let sigData = null;
            if (!block.label.toLowerCase().includes('provider')) {
              sigData = data[block.key] || data.signature || data.patientSignature || null;
            } else {
              sigData = data[block.key] || null;
            }
            if (sigData) {
              doc.addImage(sigData, 'PNG', marginLeft + 50, y - 10, 35, 14);
            } else {
              doc.line(marginLeft + 50, y, marginLeft + 170, y);
            }
            y += 22;
            break;
          case 'table':
            renderTable(block.rows);
            break;
          default:
            break;
        }
      }
    }
  }

  // Return blob URL for external opening
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfDataUrl = doc.output('dataurlstring');
  if (onReady) {
    onReady(pdfDataUrl);
  }
  return pdfUrl;
};
