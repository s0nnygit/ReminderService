const cron = require('node-cron');
const emailService = require('../service/emailService');
const sender = require('../config/emailConfig');

/**
 * 10:00 am 
 * Every 5 minutes
 * We will check are their any pending emails which was expected to be sent 
 * by now and is pending
 */

const setupJobs = () => {
    cron.schedule('*/59 * * * *', async () => {
        const response = await emailService.fetchPendingEmails();
        response.forEach((email) => {
            sender.sendMail({
                to: email.recipientEmail,
                subject: email.subject,
                text: email.content
            }, async (err, data) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(data);
                    await emailService.updateTicket(email.id, {status: "SUCCESS"});
                }
            });
        });
        console.log(response);
    });    
}

module.exports = setupJobs;