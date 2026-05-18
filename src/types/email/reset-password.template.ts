import { EmailTemplate } from "./email.type";

interface ResetPasswordTemplateInput {
    resetLink: string;
}

export function resetPasswordTemplate(
    data: ResetPasswordTemplateInput,
): EmailTemplate {
    return {
        subject: "Redefinição de senha • Terrano",

        text: `
Você solicitou a redefinição da sua senha.

Acesse o link abaixo para criar uma nova senha:
${data.resetLink}

Se você não solicitou essa alteração, ignore este email.
        `.trim(),

        html: `
            <div style="
                margin: 0;
                padding: 40px 20px;
                background-color: #F5F7F6;
                font-family: Arial, sans-serif;
                color: #1F2937;
            ">
                <table 
                    align="center"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        max-width: 600px;
                        background-color: #FFFFFF;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    "
                >
                    <tr>
                        <td style="
                            background-color: #065F46;
                            padding: 32px;
                            text-align: center;
                        ">
                            <h1 style="
                                margin: 0;
                                color: #FFFFFF;
                                font-size: 28px;
                                font-weight: bold;
                            ">
                                Terrano
                            </h1>

                            <p style="
                                margin: 12px 0 0;
                                color: rgba(255,255,255,0.85);
                                font-size: 14px;
                            ">
                                Redefinição de senha
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="
                                margin-top: 0;
                                margin-bottom: 20px;
                                font-size: 24px;
                                color: #111827;
                            ">
                                Olá 👋
                            </h2>

                            <p style="
                                margin: 0 0 16px;
                                font-size: 16px;
                                line-height: 1.7;
                                color: #4B5563;
                            ">
                                Recebemos uma solicitação para redefinir a senha da sua conta.
                            </p>

                            <p style="
                                margin: 0 0 32px;
                                font-size: 16px;
                                line-height: 1.7;
                                color: #4B5563;
                            ">
                                Clique no botão abaixo para criar uma nova senha com segurança.
                            </p>

                            <div style="text-align: center; margin-bottom: 32px;">
                                <a
                                    href="${data.resetLink}"
                                    style="
                                        display: inline-block;
                                        background-color: #065F46;
                                        color: #FFFFFF;
                                        text-decoration: none;
                                        padding: 14px 28px;
                                        border-radius: 10px;
                                        font-size: 16px;
                                        font-weight: bold;
                                    "
                                >
                                    Redefinir senha
                                </a>
                            </div>

                            <div style="
                                background-color: #F9FAFB;
                                border: 1px solid #E5E7EB;
                                border-radius: 10px;
                                padding: 16px;
                                margin-bottom: 24px;
                            ">
                                <p style="
                                    margin: 0 0 8px;
                                    font-size: 14px;
                                    font-weight: bold;
                                    color: #111827;
                                ">
                                    Não consegue clicar no botão?
                                </p>

                                <p style="
                                    margin: 0;
                                    font-size: 13px;
                                    line-height: 1.6;
                                    color: #6B7280;
                                    word-break: break-all;
                                ">
                                    ${data.resetLink}
                                </p>
                            </div>

                            <p style="
                                margin: 0;
                                font-size: 13px;
                                line-height: 1.7;
                                color: #6B7280;
                            ">
                                Se você não solicitou essa alteração, pode ignorar este email com segurança.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="
                            padding: 24px 32px;
                            background-color: #F9FAFB;
                            border-top: 1px solid #E5E7EB;
                            text-align: center;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 12px;
                                color: #9CA3AF;
                            ">
                                © ${new Date().getFullYear()} Terrano. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `,
    };
}