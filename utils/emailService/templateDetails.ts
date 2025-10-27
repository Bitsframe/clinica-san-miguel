export interface EmailBodyInterface {
  email: string;
  name: string;
  location: {
    title: string;
    address: string;
    phone: string;
  };
  service: string;
  date: string;
  time: string;

  oldDate?: string;
  oldTime?: string;
  promoCode?: string;
  discountPercentage?: number;
}

export enum EmailBodyTempEnum {
  APPOINTMENT_CONFIRMATION = "appointmentConfirmation",
  UPDATE_TO_YOUR_APPOINTMENT_DETAILS = 'updateToYourAppointmentDetails',
  CONFIRMATION_OF_FORM_SUBMISSION = 'confirmationOfFormSubmission',
  FEEDBACK_SUBMISSION_SUCCESS = 'feedbackSubmissionSuccess'
}

export const emailFromDetails = {
  [EmailBodyTempEnum.APPOINTMENT_CONFIRMATION]: 'Appoinment@alerts.myclinicmd.com',
  [EmailBodyTempEnum.UPDATE_TO_YOUR_APPOINTMENT_DETAILS]: 'Appoinment@alerts.myclinicmd.com',
  [EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION]: 'POS@alerts.myclinicmd.com',
  [EmailBodyTempEnum.FEEDBACK_SUBMISSION_SUCCESS]: 'Feedback@alerts.myclinicmd.com'
}

export interface EmailContent {
  subject: string;
  body: (data: EmailBodyInterface) => string;
}

export type EmailBodyContent = {
  [key: string]: {
    [key in EmailBodyTempEnum]: EmailContent;
  };
};

export const emailBodyContent: EmailBodyContent = {
  en: {
    [EmailBodyTempEnum.APPOINTMENT_CONFIRMATION]: {
      subject: "Appointment Confirmation - Clinica San Miguel",
      body: (data: EmailBodyInterface): string => {
        const { name, location, service, date, time } = data;
        return `
            <tbody>
              <tr>
                <td style="padding: 20px;">
                  <p>Dear <strong>${name}</strong>,</p>
                  <p>Thank you for choosing Clinica San Miguel. Your appointment request has been successfully received. Below are the details of your appointment:</p>
                  <ul style="list-style: none; padding: 0;">
                    <li>Location: <strong>${location.title}, ${location.address}</strong></li>
                    <li>Service: <strong>${service}</strong></li>
                    <li>Date: <strong>${date}</strong></li>
                    <li>Time: <strong>${time}</strong></li>
                  </ul>
                  <p>Our team looks forward to welcoming you and ensuring you receive the best care possible. If you have any questions or need to make changes to your appointment, please don't hesitate to contact us at <a href="mailto:contact@clinicsanmiguel.com">contact@clinicsanmiguel.com</a> or at ${location.phone}.</p>
                  <p>Thank you for trusting us with your care.</p>
                  <p>Best regards,<br><strong>Clinica San Miguel Team</strong></p>
                </td>
              </tr>
            </tbody>`;
      },
    },
    [EmailBodyTempEnum.UPDATE_TO_YOUR_APPOINTMENT_DETAILS]: {
      subject: "Update to Your Appointment Details - Clinica San Miguel",
      body: (data: EmailBodyInterface): string => {
        const { name, location, service, date, time } = data;
        return `
            <tbody>
            <tr>
                <td style="padding: 20px;">
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Thank you for choosing Clinica San Miguel. Your appointment request has been successfully received. Below are the details of your appointment:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>Location: <strong>${location.title}, ${location.address}</strong></li>
                        <li>Service: <strong>${service}</strong></li>
                        <li>Date: <strong>${date}</strong></li>
                        <li>Time: <strong>${time}</strong></li>
                    </ul>
                    <p>Our team looks forward to welcoming you and ensuring you receive the best care possible. If you have any questions or need to make changes to your appointment, please don't hesitate to contact us at <a href="mailto:contact@clinicsanmiguel.com">contact@clinicsanmiguel.com</a> or at ${location.phone}.</p>
                    <p>Thank you for trusting us with your care.</p>
                    <p>Best regards,<br><strong>Clinica San Miguel Team</strong></p>
                </td>
            </tr>
          </tbody>`;
      },
    },
    [EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION]: {
      subject: "Appointment Confirmation - Clinica San Miguel",
      body: (data: EmailBodyInterface): string => {
        const { name, location, service } = data;
        return `
            <tbody>
          <tr>
            <td style="padding: 20px;">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for choosing Clinica San Miguel. Your appointment request has been successfully received. Below are the details of your appointment:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Location: <strong>${location.title}, ${location.address}</strong></li>
                <li>Service: <strong>${service}</strong></li>
              </ul>
              <p>Our team looks forward to welcoming you and ensuring you receive the best care possible. If you have any questions or need to make changes to your appointment, please don't hesitate to contact us at <a href="mailto:contact@clinicsanmiguel.com">contact@clinicsanmiguel.com</a> or at ${location.phone}.</p>
              <p>Thank you for trusting us with your care.</p>
              <p>Best regards,<br><strong>Clinica San Miguel Team</strong></p>
            </td>
          </tr>
        </tbody>`;
      },
    },
    [EmailBodyTempEnum.FEEDBACK_SUBMISSION_SUCCESS]: {
      subject: "Thank You for Your Feedback - Enjoy Discount on Your Next Visit!",
      body: (data: EmailBodyInterface): string => {
        const { name, promoCode, location, discountPercentage = 10 } = data;
        return `
            <tbody>
              <tr>
                <td style="padding: 20px;">
                  <h1 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 16px;">
                    Thank You for Your Feedback – Enjoy ${discountPercentage}% Off on Your Next Visit!
                  </h1>
                  <p>Dear <strong>${name}</strong>,</p>
                  <p>
                    We sincerely appreciate you taking the time to share your feedback with us. 
                    Your input helps us improve and deliver the best possible care at Clínica San Miguel.
                  </p>
                  <p>
                    As a token of our gratitude, we are pleased to offer you <strong>${discountPercentage}% off</strong> 
                    on your next visit! Simply use the promo code <strong>${promoCode}</strong> 
                    when you schedule your appointment or make your next purchase.
                  </p>
                  <p>
                    We look forward to welcoming you back soon!
                  </p>
                  <p>
                    Warm regards,<br />
                    Team,<br />
                    <strong>Clínica San Miguel</strong>
                  </p>
                  <div style="margin-top: 32px; color: #666;">
                    Manage by MyClinicMD
                  </div>
                </td>
              </tr>
            </tbody>`;
      },
    },
  },
  es: {
    [EmailBodyTempEnum.APPOINTMENT_CONFIRMATION]: {
      subject: "Confirmación de Cita - Clinica San Miguel",
      body: (data: EmailBodyInterface): string => {
        const { name, location, service, date, time } = data;
        return `
          <tbody>
          <tr>
            <td style="padding: 20px;">
              <p>Estimado/a <strong>${name}</strong>,</p>
              <p>
                Gracias por elegir Clinica San Miguel. Su solicitud de cita ha sido recibida con éxito. A continuación, encontrará los detalles de su cita:
              </p>
              <ul style="list-style: none; padding: 0;">
                <li>Ubicación:<strong> ${location.title}, ${location.address}</strong></li>
                <li>Servicio:<strong> ${service}</strong></li>
                <li>Fecha:<strong> ${date}</strong></li>
                <li>Hora:<strong> ${time}</strong></li>
              </ul>
              <p>
                Nuestro equipo espera darle la bienvenida y garantizarle la mejor atención posible. 
                Si tiene alguna pregunta o necesita realizar cambios en su cita, no dude en contactarnos en 
                <a href="mailto:contact@clinicsanmiguel.com">contact@clinicsanmiguel.com</a> o al teléfono ${location.phone}.
              </p>
              <p>Gracias por confiar en nosotros para su cuidado.</p>
              <p>Atentamente,<br><strong>Equipo de Clinica San Miguel</strong></p>
            </td>
          </tr>
        </tbody>`;
      },
    },
    [EmailBodyTempEnum.UPDATE_TO_YOUR_APPOINTMENT_DETAILS]: {
      subject: "Actualización de su cita - Clinica San Miguel",
      body: (data: EmailBodyInterface): string => {
        const { name, location, service, date, time, oldDate, oldTime } = data;
        return `
          <tbody>
          <tr>
            <td style="padding: 20px;">
              <p>Estimado/a <strong>${name}</strong>,</p>
              <p>
                Le informamos que su cita en Clinica San Miguel ha sido actualizada. A continuación, encontrará los nuevos detalles de su cita:
              </p>
              <ul style="list-style: none; padding: 0;">
                <li>Fecha y Hora Anteriores:<strong> ${oldDate}</strong>  a las <strong>${oldTime}</strong></li>
                <li>Nueva Fecha y Hora:<strong> ${date}</strong> a las <strong> ${time}</strong></li>
                <li>Ubicación:<strong> ${location.title}, ${location.address}</strong></li>
                <li>Servicio:<strong> ${service}</strong> </li>
              </ul>
              <p>
                Lamentamos cualquier inconveniente que este cambio pueda causar y agradecemos su comprensión. 
                Si la nueva fecha o hora no le resulta conveniente, por favor contáctenos en 
                <a href="mailto:contact@clinicsanmiguel.com">contact@clinicsanmiguel.com</a> o al teléfono ${location.phone} 
                para reprogramar su cita en un momento que le sea más adecuado.
              </p>
              <p>
                Gracias por su paciencia y por confiar en Clinica San Miguel para su cuidado.
              </p>
              <p>Atentamente,<br><strong>Equipo de Clinica San Miguel</strong></p>
            </td>
          </tr>
        </tbody>`;
      },
    },
    [EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION]: {
      subject: "Confirmación de Cita - Clinica San Miguel",
      body: (data: EmailBodyInterface): string => {
        const { name, location, service } = data;
        return `
           <tbody>
          <tr>
            <td style="padding: 20px;">
              <p>Estimado/a <strong>${name}</strong>,</p>
              <p>
                Gracias por enviar su formulario en Clinica San Miguel. Nos complace informarle que su registro ha sido recibido y procesado correctamente en nuestro sistema POS.
              </p>
              <p>
                Servicio:<strong>${service}</strong> <br>
                Ubicación:<strong>${location.title} - ${location.address}</strong> 
              </p>
              <p>
                Si tiene alguna pregunta o necesita más asistencia, no dude en comunicarse con nosotros a 
                <a href="mailto:contact@clinicsanmiguel.com">contact@clinicsanmiguel.com</a> o al teléfono ${location.phone}.
              </p>
              <p>
                Gracias por elegirnos para sus necesidades de atención médica.
              </p>
              <p>Atentamente,<br><strong>El equipo de Clinica San Miguel</strong></p>
            </td>
          </tr>
        </tbody>`;
      },
    },
    [EmailBodyTempEnum.FEEDBACK_SUBMISSION_SUCCESS]: {
      subject: "Gracias por su Comentario - ¡Disfrute de Descuento en su Próxima Visita!",
      body: (data: EmailBodyInterface): string => {
        const { name, promoCode, location, discountPercentage = 10 } = data;
        return `
            <tbody>
              <tr>
                <td style="padding: 20px;">
                  
                  <h1 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 16px;">
                    Gracias por su Comentario – ¡Disfrute de un ${discountPercentage}% de Descuento en su Próxima Visita!
                  </h1>
                  <p>Estimado/a <strong>${name}</strong>,</p>
                  <p>
                    Agradecemos sinceramente que se haya tomado el tiempo de compartir su opinión con nosotros.
                    Sus comentarios nos ayudan a mejorar y brindar la mejor atención posible en Clínica San Miguel.
                  </p>
                  <p>
                    ¡Como muestra de nuestro agradecimiento, nos complace ofrecerle un <strong>${discountPercentage}% de descuento</strong>
                    en su próxima visita! Simplemente use el código promocional <strong>${promoCode}</strong>
                    cuando programe su cita o realice su próxima compra.
                  </p>
                  <p>
                    ¡Esperamos darle la bienvenida pronto!
                  </p>
                  <p>
                    Saludos cordiales,<br />
                    Equipo,<br />
                    <strong>Clínica San Miguel</strong>
                  </p>
                  <div style="margin-top: 32px; color: #666;">
                    Administrado por MyClinicMD
                  </div>
                </td>
              </tr>
            </tbody>`;
      },
    },
  },
};

export const getEmailTemplates = ({
  lang,
  emailType,
  data,
}: {
  lang: keyof typeof emailBodyContent;
  emailType: EmailBodyTempEnum;
  data: EmailBodyInterface;
}): string => {
  const emailContent = emailBodyContent[lang][emailType];
  const emailBody = emailContent.body(data);

  return `<!DOCTYPE html>
  <html lang="${lang}">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailContent.subject}</title>
  </head>
  
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffff;">
    <table
      style="width: 100%; max-width: 800px; margin: 20px auto; background-color: #ffff; overflow: hidden;">
      ${emailBody}
    </table>
  </body>
  
  </html>`;
};

