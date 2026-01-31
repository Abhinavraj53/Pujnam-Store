const nodemailer = require('nodemailer');

// Email service using Resend (recommended) or Gmail SMTP (fallback)
const sendEmail = async (options) => {
    const { to, subject, html, from } = options;
    
    // Try Resend first (if API key is set)
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = require('resend');
            const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
            
            const result = await resendClient.emails.send({
                from: from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: to,
                subject: subject,
                html: html
            });
            
            if (result.error) {
                throw new Error(result.error.message || 'Resend API error');
            }
            
            console.log(`✅ Email sent via Resend to ${to}`, result.data?.id || '');
            return true;
        } catch (error) {
            console.error('❌ Resend error:', error.message);
            // Fallback to Gmail SMTP
            console.log('🔄 Falling back to Gmail SMTP...');
        }
    }
    
    // Fallback to Gmail SMTP
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('No email service configured. Set RESEND_API_KEY or EMAIL_USER/EMAIL_PASSWORD');
    }
    
    // Try Gmail SMTP with quick timeout
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
    
    try {
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
        console.error('❌ Gmail SMTP error:', error.message);
        throw error;
    }
};

module.exports = { sendEmail };
