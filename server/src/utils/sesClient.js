import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

const REGION = "eu-north-1";

dotenv.config();

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  },
});

export { sesClient };
