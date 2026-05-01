import { NextResponse } from "next/server";

type AbstractEmailResponse = {
  email_address?: string;
  email_deliverability?: {
    status?: string;
    status_detail?: string;
    is_format_valid?: boolean;
    is_smtp_valid?: boolean;
    is_mx_valid?: boolean;
    mx_records?: string[];
  };
  email_domain?: {
    domain?: string | null;
    is_live_site?: boolean | null;
    is_risky_tld?: boolean | null;
  };
  email_quality?: {
    score?: number;
    is_disposable?: boolean;
    is_role?: boolean;
    is_username_suspicious?: boolean;
    is_catchall?: boolean;
  };
  email_risk?: {
    address_risk_status?: string | null;
    domain_risk_status?: string | null;
  };
};

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { valid: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({
        valid: false,
        message: "Please enter a valid email address.",
      });
    }

    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, message: "Email validation API key is missing." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(
        cleanEmail
      )}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, message: "Email validation service failed." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as AbstractEmailResponse;

    if (!data.email_deliverability?.is_format_valid) {
      return NextResponse.json({
        valid: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!data.email_deliverability?.is_mx_valid) {
      return NextResponse.json({
        valid: false,
        message: "This email domain cannot receive emails.",
      });
    }

    if (data.email_quality?.is_disposable) {
      return NextResponse.json({
        valid: false,
        message: "Disposable email addresses are not allowed.",
      });
    }

    if (data.email_deliverability?.status === "undeliverable") {
      return NextResponse.json({
        valid: false,
        message: "This email address looks undeliverable.",
      });
    }

    if (
      data.email_risk?.address_risk_status === "risky" ||
      data.email_risk?.domain_risk_status === "risky" ||
      data.email_domain?.is_risky_tld === true
    ) {
      return NextResponse.json({
        valid: false,
        message: "This email address looks risky.",
      });
    }

    return NextResponse.json({
      valid: true,
      message: "Email looks valid.",
    });
  } catch {
    return NextResponse.json(
      { valid: false, message: "Failed to validate email." },
      { status: 500 }
    );
  }
}