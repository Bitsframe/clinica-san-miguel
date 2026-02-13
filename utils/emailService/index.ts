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

    await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  } catch (error:any) {
    // Silently fail to not disrupt appointment booking
  }
};
