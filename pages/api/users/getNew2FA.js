import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';
import speakeasy from 'speakeasy';

export default VerifyToken(async function (req, res) {
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user_id,
        },
      });
      const secret = speakeasy.generateSecret({
        name: 'Sara Secure MFA',
      });

      if (secret) {
        await prisma.user.update({
          where: {
            id: req.user_id,
          },
          data: {
            mfa: {
              upsert: {
                create: {
                  ascii: secret.ascii,
                  hex: secret.hex,
                  base32: secret.base32,
                  otpauth_url: secret.otpauth_url,
                },
                update: {
                  ascii: secret.ascii,
                  hex: secret.hex,
                  base32: secret.base32,
                  otpauth_url: secret.otpauth_url,
                },
              },
            },
          },
        });

        res.status(200).json({
          otpauth_url: secret.otpauth_url,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({
      error: true,
      message: 'Method not allowed',
    });
  }
});
