import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: "hastingsfred4@gmail.com",
        pass: "PUT_YOUR_NEW_APP_PASSWORD_HERE"
    }
});

transporter.verify((error, success) => {

    if (error) {

        console.log("❌ SMTP VERIFY ERROR");
        console.log(error);

    } else {

        console.log("✅ SMTP READY");

    }

});

export const sendEmail = async (
    to,
    subject,
    text
) => {

    try {

        await transporter.sendMail({
            from: "Inventory System <hastingsfred4@gmail.com>",
            to,
            subject,
            text
        });

        console.log("📧 EMAIL SENT");

    } catch (error) {

        console.log("❌ SEND MAIL ERROR");
        console.log(error);

        throw error;

    }

};