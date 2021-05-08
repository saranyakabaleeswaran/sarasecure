import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';

export default VerifyToken(async function (req, res) {
  if (req.method === 'POST') {
    try {
      const { verificationPin } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: req.user_id,
        },
        include: {
          mfa: true,
        },
      });

      if (user) {
        let verified =
          user.mfa.verificationPin === verificationPin && user.isMFAEnabled;

        if (verified) {
          res.status(200).json({ message: 'Verified' });
        } else {
          res.status(400).json({ message: 'Not Verified' });
        }
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
