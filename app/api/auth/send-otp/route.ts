import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEV_OTP = "123456";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Generate OTP
    let otpCode: string;

    if (process.env.NODE_ENV === "development") {
      // Always use fixed OTP in development
      otpCode = DEV_OTP;
      console.log(`DEV OTP for ${phone}: ${otpCode}`);
    } else {
      // Later: Generate real 6-digit OTP
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Save OTP in database (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.upsert({
      where: { phone },
      update: {
        code: otpCode,
        expiresAt,
      },
      create: {
        phone,
        code: otpCode,
        expiresAt,
      },
    });

    // Later you will send real SMS here (Twilio / MSG91 etc.)
    // For now just return success

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Only for development - remove later
      devOtp: process.env.NODE_ENV === "development" ? otpCode : undefined,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}