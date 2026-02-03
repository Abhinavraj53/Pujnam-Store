require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

async function testMailgun() {
    console.log('🧪 Testing Mailgun Email Service...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('   MAILGUN_API_KEY:', process.env.MAILGUN_API_KEY ? '✅ Set' : '❌ Not set');
    console.log('   MAILGUN_DOMAIN:', process.env.MAILGUN_DOMAIN || '❌ Not set');
    console.log('   MAILGUN_BASE_URL:', process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net (default)');
    console.log('');
    
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        console.error('❌ MAILGUN_API_KEY or MAILGUN_DOMAIN not set in .env file');
        console.error('Please add these to backend/.env:');
        console.error('   MAILGUN_API_KEY=your_api_key');
        console.error('   MAILGUN_DOMAIN=your_domain');
        process.exit(1);
    }
    
    // Test email
    const testEmail = {
        to: 'info@pujnamstore.com', // Change this to your test email
        subject: 'Test Email from Pujnam Store - Mailgun (Production Domain)',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #FF8C00;">🧪 Mailgun Test Email</h1>
                <p>This is a test email sent via Mailgun API.</p>
                <p>If you received this, Mailgun is working correctly! ✅</p>
                <hr>
                <p style="color: #777; font-size: 12px;">
                    Sent at: ${new Date().toLocaleString()}
                </p>
            </div>
        `,
        from: `"Pujnam Store" <postmaster@${process.env.MAILGUN_DOMAIN}>`
    };
    
    try {
        console.log(`📧 Sending test email to: ${testEmail.to}`);
        console.log(`📧 From: ${testEmail.from}`);
        console.log('');
        
        const result = await sendEmail(testEmail);
        
        if (result) {
            console.log('');
            console.log('✅ Test successful! Email sent via Mailgun');
            console.log('📬 Check your inbox (and spam folder) for the test email');
        }
    } catch (error) {
        console.error('');
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testMailgun();
