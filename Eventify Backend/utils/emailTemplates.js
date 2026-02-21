/**
 * Generates a beautiful HTML email for booking confirmation.
 */
exports.bookingConfirmationHTML = ({
  fullName,
  eventName,
  bookingDate,
  paidAmount,
  transactionId,
  bookingId,
  eventDate,
  startTime,
  endTime,
  location,
  venue,
  instructor,
  difficulty,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 40px 30px;text-align:center;">
              <div style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;line-height:60px;font-size:28px;">
                ✓
              </div>
              <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px;font-weight:700;">Booking Confirmed!</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Your spot has been reserved successfully</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="font-size:16px;color:#374151;margin:0;">Hi <strong>${fullName}</strong>,</p>
              <p style="font-size:15px;color:#6b7280;margin:12px 0 0;line-height:1.6;">
                Thank you for your booking! We're excited to have you join us. Here are your booking details:
              </p>
            </td>
          </tr>
          
          <!-- Booking Details Card -->
          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Event</span><br/>
                          <span style="font-size:15px;color:#111827;font-weight:600;">${eventName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">📅 Event Date</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${eventDate}</span>
                              </td>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">🕐 Time</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${startTime}${endTime ? " – " + endTime : ""}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">📍 Location</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${location}</span>
                              </td>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">🏛 Venue</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${venue}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
${
  instructor
    ? `                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">👤 Instructor</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${instructor}</span>
                              </td>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">⚡ Difficulty</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${difficulty}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>`
    : ""
}
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Booking Date</span><br/>
                                <span style="font-size:15px;color:#111827;font-weight:500;">${bookingDate}</span>
                              </td>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Booking ID</span><br/>
                                <span style="font-size:14px;color:#111827;font-weight:500;font-family:monospace;">${bookingId}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</span><br/>
                                <span style="font-size:20px;color:#059669;font-weight:700;">₹${paidAmount || 0}</span>
                              </td>
                              <td width="50%">
                                <span style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Transaction ID</span><br/>
                                <span style="font-size:14px;color:#111827;font-weight:500;font-family:monospace;">${transactionId || "N/A"}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Status Badge -->
          <tr>
            <td style="padding:0 40px 24px;text-align:center;">
              <span style="display:inline-block;background-color:#fef3c7;color:#92400e;font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">
                ⏳ Pending Approval
              </span>
              <p style="font-size:14px;color:#6b7280;margin:12px 0 0;line-height:1.5;">
                Your booking is under review. You'll receive a confirmation once it's approved by our team.
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #e5e7eb;"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="font-size:13px;color:#9ca3af;margin:0 0 8px;">
                If you have any questions, feel free to reach out to us.
              </p>
              <p style="font-size:14px;color:#6366f1;font-weight:600;margin:0;">Eventify Team</p>
              <p style="font-size:12px;color:#d1d5db;margin:12px 0 0;">
                © ${new Date().getFullYear()} Eventify. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
