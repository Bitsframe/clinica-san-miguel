import axios from 'axios';
import { emailBodyContent, EmailBodyInterface, EmailBodyTempEnum, emailFromDetails, getEmailTemplates } from './templateDetails';

export const sendEmail = async ({
  lang,
  emailType,
  data,
}: {
  lang: keyof typeof emailBodyContent;
  emailType: EmailBodyTempEnum;
  data: EmailBodyInterface;
}): Promise<void> => {
  try {
    const emailHtml = getEmailTemplates({ lang, emailType, data });

    const fromEmail = emailFromDetails[emailType];

    const payload = {
      from: `Clinica San Miguel <${fromEmail}>`,
      recipients: [data.email], 
      subject: emailBodyContent[lang][emailType].subject,
      html: emailHtml,
    };

    const endpoint = '/api/send-email'; 

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    console.log('Email sent successfully:', response.data);
  } catch (error:any) {
    console.error('Error sending email:', error.response?.data || error.message);
    // Don't throw error to prevent form submission from failing
    console.warn('Email sending failed, but form submission will continue');
  }
};
