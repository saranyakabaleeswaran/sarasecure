import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';
import nodemailer from 'nodemailer';

export default VerifyToken(async function (req, res) {
  if (req.method === 'POST') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user_id,
        },
        include: {
          mfa: true,
        },
      });

      console.log('>>>> email sent', user);

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MY_EMAIL_ADDRESS,
          pass: process.env.MY_EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: 'sara@secure.com', // sender address
        to: user.email, // list of receivers
        subject: 'OTP verification', // Subject line
        html: `<p>Your OTP: ${user.mfa.verificationPin}</p>`, // plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          res.status(400).json({
            message:
              'Could not able to send email to this address' + user.email,
          });
          return;
        }

        res.status(200).json({
          message: 'Email sent successfully',
          desc: info,
        });
        return;
      });
    } catch (error) {
      console.log('Log::::: ~ file: sendMail.js ~ line 35 ~ error', error);
      res.status(500).json({
        error: true,
        message: error,
      });
    }
  } else {
    res.status(500).json({
      error: true,
      message: 'Method not allowed',
    });
  }
});
