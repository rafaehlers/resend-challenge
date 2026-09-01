import type { CSSProperties } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

export type BillingFailureEmailProps = {
  customerName: string;
  amount: string;
  invoiceNumber: string;
  retryDate: string;
  updatePaymentUrl: string;
  supportUrl: string;
  repositoryUrl?: string;
};

export default function BillingFailureEmail({
  customerName,
  amount,
  invoiceNumber,
  retryDate,
  updatePaymentUrl,
  supportUrl,
  repositoryUrl,
}: BillingFailureEmailProps) {
  return (
    <Html lang="en">
      <Head />

      <Preview>
        We couldn&apos;t process your payment for Jiddu.app
      </Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            We couldn&apos;t process your payment
          </Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            We couldn&apos;t process your {amount} payment for invoice{" "}
            {invoiceNumber}.
          </Text>

          <Text style={text}>
            We&apos;ll automatically retry the payment on {retryDate}. You can
            update your payment method now to avoid an interruption.
          </Text>

          <Section style={buttonContainer}>
            <Button href={updatePaymentUrl} style={button}>
              Update payment method
            </Button>
          </Section>

          <Text style={text}>
            If you have any questions, reply to this email or{" "}
            <Link href={supportUrl} style={link}>
              contact our support team
            </Link>
            .
          </Text>

          {repositoryUrl ? (
            <>
              <Hr style={divider} />

              <Text style={demoText}>
                Take-home challenge demo:{" "}
                <Link href={repositoryUrl} style={link}>
                  view the source code on GitHub
                </Link>
                .
              </Text>
            </>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}

BillingFailureEmail.PreviewProps = {
  customerName: "Brian",
  amount: "$49.00",
  invoiceNumber: "#INV-2026-1042",
  retryDate: "September 3, 2026",
  updatePaymentUrl: "https://jiddu.app/pricing",
  supportUrl: "https://jiddu.app/contact",
  repositoryUrl: "https://github.com/rafaehlers/resend-challenge",
} satisfies BillingFailureEmailProps;

const main: CSSProperties = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  margin: 0,
  padding: "40px 16px",
};

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};

const heading: CSSProperties = {
  color: "#111111",
  fontSize: "26px",
  lineHeight: "34px",
  margin: "0 0 24px",
};

const text: CSSProperties = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonContainer: CSSProperties = {
  margin: "28px 0",
  textAlign: "center",
};

const button: CSSProperties = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 20px",
  textDecoration: "none",
};

const link: CSSProperties = {
  color: "#444ce7",
  textDecoration: "underline",
};

const divider: CSSProperties = {
  borderColor: "#e5e5e5",
  margin: "28px 0 20px",
};

const demoText: CSSProperties = {
  color: "#666666",
  fontSize: "13px",
  lineHeight: "20px",
  margin: 0,
};