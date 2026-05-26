import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT
  ? Number(process.env.SMTP_PORT)
  : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM =
  process.env.EMAIL_FROM || SMTP_USER || "no-reply@example.com";

let transporter: nodemailer.Transporter | null = null;
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
}

interface ResetEmailOptions {
  to: string;
  resetLink: string;
}

export async function sendResetPasswordEmail(
  options: ResetEmailOptions
): Promise<void> {
  if (!transporter) {
    console.warn("SMTP is not configured. Skipping password reset email.");
    console.info(`Reset link: ${options.resetLink}`);
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: options.to,
    subject: "Redefinição de senha Terrano",
    text: `Para redefinir sua senha, acesse: ${options.resetLink}`,
    html: `
            <p>Para redefinir sua senha, clique no link abaixo:</p>
            <p><a href="${options.resetLink}" target="_blank">Defina sua senha</a></p>
            <p>Se você não solicitou essa alteração, ignore esta mensagem.</p>
        `,
  });
}
