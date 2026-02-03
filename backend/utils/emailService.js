// const nodemailer = require('nodemailer'); // Commented out - using Mailgun only
const FormData = require('form-data');
const Mailgun = require('mailgun.js');

// Email service using Mailgun ONLY
const sendEmail = async (options) => {
    const { to, subject, html, from } = options;
    
    // Detect if running on Render
    const isRender = !!(
        process.env.RENDER || 
        process.env.RENDER_EXTERNAL_URL || 
        process.env.RENDER_SERVICE_NAME ||
        (process.env.PORT && process.env.NODE_ENV === 'production' && !process.env.LOCAL)
    );
    
    // Log environment detection
    console.log('🔍 Environment Detection:', {
        isRender: isRender,
        hasRenderEnv: !!process.env.RENDER,
        hasRenderUrl: !!process.env.RENDER_EXTERNAL_URL,
        hasRenderService: !!process.env.RENDER_SERVICE_NAME,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
    });
    
    // Log available email services
    console.log('📋 Available Email Services:', {
        hasMailgunKey: !!process.env.MAILGUN_API_KEY,
        hasMailgunDomain: !!process.env.MAILGUN_DOMAIN
    });
    
    // Mailgun ONLY - Primary Email Service
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
        try {
            const mailgun = new Mailgun(FormData);
            const mg = mailgun.client({
                username: 'api',
                key: process.env.MAILGUN_API_KEY,
                // For EU domains, use: url: "https://api.eu.mailgun.net"
                url: process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net'
            });
            
            // For Mailgun, "from" should be in format: "Name <email@domain>"
            // If from is provided, use it; otherwise use postmaster@domain or info@domain
            let fromEmail;
            if (from) {
                // If from already contains @, use as is; otherwise add domain
                if (from.includes('@')) {
                    fromEmail = from;
                } else {
                    // Use info@pujnamstore.com as default if no email in from
                    fromEmail = `${from} <info@${process.env.MAILGUN_DOMAIN}>`;
                }
            } else {
                // Default: Use info@domain (e.g., info@pujnamstore.com)
                fromEmail = `"Pujnam Store" <info@${process.env.MAILGUN_DOMAIN}>`;
            }
            
            console.log(`📧 Attempting to send email via Mailgun to ${to} from ${fromEmail}`);
            
            const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
                from: fromEmail,
                to: [to],
                subject: subject,
                html: html
            });
            
            console.log(`✅ Email sent via Mailgun to ${to}`, data.id || '');
            return true;
        } catch (error) {
            console.error('❌ Mailgun error:', error.message || error);
            if (error.status) {
                console.error(`Mailgun status: ${error.status}`);
            }
            if (error.details) {
                console.error('Mailgun error details:', error.details);
            }
            if (error.body) {
                console.error('Mailgun error body:', error.body);
            }
            
            // No fallback - Mailgun is the only service
            const errorMessage = `Mailgun failed: ${error.message || 'Unknown error'}`;
            console.error('❌', errorMessage);
            
            if (isRender) {
                console.error('💡 Render Troubleshooting:');
                console.error('   1. Verify MAILGUN_API_KEY and MAILGUN_DOMAIN are set in Render dashboard');
                console.error('   2. Check Mailgun dashboard for API key validity');
                console.error('   3. Verify domain is active and verified in Mailgun');
                console.error('   4. Check Mailgun logs for delivery status');
            } else {
                console.error('💡 Localhost Troubleshooting:');
                console.error('   1. Verify MAILGUN_API_KEY and MAILGUN_DOMAIN in backend/.env file');
                console.error('   2. Check Mailgun dashboard for API key');
                console.error('   3. Verify domain is active and verified');
                console.error('   4. Check Mailgun logs for delivery status');
            }
            
            throw new Error(errorMessage);
        }
    } else {
        const errorMessage = 'MAILGUN_API_KEY or MAILGUN_DOMAIN not set. Mailgun is the only email service.';
        console.error('❌', errorMessage);
        console.error('Available env vars:', {
            hasMailgunKey: !!process.env.MAILGUN_API_KEY,
            hasMailgunDomain: !!process.env.MAILGUN_DOMAIN
        });
        console.error('💡 Please set MAILGUN_API_KEY and MAILGUN_DOMAIN in your .env file');
        throw new Error(errorMessage);
    }
    
    /* ============================================
       HOSTINGER SMTP - COMMENTED OUT
       Using Mailgun only as per requirements
       ============================================
    
    // Priority 2: Try Hostinger SMTP (Fallback)
    if (process.env.HOSTINGER_EMAIL_USER && process.env.HOSTINGER_EMAIL_PASSWORD) {
        
        // Port selection: Always try configured port first, then fallback port
        let portsToTry;
        const envPort = process.env.HOSTINGER_SMTP_PORT ? parseInt(process.env.HOSTINGER_SMTP_PORT) : null;
        
        if (isRender) {
            if (envPort) {
                portsToTry = envPort === 587 ? [587, 465] : [465, 587];
            } else {
                portsToTry = [587, 465];
            }
            console.log('🌐 [Render] Using Hostinger SMTP with optimized settings');
            console.log(`📌 Configured port: ${envPort || 'not set'}, will try ports: ${portsToTry.join(' → ')}`);
        } else {
            if (envPort) {
                portsToTry = envPort === 465 ? [465, 587] : [587, 465];
            } else {
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
                
                const transporterConfig = {
                    host: 'smtp.hostinger.com',
                    port: port,
                    secure: secure,
                    requireTLS: port === 587,
                    auth: {
                        user: process.env.HOSTINGER_EMAIL_USER,
                        pass: process.env.HOSTINGER_EMAIL_PASSWORD
                    },
                    connectionTimeout: isRender ? 40000 : 20000,
                    greetingTimeout: isRender ? 20000 : 10000,
                    socketTimeout: isRender ? 40000 : 20000,
                    tls: {
                        rejectUnauthorized: false,
                        minVersion: 'TLSv1.2',
                        ciphers: port === 587 ? 'DEFAULT' : 'SSLv3'
                    }
                };
                
                if (isRender) {
                    transporterConfig.pool = false;
                    transporterConfig.maxConnections = 1;
                    transporterConfig.ignoreTLS = false;
                }
                
                transporter = nodemailer.createTransport(transporterConfig);
                
                const mailOptions = {
                    from: from || `"Pujnam Store" <${process.env.HOSTINGER_EMAIL_USER}>`,
                    to: to,
                    subject: subject,
                    html: html
                };
                
                const timeoutDuration = isRender ? 45000 : 25000;
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
                
                if (port !== portsToTry[portsToTry.length - 1]) {
                    const nextPort = portsToTry[portsToTry.indexOf(port) + 1];
                    console.log(`🔄 Port ${port} failed, trying next port (${nextPort})...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                } else {
                    console.log(`🔄 All Hostinger ports failed (tried: ${portsToTry.join(', ')})`);
                }
            }
        }
    } else {
        console.log('⚠️ HOSTINGER_EMAIL_USER not set, skipping Hostinger SMTP');
    }
    
    */
};

module.exports = { sendEmail };
