```text
█████████████▄▄                                                                  ███
▀▀▀▀▀▀▀▀▀▀██████                                                                 ███
           █████     ▄▄▄▄▄       ▄▄▄▄▄▄        ▄▄▄▄▄      ▄▄▄  ▄▄▄▄        ▄▄▄▄  ███
          ▄████▀  ▄████████▄   ▄█████████▄   ▄████████▄  ▀██████████▄   ▄███████████
     ▄████▀▀▀▀   ███▀    ▀███  ███▄   ▀▀▀▀  ███▀    ▀███ ▀███▀   ▀███▄ ▄███▀   ▀████
    ▀█████▄      ████████████▄ ▀████████▄▄ ▄████████████  ███     ████ ███▀      ███
      ▀█████▄    ████▀▀▀▀▀▀▀▀     ▀▀▀▀▀███  ███▀▀▀▀▀▀▀▀▀  ███     ████ ████     ▄███
        ▀█████▄  ▀████▄▄▄████  ████▄▄▄▄███  ▀███▄▄▄▄███▀ ▄███     ████  ████▄▄▄█████
          ▀█████▄  ▀██████▀▀    ▀▀██████▀     ▀██████▀   ▀███     ████   ▀█████▀▀███
```

# Customer Success Engineer - Take-Home Challenge

[Skip to Task 2: Customer tickets](#task-2)

## Task 1: Tutorial

1. [Setup](#1-setup)
2. [Configure Resend](#2-configure-resend)
3. [Create the email](#3-create-the-email)
4. [Add the attachment](#4-add-the-attachment)
5. [Create the sending route](#5-create-the-sending-route)
6. [Preview and send](#6-preview-and-send)
7. [Testing notes](#7-testing-notes)
8. [References](#8-references)


### 1. Setup

This project requires Node.js 20.9 or newer, npm, a Resend account, and a Resend API key.

A [verified domain](https://resend.com/docs/dashboard/domains/introduction) is only required when sending to addresses other than the email linked to your Resend account. For this example, I am using `emails.jiddu.app`, a verified sending subdomain of `jiddu.app` (a personal website of mine).

Let's start by creating a new Next.js project in a folder called `resend-challenge`:

```bash
npx create-next-app@latest resend-challenge
```

I used these options:

| Prompt | Choice | Reason |
| --- | --- | --- |
| TypeScript | Yes | The email component uses typed props, and the sending route is written in TypeScript |
| ESLint | Yes | `npm run lint` checks the email component and API route before submission |
| Tailwind CSS | No | The email uses inline styles, so Tailwind would not be used |
| `src/` directory | No | Keeps the challenge files at `app/api/send` and `emails` as shown in the tutorial |
| App Router | Yes | The sending endpoint lives in `app/api/send/route.ts` as an App Router route handler |
| React Compiler | No | The project renders one email on the server and does not need client-side render optimization |
| Customize import alias | No | The route uses the default alias to import `@/emails/billing-failure-email` |
| `AGENTS.md` | No | No repository-specific agent instructions are needed to run or review the project |

Then, move into the project directory and install the Resend SDK, React Email, and the React Email UI package:

```bash
cd resend-challenge
npm install resend react-email
npm install --save-dev --save-exact @react-email/ui
```

After installing them, add the React Email command to `package.json`:

```json
{
  "scripts": {
    "email:dev": "email dev --port 3001"
  }
}
```

This keeps the two local servers on different ports:

| URL | Purpose |
| --- | --- |
| [http://localhost:3000](http://localhost:3000) | Next.js application |
| [http://localhost:3001](http://localhost:3001) | React Email preview |

Before creating the template, add the folders that will hold the email and its attachment:

```bash
mkdir -p emails attachments
```

### 2. Configure Resend

Next, create a [Resend API key](https://resend.com/docs/dashboard/api-keys/introduction). If you are testing without your own domain, use `onboarding@resend.dev` as the sender. You can send to the email address connected to your Resend account or to one of [Resend's test addresses](https://resend.com/docs/dashboard/emails/send-test-emails). To send to other recipients, you need to [verify a domain](https://resend.com/docs/dashboard/domains/introduction). I will use the verified `emails.jiddu.app` subdomain mentioned above.

Copy the environment example to `.env.local`:

```bash
cp .env.example .env.local
```

Then open `.env.local` and add the API key and email addresses:

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="Acme <onboarding@resend.dev>"
RESEND_TO_EMAIL=your-resend-account-email@example.com
REPOSITORY_URL=https://github.com/rafaehlers/resend-challenge
```

Replace the placeholder API key and email addresses with your own values before continuing.

### 3. Create the email

With the project configured, create `emails/billing-failure-email.tsx`. The file has five parts:

- The imports bring in the React Email components and the type used by the styles.
- `BillingFailureEmailProps` defines the data required by the template.
- `BillingFailureEmail` builds the email and adds the optional repository link.
- `PreviewProps` provides sample data for the local preview.
- The `CSSProperties` objects keep the styles compatible with email clients.

This is the complete template used by the project:

```tsx
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
```

### 4. Add the attachment

Next, create `attachments/sample-invoice.txt` with the invoice data used by the example:

```text
Jiddu.app

Invoice: #INV-2026-1042
Customer: Brian
Amount: $49.00
Status: Payment failed
Next retry: September 3, 2026
```

The sending route will read this file and attach its [Base64 content](https://resend.com/docs/dashboard/emails/attachments#send-attachments-from-a-local-file) to the email (Base64 converts the file's bytes into a text string that can be sent in the API request).

### 5. Create the sending route

Now create the endpoint at `app/api/send/route.ts`. The route has six parts:

- The imports bring in the Node.js file helpers, the email template, and the Resend SDK.
- `runtime = "nodejs"` allows the route to read the local attachment with Node.js APIs.
- `POST` loads the environment variables and uses the repository URL as a fallback.
- The first check stops the request when a required environment variable is missing.
- Inside `try`, the route reads the attachment and sends the rendered template through Resend.
- The final checks return either the Resend result or an error as JSON.

This is the complete route used by the project:

```tsx
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
```

### 6. Preview and send

With the template and route in place, open a terminal window in the project folder and run the command below. This starts the React Email preview at [http://localhost:3001](http://localhost:3001):

```bash
npm run email:dev
```

Keep the preview running and start Next.js in another terminal:

```bash
npm run dev
```

From another terminal, use `curl` to send a `POST` request to the route:

```bash
curl -i -X POST http://localhost:3000/api/send
```

If the request succeeds, Resend returns an [email ID](https://resend.com/docs/api-reference/emails/send-email). Our route sends that response back under `data`:

```json
{
  "data": {
    "id": "example-email-id"
  }
}
```

After sending it, open the [email record in the Resend dashboard](https://resend.com/docs/dashboard/emails/introduction) and check its `Sent` and `Delivered` events. Before committing, run the final checks below. `npm run lint` looks for code issues, while `npm run build` confirms that Next.js and TypeScript can create a production build:

```bash
npm run lint
npm run build
```

### 7. Testing notes

My first test reached Gmail's spam folder even though SPF, DKIM, and DMARC passed. [Resend Insights](https://resend.com/docs/dashboard/emails/deliverability-insights) flagged two `example.com` links that did not match the sending domain. I replaced them with real `jiddu.app` links and the next test reached the inbox.

That single test does not prove the links were the only cause, but it was enough to treat them as a likely contributor.

### 8. References

#### Next.js

- [Installation](https://nextjs.org/docs/app/getting-started/installation)
- [`create-next-app` CLI](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- [App Router](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Route handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Environment variables](https://nextjs.org/docs/app/guides/environment-variables)

#### React Email

- [Introduction](https://react.email/docs/introduction)
- [Manual setup](https://react.email/docs/getting-started/manual-setup)
- [CLI](https://react.email/docs/cli)
- [Preview component](https://react.email/docs/components/preview)
- [Resend integration](https://react.email/docs/integrations/resend)

#### Resend

- [Send emails with Next.js](https://resend.com/docs/send-with-nextjs)
- [Template emails with React Email](https://resend.com/docs/knowledge-base/template-emails-with-react-email)
- [Send Email API](https://resend.com/docs/api-reference/emails/send-email)
- [Attachments](https://resend.com/docs/dashboard/emails/attachments)
- [API keys](https://resend.com/docs/dashboard/api-keys/introduction)
- [Verified domains](https://resend.com/docs/dashboard/domains/introduction)
- [Deliverability Insights](https://resend.com/docs/dashboard/emails/deliverability-insights)

#### Demo links

- [Jiddu pricing](https://jiddu.app/pricing)
- [Jiddu contact](https://jiddu.app/contact)
- [Project repository](https://github.com/rafaehlers/resend-challenge)

---

<a id="task-2"></a>

## Task 2: **Customers Tickets**

### How I prioritized the tickets

- **Impact:** How many messages or recipients are affected, and is a critical transactional email involved?
- **Urgency:** Is the issue ongoing, or are time-sensitive emails being delayed, bounced, or not reaching recipients?
- **Scope:** Is it limited to one email, sending domain, recipient domain, or mailbox provider?
- **Workaround:** Can the customer retry safely, queue or throttle requests, or use a temporary workaround?
- **Evidence:** Do we have email IDs, timestamps, API responses, and delivery events?

| Ticket | Message | Label | Priority | Response | Internal Notes |
| --- | --- | --- | ---: | --- | --- |
| RES-7921 | My emails suddenly stopped sending last night for 4 hours and thousands of magic links didn’t send. What happened? This is unacceptable. | Time-sensitive / sending queue / bug / engineering escalation | **1** | [View response](#res-7921-response) | I ranked this first because thousands of time-sensitive authentication emails were affected and the issue may be on our end. I need to check the logs and confirm it with Engineering or a Deliverability specialist. |
| RES-3485 | When I send a request to trigger a notification, I get an error message in the system. The user does not receive the email, and the system displays an error message: “Too many requests. You can only make 2 requests per second. See rate limit response headers for more information. Or contact support to increase rate limit.” | API / rate limiting | **2** | [View response](#res-3485-response) | I ranked this second because notifications are failing now, although the error gives me a clear place to start. I need to review the account’s `429` logs and rate-limit headers, check whether another application or API key is sharing the limit, and confirm that the applied limit matches the account setting. |
| RES-1348 | I’m seeing a ton of 403 errors on my account. How do I fix that? | API / access and authorization | **3** | [View response](#res-1348-response) | I ranked this third because a high number of `403` errors may be blocking several requests, but I still don’t know the exact cause or scope. I need to check the account’s logs before suggesting a fix, then look at the API key, permissions, sending domain, or test-recipient restrictions based on the response. |
| RES-2196 | My emails are going to the spam folder at Gmail. What can I do to stop this? | Deliverability / Gmail / spam folder | **4** | [View response](#res-2196-response) | I ranked this fourth because spam placement is hurting deliverability, but it is less urgent than requests failing outright. I need a recent affected email ID so I can review its Insights. I should also check the domain’s SPF, DKIM, and DMARC records, complaint and bounce rates, recent volume changes, and whether this affects all Gmail recipients or only one type of email. |
| RES-5842 | I need to be able to receive emails from Resend. How do I do that? | Receiving / inbound / webhooks / MX records | **5** | [View response](#res-5842-response) | I ranked this fifth because it is a setup question with no reported outage. I should first find out whether they want to use the Resend-managed `*.resend.app` address or their own domain. If it’s a custom domain, I need to check the existing MX records, recommend a subdomain if needed, and confirm that Receiving and the `email.received` webhook are configured. |
| RES-1927 | I’m not sure how to add the TXT record at Vercel. Can you tell me how? | Domain verification / DNS / Vercel / TXT record | **6** | [View response](#res-1927-response) | I ranked this sixth because it is a documented DNS setup issue with a straightforward fix. I should send them the Vercel setup guide and confirm that Vercel manages their DNS. If it doesn’t, I need to point them to their current DNS provider. Once the records are added, I’ll ask them to verify the domain in Resend. |
| RES-2984 | How do i create an email? | Getting started / sending | **7** | [View response](#res-2984-response) | I ranked this last because it is a general getting-started question with no reported error or urgency. I need to explain the difference between transactional emails and Broadcasts, ask which language or framework they use, and send the right guide. |

### Complete ticket responses

<a id="res-7921-response"></a>

#### RES-7921: Magic-link sending interruption

##### Customer reply

```text
Hi [customer.first_name],

I’m sorry for the disruption this caused. I understand how serious this is,
especially for time-sensitive emails used for authentication.

I’m investigating it now and have escalated the issue to the appropriate team.
Could you confirm which sending domain was affected and whether new magic-link
emails are reaching recipients now?

I’ll keep you updated as we learn more.

Best,
Rafael
Customer Support Engineer
```

##### Engineering escalation

```text
Hi team,

I’m escalating RES-7921 as a possible sending pipeline bug. The customer reported
that thousands of magic-link emails stopped sending for approximately four hours.

I haven’t been able to reproduce this yet because the original ticket does not
include the affected sending domain or email IDs. Once I have those details, I’ll
use a test account with the same configuration, send a magic-link email through
`POST /emails`, and trace its email ID through the event logs to identify where it
stops.

This is urgent because thousands of time-sensitive authentication emails were
affected, preventing users from signing in.

Could someone review the sending queue and infrastructure logs for the customer’s
account and the affected time window?

Customer ID: 1234
Affected window (assumed for this exercise): 2026-08-28 00:00–04:00 UTC

I’ll add the confirmed domain and email IDs as soon as they are available.

Rafael
Customer Support Engineer
```

<a id="res-3485-response"></a>

#### RES-3485: Notifications blocked by rate limiting

##### Customer reply

```text
Hi [customer.first_name],

I’m sorry this is preventing notifications from reaching your users.

The error means the request is being rate-limited before Resend accepts the
notification.

The rate limit is shared across your entire Resend team, so requests from all
applications and API keys count toward the same limit. You can read more here:
https://resend.com/docs/knowledge-base/account-quotas-and-limits#rate-limit-scope

Are there any other triggers, workers, or services in your application sending
emails through the same Resend team? Their requests would count toward the same
limit, even if they use different API keys.

Also, could you trigger one notification and share the values of `ratelimit-limit`,
`ratelimit-remaining`, `ratelimit-reset`, and `retry-after` from the response
headers? Please do not share your API key or authorization header.

I’ll review the request logs on our side while you collect those values. Together,
they’ll help us confirm the exact limit being applied and decide the best next
step. The response headers are documented here:
https://resend.com/docs/api-reference/rate-limit#response-headers

If you have any trouble finding those headers, let me know and I’ll help.

Best,
Rafael
Customer Support Engineer
```

<a id="res-1348-response"></a>

#### RES-1348: Repeated 403 errors

##### Customer reply

```text
Hi [customer.first_name],

I’m sorry you’re seeing so many failed requests.

I’m reviewing the recent `403` logs on your account to identify which requests
are being rejected and why. Since a `403` can have different causes, I’ll confirm
the exact error before recommending a fix.

Could you confirm whether the errors are still happening?

I’ll keep you updated as I investigate.

Best,
Rafael
Customer Support Engineer
```

<a id="res-2196-response"></a>

#### RES-2196: Emails landing in Gmail spam

##### Customer reply

```text
Hi [customer.first_name],

I’m sorry your emails are landing in Gmail’s spam folder.

Could you share the email ID of a recent example and let me know whether this is
affecting all Gmail recipients or only some of them?

To find it, open Emails in your Resend dashboard, select the affected email, and
copy the ID displayed in the top-right corner.

I’ll review the email’s authentication, content, links, and Insights, along with
the recent sending activity for your domain. In the meantime, this guide covers
the main Gmail-specific recommendations:
https://resend.com/docs/knowledge-base/how-do-i-avoid-gmails-spam-folder

I’ll keep you updated as I investigate.

If you have any trouble finding the email ID, let me know and I can help you
locate it.

Best,
Rafael
Customer Support Engineer
```

<a id="res-5842-response"></a>

#### RES-5842: Receiving emails with Resend

##### Customer reply

```text
Hi [customer.first_name],

Sorry for the confusion! We’re still improving the inbound email experience. In
the dashboard, this feature is currently called Receiving.

There are two ways to receive emails with Resend:

1. Use your Resend-managed address. Open Emails in your Resend dashboard, select
   the Receiving tab, click the three-dot menu, and select Receiving address. You
   can receive emails at any address under the provided `*.resend.app` domain.

2. Use your own verified domain. Open Domains, select the domain, and enable
   Receiving. Resend will provide an MX record for you to add to your DNS provider.
   After adding it, click “I’ve added the record” and wait for the receiving record
   to show as verified.

If your main domain already has MX records for another email service, use a
dedicated subdomain to avoid affecting your existing inboxes. The custom-domain
setup is documented here:
https://resend.com/docs/dashboard/receiving/custom-domains

Finally, create a webhook for the `email.received` event. The webhook contains the
email metadata and ID, which you can use with the Receiving API to retrieve the
complete body, headers, and attachments. The full Receiving guide is here:
https://resend.com/docs/dashboard/receiving/introduction

Please let me know if you run into any issues while setting this up. We’re happy
to help!

Best,
Rafael
Customer Support Engineer
```

<a id="res-1927-response"></a>

#### RES-1927: Adding a TXT record in Vercel

##### Customer reply

```text
Hi [customer.first_name],

Have you had a chance to check our Vercel DNS guide? The manual setup section
explains how to add the TXT record:
https://resend.com/docs/knowledge-base/vercel

Before following the guide, make sure Vercel is managing your domain’s DNS. A
domain can be connected to a Vercel project while its DNS records are managed by
another provider.

If you don’t see the DNS Records section in Vercel, check where your domain’s
nameservers are pointing and add the record with that provider instead.

You can find Vercel’s instructions for managing DNS records here:
https://vercel.com/docs/domains/managing-dns-records

Once the records have been added, return to Resend and click Verify DNS Records.

If the domain remains pending, let me know and I’ll help you check it.

Best,
Rafael
Customer Support Engineer
```

<a id="res-2984-response"></a>

#### RES-2984: Creating and sending an email

##### Customer reply

```text
Hi [customer.first_name],

Resend supports two main email workflows: transactional emails and Broadcasts.

Broadcasts can be written and sent directly from the dashboard using the no-code
editor. They’re generally used for newsletters, product announcements, and other
emails sent to an audience. You can learn more about Broadcasts here:
https://resend.com/docs/dashboard/broadcasts/introduction

Transactional emails are triggered by your application through the Resend API,
an SDK, or SMTP. You can write the email in your code or create a reusable
Template in the Resend dashboard and reference it when sending.

This is a little different from a traditional email client, where you would use
a Compose button to write and send an individual message.

Could you let me know which type of email you’re creating and which language or
framework you’re using? I’ll point you to the right guide.

You can also browse our available Quickstarts here:
https://resend.com/docs/introduction

Best,
Rafael
Customer Support Engineer
```
