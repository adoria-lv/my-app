import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    // Validate required fields
    if (!name || !phone || !email || !service) {
      return NextResponse.json(
        { error: 'Visi obligātie lauki ir jāaizpilda' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #B7AB96 0%, #706152 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Jauns kontaktformas ziņojums</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Veselības centrs "Adoria"</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #706152; margin-top: 0; font-size: 22px; margin-bottom: 20px;">Klienta informācija:</h2>

          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">Vārds:</strong>
            <span style="color: #333;">${name}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">Tālrunis:</strong>
            <span style="color: #333;">${phone}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">E-pasts:</strong>
            <span style="color: #333;">${email}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">Pakalpojums:</strong>
            <span style="color: #333;">${service}</span>
          </div>

          ${message ? `
            <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 25px 0;">
            <h2 style="color: #706152; margin-top: 0; font-size: 22px; margin-bottom: 20px;">Ziņojums:</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #B7AB96;">
              <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Šis e-pasts tika nosūtīts no Adoria kontaktformas</p>
          <p style="margin: 5px 0;">A. Čaka iela 70-3, Rīga | +371 67 315 000</p>
        </div>
      </div>
    `;

    const textContent = `
Jauns kontaktformas ziņojums - Veselības centrs "Adoria"

Klienta informācija:
Vārds: ${name}
Tālrunis: ${phone}
E-pasts: ${email}
Pakalpojums: ${service}

${message ? `Ziņojums:\n${message}` : ''}

---
Šis e-pasts tika nosūtīts no Adoria kontaktformas
A. Čaka iela 70-3, Rīga | +371 67 315 000
    `;

    // Send email to support@adoria.lv
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: 'support@adoria.lv',
      subject: `Kontaktforma: ${service} - ${name}`,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    });

    // Save to database (after successful email sending)
    await prisma.appointment.create({
      data: {
        name,
        phone,
        email,
        service,
        date: null,
        time: null,
        message: message || null,
        contactPreferences: {},
        source: 'contact',
        status: 'pending',
        emailSent: true,
      },
    });

    return NextResponse.json(
      { message: 'Jūsu ziņojums ir veiksmīgi nosūtīts!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Radās kļūda nosūtot ziņojumu. Lūdzu mēģiniet vēlreiz.' },
      { status: 500 }
    );
  }
}