import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, message } = body;

    // Validate required fields
    if (!appointmentId || !message) {
      return NextResponse.json(
        { error: 'Pieteikuma ID un ziņojums ir nepieciešami' },
        { status: 400 }
      );
    }

    // Get appointment details
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Pieteikums nav atrasts' },
        { status: 404 }
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
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Atgādinājums par vizīti</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Veselības centrs "Adoria"</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="color: #333; line-height: 1.8; font-size: 16px; white-space: pre-line;">${message}</div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>A. Čaka iela 70-3, Rīga | +371 67 315 000</p>
          <p style="margin: 5px 0;">E-pasts: support@adoria.lv</p>
        </div>
      </div>
    `;

    const textContent = `
Atgādinājums par vizīti - Veselības centrs "Adoria"

${message}

---
A. Čaka iela 70-3, Rīga | +371 67 315 000
E-pasts: support@adoria.lv
    `;

    // Send reminder email to client
    await transporter.sendMail({
      from: `"Veselības centrs Adoria" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: appointment.email,
      subject: `Atgādinājums par vizīti - ${appointment.service}`,
      text: textContent,
      html: htmlContent,
    });

    // Update appointment with reminder sent timestamp
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { reminderSent: new Date() }
    });

    return NextResponse.json(
      { message: 'Atgādinājums veiksmīgi nosūtīts!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reminder sending error:', error);
    return NextResponse.json(
      { error: 'Radās kļūda nosūtot atgādinājumu. Lūdzu mēģiniet vēlreiz.' },
      { status: 500 }
    );
  }
}