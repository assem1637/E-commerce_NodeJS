import nodemailer from 'nodemailer';



const sendMessageToConfirmEmail = async (email, token, protocol, host) => {

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
        subject: "Confirmation ✔", // Subject line
        text: "Confirm Your Account", // plain text body
        html: `
        
            <a href='${protocol}://${host}/api/v1/user/confirmEmail/${token}' target='_blank'>Click Here To Confirm Your Account</a>
        
        `, // html body
    });

};



export default sendMessageToConfirmEmail;