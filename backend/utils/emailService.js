const nodemailer = require('nodemailer');

// Email service using Hostinger SMTP only
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
        hasHostingerPass: !!process.env.HOSTINGER_EMAIL_PASSWORD
    });
    
    // Priority 1: Try Hostinger SMTP (Primary - Only Email Service)
    if (process.env.HOSTINGER_EMAIL_USER && process.env.HOSTINGER_EMAIL_PASSWORD) {
        
        // Port selection: Always try configured port first, then fallback port
        // This ensures if configured port fails, we automatically try the alternative
        let portsToTry;
        const envPort = process.env.HOSTINGER_SMTP_PORT ? parseInt(process.env.HOSTINGER_SMTP_PORT) : null;
        
        if (isRender) {
            if (envPort) {
                // Try configured port first, then fallback to the other port
                portsToTry = envPort === 587 ? [587, 465] : [465, 587];
            } else {
                // No port configured, default: try 587 first (better for Render), then 465
                portsToTry = [587, 465];
            }
            console.log('🌐 [Render] Using Hostinger SMTP with optimized settings');
            console.log(`📌 Configured port: ${envPort || 'not set'}, will try ports: ${portsToTry.join(' → ')}`);
        } else {
            if (envPort) {
                // Try configured port first, then fallback
                portsToTry = envPort === 465 ? [465, 587] : [587, 465];
            } else {
                // No port configured, default: try 465 first (better for localhost), then 587
                portsToTry = [465, 587];
            }
            console.log('💻 [Localhost] Using Hostinger SMTP');
            console.log(`📌 Configured port: ${envPort || 'not set'}, will try ports: ${portsToTry.join(' → ')}`);
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
                    connectionTimeout: isRender ? 40000 : 20000, // 40s on Render (increased), 20s local
                    greetingTimeout: isRender ? 20000 : 10000, // 20s on Render (increased), 10s local
                    socketTimeout: isRender ? 40000 : 20000, // 40s on Render (increased), 20s local
                    tls: {
                        rejectUnauthorized: false,
                        minVersion: 'TLSv1.2', // Use TLS 1.2+ for better compatibility
                        ciphers: port === 587 ? 'DEFAULT' : 'SSLv3' // Different cipher for different ports
                    }
                };
                
                // Additional Render-specific options
                if (isRender) {
                    transporterConfig.pool = false; // Disable pooling on Render
                    transporterConfig.maxConnections = 1;
                    transporterConfig.ignoreTLS = false; // Don't ignore TLS
                }
                
                transporter = nodemailer.createTransport(transporterConfig);
                
                const mailOptions = {
                    from: from || `"Pujnam Store" <${process.env.HOSTINGER_EMAIL_USER}>`,
                    to: to,
                    subject: subject,
                    html: html
                };
                
                // Try to send with longer timeout on Render
                const timeoutDuration = isRender ? 45000 : 25000; // 45s on Render (increased), 25s local
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
                    const nextPort = portsToTry[portsToTry.indexOf(port) + 1];
                    console.log(`🔄 Port ${port} failed, trying next port (${nextPort})...`);
                    // Wait a bit before trying next port
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait time
                    continue;
                } else {
                    console.log(`🔄 All Hostinger ports failed (tried: ${portsToTry.join(', ')})`);
                }
            }
        }
    } else {
        console.log('⚠️ HOSTINGER_EMAIL_USER not set, skipping Hostinger SMTP');
    }
    
    // If Hostinger SMTP failed
    const errorMessage = 'Hostinger SMTP failed. Check HOSTINGER_EMAIL_USER and HOSTINGER_EMAIL_PASSWORD';
    console.error('❌', errorMessage);
    console.error('Available env vars:', {
        hasHostingerUser: !!process.env.HOSTINGER_EMAIL_USER,
        hasHostingerPass: !!process.env.HOSTINGER_EMAIL_PASSWORD
    });
    
    if (isRender) {
        console.error('💡 Render Troubleshooting:');
        console.error('   1. Verify HOSTINGER_EMAIL_USER and HOSTINGER_EMAIL_PASSWORD are set in Render dashboard');
        console.error('   2. Both ports (587 and 465) were tried - connection timeout indicates network/firewall issue');
        console.error('   3. Check Hostinger email account is active and password is correct');
        console.error('   4. Hostinger SMTP may be blocked on Render - contact Hostinger support');
        console.error('   5. Alternative: Use a different email service (Resend, SendGrid, etc.)');
        console.error('   6. Check Hostinger control panel for SMTP access restrictions');
    } else {
        console.error('💡 Localhost Troubleshooting:');
        console.error('   1. Verify HOSTINGER_EMAIL_USER and HOSTINGER_EMAIL_PASSWORD in backend/.env file');
        console.error('   2. Check Hostinger email account is active');
        console.error('   3. Verify email password is correct');
        console.error('   4. Check firewall/antivirus is not blocking SMTP connections');
    }
    
    throw new Error(errorMessage);
};

module.exports = { sendEmail };
