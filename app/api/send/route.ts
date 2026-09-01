import { readFile } from "node:fs/promises";
import path from "node:path";
import BillingFailureEmail from "@/emails/billing-failure-email";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const repositoryUrl =
    process.env.REPOSITORY_URL ??
    "https://github.com/rafaehlers/resend-challenge";

  if (!apiKey || !fromEmail || !toEmail) {
    return Response.json(
      {
        error:
          "Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or RESEND_TO_EMAIL.",
      },
      { status: 500 },
    );
  }

  try {
    const attachmentPath = path.join(
      process.cwd(),
      "attachments",
      "sample-invoice.txt",
    );

    const attachment = await readFile(attachmentPath);
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: "support@emails.jiddu.app",
      subject: "We couldn't process your payment",
      react: BillingFailureEmail({
        customerName: "Brian",
        amount: "$49.00",
        invoiceNumber: "#INV-2026-1042",
        retryDate: "September 3, 2026",
        updatePaymentUrl: "https://jiddu.app/pricing",
        supportUrl: "https://jiddu.app/contact",
        repositoryUrl,
      }),
      attachments: [
        {
          content: attachment.toString("base64"),
          filename: "sample-invoice.txt",
        },
      ],
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while sending.";

    return Response.json({ error: message }, { status: 500 });
  }
}