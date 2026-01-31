const nodemailer = require('nodemailer');

// Email service using Hostinger SMTP (primary), Resend, or Gmail SMTP (fallback)
const sendEmail = async (options) => {
    const { to, subject, html, from } = options;
    
    // Priority 1: Try Hostinger SMTP first (if configured)
    if (process.env.HOSTINGER_EMAIL_USER && process.env.HOSTINGER_EMAIL_PASSWORD) {
        try {
            const port = parseInt(process.env.HOSTINGER_SMTP_PORT || '465');
            const secure = port === 587 ? false : true;
            
            console.log(`📧 Attempting to send email via Hostinger SMTP (port ${port}) to ${to}`);
            
            const transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: port,
                secure: secure,
                auth: {
                    user: process.env.HOSTINGER_EMAIL_USER,
                    pass: process.env.HOSTINGER_EMAIL_PASSWORD
                },
                connectionTimeout: 15000, // 15 seconds
                greetingTimeout: 5000,
                socketTimeout: 15000,
                tls: {
                    rejectUnauthorized: false
                }
            });
            
            const mailOptions = {
                from: from || `"Pujnam Store" <${process.env.HOSTINGER_EMAIL_USER}>`,
                to: to,
                subject: subject,
                html: html
            };
            
            const sendPromise = transporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Hostinger SMTP timeout')), 20000)
            );
            
            const result = await Promise.race([sendPromise, timeoutPromise]);
            console.log(`✅ Email sent via Hostinger SMTP to ${to}`, result.messageId || '');
            transporter.close();
            return true;
        } catch (error) {
            console.error('❌ Hostinger SMTP error:', error.message || error);
            console.error('Hostinger error details:', error);
            console.log('🔄 Falling back to Gmail SMTP...');
        }
    } else {
        console.log('⚠️ HOSTINGER_EMAIL_USER not set, skipping Hostinger SMTP');
    }
    
    // Priority 3: Fallback to Gmail SMTP
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        try {
            console.log(`📧 Attempting to send email via Gmail SMTP to ${to}`);
            
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                connectionTimeout: 5000, // 5 seconds only
                greetingTimeout: 3000,
                socketTimeout: 5000,
                tls: {
                    rejectUnauthorized: false
                }
            });
            
            const mailOptions = {
                from: from || `"Pujnam Store" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                html: html
            };
            
            // Quick send with timeout
            const sendPromise = transporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Gmail SMTP timeout')), 10000)
            );
            
            const result = await Promise.race([sendPromise, timeoutPromise]);
            console.log(`✅ Email sent via Gmail SMTP to ${to}`, result.messageId || '');
            transporter.close();
            return true;
        } catch (error) {
            transporter.close();
            console.error('❌ Gmail SMTP error:', error.message || error);
            console.error('Gmail error details:', error);
            // Don't throw, let it fall through to final error
        }
    }
    
    // If all services failed
    const errorMessage = 'All email services failed. Check HOSTINGER_EMAIL_USER, RESEND_API_KEY, or EMAIL_USER/EMAIL_PASSWORD';
    console.error('❌', errorMessage);
    console.error('Available env vars:', {
        hasHostingerUser: !!process.env.HOSTINGER_EMAIL_USER,
        hasHostingerPass: !!process.env.HOSTINGER_EMAIL_PASSWORD,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasGmailUser: !!process.env.EMAIL_USER
    });
    throw new Error(errorMessage);
};

module.exports = { sendEmail };
