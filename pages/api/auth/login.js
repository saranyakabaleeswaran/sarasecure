import prisma from '../../../lib/prisma';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import nodemailer from 'nodemailer';

export default async function (req, res) {
  if (req.method === 'POST') {
    try {
      let policy = {};
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          mfa: {
            include: {
              question: true,
            },
          },
        },
      });

      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        // Generate token
        delete user.password;

        // TODO: Logic to randomly select a user MFA verification detail

        if (user.isMFAEnabled && user.mfa !== null) {
          let temp = [];
          let keys = Object.keys(user.mfa);
          temp = keys.filter((_x) =>
            _x.startsWith('is') && user.mfa[_x] ? _x : null
          );
          let randomMfa = temp[Math.floor(Math.random() * temp.length)];

          switch (randomMfa) {
            case 'isVerificationPin':
              policy = {
                policy: 'verification_pin',
              };

              break;
            case 'isAuthenticatorApp':
              policy = {
                policy: 'authenticator_app',
              };

              break;
            case 'isSecurityQuestion':
              policy = {
                policy: 'security_question',
                value: user.mfa.question,
              };

              break;
            case 'isEmailNotification':
              policy = {
                policy: 'email_notification',
              };
              sendEmailNotification(user);
              break;
            case 'isOtp':
              policy = {
                policy: 'otp',
              };

              break;

            default:
              policy = {
                policy: 'verification_pin',
              };
              break;
          }
        }

        delete user.mfa;
        user.policy = policy;

        const token = sign(user, process.env.JWT_TOKEN_SECRET, {
          expiresIn: '1h',
        });

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
          })
        );

        res.status(200).json({
          message: 'Authenticated successfully',
          data: user,
        });
      } else {
        res.status(401).json({
          message: 'Invalid credentials',
        });
      }
    } catch (err) {
      res.status(400).json({
        message: 'User does not exists',
        desc: err,
      });
    }
  } else {
    res.status(405);
    res.end();
  }
}

// Email notification

const sendEmailNotification = async (user) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL_ADDRESS,
        pass: process.env.MY_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'sarasecure@pvt.ltd', // sender address
      to: user.email, // list of receivers
      subject: 'One time password.', // Subject line
      html: `<p>Your OTP is ${user.mfa.verificationPin}</p>`, // plain text body
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
