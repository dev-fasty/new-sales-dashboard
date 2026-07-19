import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Payload must be an array of sales rep objects' }, { status: 400 });
    }

    if (body.length === 0) {
      return NextResponse.json({ error: 'Empty array provided' }, { status: 400 });
    }

    const emailsToSend = body.map((rep) => {
      const { email, name, totalTarget, closedAmount } = rep;

      // Calculate remaining amount (prevent negative if they over-achieved)
      const remainingAmount = Math.max(0, (totalTarget || 0) - (closedAmount || 0));

      // Format currency helper
      const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
      };

      const targetFormatted = formatCurrency(totalTarget || 0);
      const closedFormatted = formatCurrency(closedAmount || 0);
      const remainingFormatted = formatCurrency(remainingAmount);
      
      // Percentage
      const percentAchieved = totalTarget > 0 ? ((closedAmount / totalTarget) * 100).toFixed(2) : '0.00';

      // Premium Dark Mode HTML Template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sales Performance Update</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
              .header { background: linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%); padding: 32px 24px; text-align: center; }
              .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
              .content { padding: 32px 24px; }
              .greeting { font-size: 18px; margin-bottom: 24px; color: #f1f5f9; }
              .card { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
              .card-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0 0 8px 0; font-weight: 600; }
              .card-value { font-size: 28px; font-weight: 700; margin: 0; color: #ffffff; }
              .highlight-cyan { color: #22d3ee; }
              .highlight-emerald { color: #34d399; }
              .highlight-pink { color: #f43f5e; }
              .progress-container { margin: 24px 0; }
              .progress-bar-bg { background-color: #334155; height: 12px; border-radius: 6px; width: 100%; overflow: hidden; }
              .progress-bar-fill { background: linear-gradient(90deg, #ec4899 0%, #f59e0b 100%); height: 100%; border-radius: 6px; width: ${Math.min(parseFloat(percentAchieved), 100)}%; }
              .progress-text { text-align: right; font-size: 14px; font-weight: 600; color: #cbd5e1; margin-top: 8px; }
              .action-wrapper { text-align: center; margin-top: 40px; }
              .button { display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 8px; font-size: 16px; transition: background-color 0.2s; }
              .footer { text-align: center; padding: 24px; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Performance Snapshot</h1>
              </div>
              <div class="content">
                <p class="greeting">Hello <strong>${name}</strong>,</p>
                <p style="color: #cbd5e1; font-size: 15px; margin-bottom: 32px; line-height: 1.6;">Here is your latest sales performance update. Keep pushing towards your target!</p>
                
                <div class="card">
                  <p class="card-title">🎯 Total Target (ยอดเป้าหมายทั้งหมด)</p>
                  <p class="card-value highlight-cyan">${targetFormatted}</p>
                </div>
                
                <div class="card">
                  <p class="card-title">✅ Closed Won (ยอดที่ปิดไปแล้ว)</p>
                  <p class="card-value highlight-emerald">${closedFormatted}</p>
                </div>

                <div class="card">
                  <p class="card-title">🚀 Remaining to Close (ยอดที่ต้องปิดเพิ่ม)</p>
                  <p class="card-value highlight-pink">${remainingFormatted}</p>
                </div>

                <div class="progress-container">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill"></div>
                  </div>
                  <div class="progress-text">${percentAchieved}% Achieved</div>
                </div>

                <div class="action-wrapper">
                  <a href="https://your-dashboard-url.com" class="button">View Dashboard</a>
                </div>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Executive Dashboard. All rights reserved.</p>
                <p>This is an automated notification from your sales tracker.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      return {
        from: 'onboarding@resend.dev', // MUST be this in test mode
        // ⚠️ IGNORE the dynamic rep.email for now. Hardcode your real Resend account email here.
        to: 'guo.jing2548@gmail.com', 
        subject: `Sales Performance Update for ${rep.name}`,
        html: htmlContent,
      };
    });

    // Send the emails using Resend Batch API
    const data = await resend.batch.send(emailsToSend);

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: emailsToSend.length, data });
  } catch (error: any) {
    console.error('Error sending batch emails:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending batch emails.' },
      { status: 500 }
    );
  }
}
