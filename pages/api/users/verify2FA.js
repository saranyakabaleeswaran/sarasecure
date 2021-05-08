import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';
import speakeasy from 'speakeasy';

export default VerifyToken(async function (req, res) {
  if (req.method === 'POST') {
    try {
      const { verificationPin } = req.body;
      console.log(
        'Log::::: ~ file: verify2FA.js ~ line 9 ~ verificationPin',
        verificationPin
      );

      const user = await prisma.user.findUnique({
        where: {
          id: req.user_id,
        },
        include: {
          mfa: true,
        },
      });

      const secret = user.mfa.base32;

      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: verificationPin,
      });

      if (verified) {
        res.status(200).json({ message: 'Verified' });
      } else {
        res.status(400).json({ message: 'Not Verified' });
      }
    } catch (error) {
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
