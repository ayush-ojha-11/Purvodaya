import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (toEmail, resetUrl) => {
  await resend.emails.send({
    from: "no-reply@purvodayaenergy.com", // use onboarding@resend.dev for testing
    to: toEmail,
    subject: "Password Reset Request - Purvodaya",
    html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:40px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table role="presentation" width="480" cellspacing="0" cellpadding="0"
                    style="background:#ffffff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

                <tr>
                  <td style="text-align:center;">
                    <h2 style="margin:0; color:#111827;">Reset Your Password</h2>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:16px; color:#374151; font-size:14px; line-height:1.6;">
                    We received a request to reset your password. Click the button below to create a new one.
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:28px 0;">
                    <a href="${resetUrl}"
                      style="display:inline-block;
                              padding:14px 28px;
                              font-size:15px;
                              font-weight:bold;
                              background:#4F46E5;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:6px;">
                      Reset Password
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="font-size:13px; color:#6b7280; line-height:1.6;">
                    This link will expire in <strong>15 minutes</strong> for security reasons.
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:12px; font-size:13px; color:#6b7280;">
                    If the button doesn't work, copy and paste the following link into your browser:
                  </td>
                </tr>

                <tr>
                  <td style="word-break:break-all; font-size:12px; color:#4F46E5; padding-top:6px;">
                    ${resetUrl}
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:24px; font-size:13px; color:#9ca3af;">
                    If you didn’t request a password reset, you can safely ignore this email.
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:20px; font-size:12px; color:#9ca3af; text-align:center;">
                    © ${new Date().getFullYear()} Purvodaya Energy Solutions. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
};
