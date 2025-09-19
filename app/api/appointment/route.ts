import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot pieteikumus' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.update({
      where: { id: data.id },
      data: {
        status: data.status,
        notes: data.notes,
      }
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot pieteikumu' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 });
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda dzēšot pieteikumu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, date, time, message, contactPreferences } = body;

    // Validate required fields
    if (!name || !phone || !email || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Visi obligātie lauki ir jāaizpilda' },
        { status: 400 }
      );
    }

    // Create transporter (you'll need to configure this with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format the date for better display
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('lv-LV', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Email content
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #B7AB96 0%, #706152 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Jauns pieraksts</h1>
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

          ${contactPreferences && (contactPreferences.phone || contactPreferences.email) ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #B7AB96; display: inline-block; width: 120px;">Sazināties:</strong>
              <span style="color: #333;">
                ${contactPreferences.phone ? '📞 Telefoniski' : ''}
                ${contactPreferences.phone && contactPreferences.email ? ' + ' : ''}
                ${contactPreferences.email ? '📧 E-pastā' : ''}
              </span>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 25px 0;">
          
          <h2 style="color: #706152; margin-top: 0; font-size: 22px; margin-bottom: 20px;">Vizītes detaļas:</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">Pakalpojums:</strong>
            <span style="color: #333;">${service}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">Datums:</strong>
            <span style="color: #333;">${formatDate(date)}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #B7AB96; display: inline-block; width: 120px;">Laiks:</strong>
            <span style="color: #333;">${time}</span>
          </div>
          
          ${message ? `
            <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 25px 0;">
            <h2 style="color: #706152; margin-top: 0; font-size: 22px; margin-bottom: 20px;">Papildu komentārs:</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #B7AB96;">
              <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
            </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Šis e-pasts tika nosūtīts no Adoria mājas lapas kontaktformas</p>
          <p style="margin: 5px 0;">A. Čaka iela 70-3, Rīga | +371 67 315 000</p>
        </div>
      </div>
    `;

    const textContent = `
Jauns pieraksts - Veselības centrs "Adoria"

Klienta informācija:
Vārds: ${name}
Tālrunis: ${phone}
E-pasts: ${email}${contactPreferences && (contactPreferences.phone || contactPreferences.email) ? `
Atbildēt: ${contactPreferences.phone ? 'Telefoniski' : ''}${contactPreferences.phone && contactPreferences.email ? ' + ' : ''}${contactPreferences.email ? 'E-pastā' : ''}` : ''}

Vizītes detaļas:
Pakalpojums: ${service}
Datums: ${formatDate(date)}
Laiks: ${time}

${message ? `Papildu komentārs:\n${message}` : ''}

---
Šis e-pasts tika nosūtīts no Adoria mājas lapas kontaktformas
A. Čaka iela 70-3, Rīga | +371 67 315 000
    `;

    let emailSent = false;

    // Try to send email
    try {
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.APPOINTMENT_EMAIL || process.env.SMTP_USER,
        subject: `Jauns pieraksts: ${service} - ${name}`,
        text: textContent,
        html: htmlContent,
        replyTo: email,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue to save in database even if email fails
    }

    // Save appointment to database
    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email,
        service,
        date,
        time,
        message: message || null,
        contactPreferences: contactPreferences || {},
        emailSent,
        status: 'pending'
      }
    });

    return NextResponse.json(
      {
        message: emailSent
          ? 'Pieraksts veiksmīgi nosūtīts un saglabāts!'
          : 'Pieraksts saglabāts! E-pasts netika nosūtīts, bet mēs sazināsimies ar jums.',
        appointmentId: appointment.id,
        emailSent
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Radās kļūda nosūtot pieteikumu. Lūdzu mēģiniet vēlreiz.' },
      { status: 500 }
    );
  }
}