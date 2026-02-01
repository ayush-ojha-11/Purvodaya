import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Subject: {
        Data: "Reset your password",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <h2>Password Reset</h2>
            <p>You requested a password reset.</p>
            <p>This link is valid for 15 minutes.</p>
            <a href="https://yourdomain.com/reset-password/token">
              Reset Password
            </a>
          `,
          Charset: "UTF-8",
        },
      },
    },
    Source: fromAddress, // must be SES-verified
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "purvodaya.web@gmail.com",
    "noreply@purvodayaenergy.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};
export { run };
