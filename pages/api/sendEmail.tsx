import { Resend } from "resend";
import { NextApiRequest, NextApiResponse } from "next";
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, userEmail, recipientEmail, message } = req.body;

  try {
    const emailResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL as string,
      to: recipientEmail,
      subject: `Message from ${name}`,
      text: message,
      replyTo: userEmail,
    });

    res
      .status(200)
      .json({ message: "Email sent successfully", data: emailResponse });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
