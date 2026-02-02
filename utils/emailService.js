const nodemailer = require('nodemailer');

// Email service using Resend (primary on Render), Hostinger SMTP, or Gmail SMTP (fallback)
const sendEmail = async (options) => {
    const { to, subject, html, from } = options;
    
    // Detect if running on Render (multiple ways to detect)
    const isRender = !!(
        process.env.RENDER || 
        process.env.RENDER_EXTERNAL_URL || 
        process.env.RENDER_SERVICE_NAME ||
        (process.env.PORT && process.env.NODE_ENV === 'production' && !process.env.LOCAL)
    );
    
    // Log environment detection for debugging
    console.log('🔍 Environment Detection:', {
        isRender: isRender,
        hasRenderEnv: !!process.env.RENDER,
        hasRenderUrl: !!process.env.RENDER_EXTERNAL_URL,
        hasRenderService: !!process.env.RENDER_SERVICE_NAME,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
    });
    
    // Log available email service credentials (without exposing passwords)
    console.log('📋 Available Email Services:', {
        hasHostingerUser: !!process.env.HOSTINGER_EMAIL_USER,
        hasHostingerPass: !!process.env.HOSTINGER_EMAIL_PASSWORD,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasResendFrom: !!process.env.RESEND_FROM_EMAIL,
        hasGmailUser: !!process.env.EMAIL_USER,
        hasGmailPass: !!process.env.EMAIL_PASSWORD
    });
    
    // Priority 1: On Render, try Resend FIRST (most reliable)
    // On localhost, try Hostinger first
    if (isRender && process.env.RESEND_API_KEY) {
        try {
            const { Resend } = require('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            
            console.log(`📧 [Render] Attempting to send email via Resend to ${to} from ${fromEmail}`);
            
            const result = await resend.emails.send({
                from: fromEmail,
                to: to,
                subject: subject,
                html: html
            });
            
            if (result.error) {
                console.error('❌ Resend API error:', result.error);
                throw new Error(result.error.message || 'Resend API error');
            }
            
            console.log(`✅ [Render] Email sent via Resend to ${to}`, result.data?.id || '');
            return true;
        } catch (error) {
            console.error('❌ [Render] Resend error:', error.message || error);
            console.error('Resend error details:', error);
            console.log('🔄 [Render] Falling back to Hostinger SMTP...');
        }
    }
    
    // Priority 2: Try Hostinger SMTP (if configured)
    if (process.env.HOSTINGER_EMAIL_USER && process.env.HOSTINGER_EMAIL_PASSWORD) {
        
        // On Render, try port 587 first (TLS works better), then 465
        // On localhost, use configured port or default to 465
        let portsToTry;
        if (isRender) {
            portsToTry = process.env.HOSTINGER_SMTP_PORT ? [parseInt(process.env.HOSTINGER_SMTP_PORT)] : [587, 465];
            console.log('🌐 [Render] Using Hostinger SMTP with optimized settings');
        } else {
            portsToTry = process.env.HOSTINGER_SMTP_PORT ? [parseInt(process.env.HOSTINGER_SMTP_PORT)] : [465, 587];
            console.log('💻 [Localhost] Using Hostinger SMTP');
        }
        
        for (const port of portsToTry) {
            let transporter = null;
            try {
                const secure = port === 587 ? false : true;
                
                console.log(`📧 Attempting to send email via Hostinger SMTP (port ${port}, secure: ${secure}) to ${to}`);
                
                // Render-specific optimizations
                const transporterConfig = {
                    host: 'smtp.hostinger.com',
                    port: port,
                    secure: secure,
                    requireTLS: port === 587, // Require TLS for port 587
                    auth: {
                        user: process.env.HOSTINGER_EMAIL_USER,
                        pass: process.env.HOSTINGER_EMAIL_PASSWORD
                    },
                    connectionTimeout: isRender ? 30000 : 20000, // 30s on Render, 20s local
                    greetingTimeout: isRender ? 15000 : 10000, // 15s on Render, 10s local
                    socketTimeout: isRender ? 30000 : 20000, // 30s on Render, 20s local
                    tls: {
                        rejectUnauthorized: false,
                        minVersion: 'TLSv1.2', // Use TLS 1.2+ for better compatibility
                        ciphers: 'SSLv3' // Try different cipher on Render
                    }
                };
                
                // Additional Render-specific options
                if (isRender) {
                    transporterConfig.pool = false; // Disable pooling on Render
                    transporterConfig.maxConnections = 1;
                }
                
                transporter = nodemailer.createTransport(transporterConfig);
                
                const mailOptions = {
                    from: from || `"Pujnam Store" <${process.env.HOSTINGER_EMAIL_USER}>`,
                    to: to,
                    subject: subject,
                    html: html
                };
                
                // Try to send with longer timeout on Render
                const timeoutDuration = isRender ? 35000 : 25000;
                const sendPromise = transporter.sendMail(mailOptions);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Hostinger SMTP timeout (port ${port})`)), timeoutDuration)
                );
                
                const result = await Promise.race([sendPromise, timeoutPromise]);
                console.log(`✅ Email sent via Hostinger SMTP (port ${port}) to ${to}`, result.messageId || '');
                
                if (transporter) {
                    try {
                        transporter.close();
                    } catch (closeError) {
                        // Ignore close errors
                    }
                }
                return true;
            } catch (error) {
                console.error(`❌ Hostinger SMTP error (port ${port}):`, error.message || error);
                if (error.code) {
                    console.error(`Error code: ${error.command || error.code}`);
                }
                
                if (transporter) {
                    try {
                        transporter.close();
                    } catch (closeError) {
                        // Ignore close errors
                    }
                }
                
                // If this is not the last port, try next port
                if (port !== portsToTry[portsToTry.length - 1]) {
                    console.log(`🔄 Trying next port...`);
                    // Wait a bit before trying next port
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                } else {
                    console.log('🔄 All Hostinger ports failed, falling back to Resend...');
                }
            }
        }
    } else {
        console.log('⚠️ HOSTINGER_EMAIL_USER not set, skipping Hostinger SMTP');
    }
    
    // Priority 3: Try Resend (if not already tried on Render and API key is set)
    if (!isRender && process.env.RESEND_API_KEY) {
        try {
            const { Resend } = require('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            
            console.log(`📧 [Localhost] Attempting to send email via Resend to ${to} from ${fromEmail}`);
            
            const result = await resend.emails.send({
                from: fromEmail,
                to: to,
                subject: subject,
                html: html
            });
            
            if (result.error) {
                console.error('❌ Resend API error:', result.error);
                throw new Error(result.error.message || 'Resend API error');
            }
            
            console.log(`✅ [Localhost] Email sent via Resend to ${to}`, result.data?.id || '');
            return true;
        } catch (error) {
            console.error('❌ Resend error:', error.message || error);
            console.error('Resend error details:', error);
            console.log('🔄 Falling back to Gmail SMTP...');
        }
    } else if (!isRender) {
        console.log('⚠️ RESEND_API_KEY not set, skipping Resend');
    }
    
    // Priority 4: Fallback to Gmail SMTP
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        let transporter = null;
        try {
            const envLabel = isRender ? '[Render]' : '[Localhost]';
            console.log(`📧 ${envLabel} Attempting to send email via Gmail SMTP to ${to}`);
            
            transporter = nodemailer.createTransport({
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
            
            if (transporter) {
                try {
                    transporter.close();
                } catch (closeError) {
                    // Ignore close errors
                }
            }
            return true;
        } catch (error) {
            if (transporter) {
                try {
                    transporter.close();
                } catch (closeError) {
                    // Ignore close errors
                }
            }
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
