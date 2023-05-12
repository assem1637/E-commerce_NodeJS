import nodemailer from 'nodemailer';





const sendResetCode = async (email, code) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"E-Shop 👻" <${process.env.EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Reset Code ✔", // Subject line
        text: "Here's Your Password Reset Code!", // plain text body
        html: `
        
            <p>To Authenticate, Please Use the Following One Time Password (OTP) And The Code Available For 10 Minutes Only:</p>
            <br />
            <br />
            <h3>${code}</h3>
            <br />
            <br />
            <p>Don't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card, or banking info.</p>
            <br />
            <p>E-Shop Hope To See You Again Soon.</p>
            <br />
        
        `, // html body
    });

};



export default sendResetCode;