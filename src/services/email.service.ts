import nodemailer, { Transporter } from "nodemailer";
import { SendEmailOptions } from "../types/email/email.type";
import { EmailConfigurationError, EmailSendError } from "../errors/app-error";

export const createEmailSender = (
  transporter: Transporter,
  emailFrom: string
) => {
  return async (options: SendEmailOptions): Promise<void> => {
    if (!transporter) {
      throw new EmailConfigurationError("SMTP transporter is not configured.");
    }

    if (!emailFrom) {
      throw new EmailConfigurationError(
        "Sender email (EMAIL_FROM) is missing."
      );
    }

    try {
      await transporter.sendMail({
        from: emailFrom,
        to: options.to,
        subject: options.template.subject,
        text: options.template.text,
        html: options.template.html,
      });
    } catch (error) {
      throw new EmailSendError(
        `Could not send email to ${options.to}. Please try again later.`
      );
    }
  };
};

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@terrano.com.br";
export const sendEmail = createEmailSender(transporter, EMAIL_FROM);
