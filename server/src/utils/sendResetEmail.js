import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const createSendEmailCommand = (toAddress, fromAddress, resetUrl) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Subject: {
        Data: "Reset your password - Purvodaya Portal",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Reset</title>
            </head>
            <body
            style="
                margin:0;
                padding:0;
                background-color:#f4f6f8;
                font-family:Arial,Helvetica,sans-serif;
            "
            >
            <!-- Preheader (hidden preview text) -->
            <div
                style="
                display:none;
                max-height:0;
                overflow:hidden;
                font-size:1px;
                line-height:1px;
                color:#f4f6f8;
                "
            >
                Reset your password – link expires in 15 minutes.
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                <td align="center" style="padding:40px 16px;">
                    <!-- Container -->
                    <table
                    width="480"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                        width:100%;
                        max-width:480px;
                        background-color:#ffffff;
                        border-radius:8px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.08);
                    "
                    >
                    <!-- Header -->
                    <tr>
                        <td
                        style="
                            padding:24px 32px 8px;
                            text-align:center;
                        "
                        >
                        <h2
                            style="
                            margin:0;
                            font-size:20px;
                            font-weight:600;
                            color:#111827;
                            "
                        >
                            Reset your password
                        </h2>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td
                        style="
                            padding:16px 32px;
                            color:#374151;
                            font-size:14px;
                            line-height:1.6;
                        "
                        >
                        <p style="margin:0 0 12px;">
                            We received a request to reset your password.
                        </p>

                        <p style="margin:0 0 20px;">
                            Click the button below to choose a new password. This link is valid for
                            <strong>15 minutes</strong>.
                        </p>

                        <!-- Button (Outlook-safe) -->
                        <table
                            align="center"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="margin:24px auto;"
                        >
                            <tr>
                            <td
                                align="center"
                                bgcolor="#2563eb"
                                style="
                                border-radius:6px;
                                "
                            >
                                <a
                                href="${resetUrl}"
                                target="_blank"
                                style="
                                    display:inline-block;
                                    padding:12px 24px;
                                    font-size:14px;
                                    font-weight:600;
                                    color:#ffffff;
                                    text-decoration:none;
                                    border-radius:6px;
                                "
                                >
                                Reset Password
                                </a>
                            </td>
                            </tr>
                        </table>

                        <!-- Fallback link -->
                        <p
                            style="
                            margin:24px 0 0;
                            font-size:12px;
                            color:#6b7280;
                            word-break:break-all;
                            "
                        >
                            If the button doesn’t work, copy and paste this link into your browser:
                            <br />
                            <a
                            href="${resetUrl}"
                            style="color:#2563eb;text-decoration:underline;"
                            >
                            ${resetUrl}
                            </a>
                        </p>

                        <p
                            style="
                            margin:24px 0 0;
                            font-size:12px;
                            color:#6b7280;
                            "
                        >
                            If you didn’t request a password reset, you can safely ignore this email.
                        </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                        style="
                            padding:16px 32px 24px;
                            text-align:center;
                            font-size:11px;
                            color:#9ca3af;
                        "
                        >
                        <p style="margin:0;">
                            © ${new Date().getFullYear()} Purvodaya Energy Solutions. All rights reserved.
                        </p>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            </body>
            </html>

          `,
        },
        Text: {
          Data: `Reset your password using this link: ${resetUrl}`,
          Charset: "UTF-8",
        },
      },
    },
    Source: fromAddress, // SES verified
  });
};

const sendResetEmail = async (toEmail, resetUrl) => {
  const command = createSendEmailCommand(
    toEmail,
    "noreply@purvodayaenergy.com",
    resetUrl,
  );

  try {
    return await sesClient.send(command);
  } catch (error) {
    if (error.name === "MessageRejected") {
      console.error("SES rejected email:", error);
      return null;
    }
    throw error;
  }
};

export { sendResetEmail };
