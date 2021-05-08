import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';

export default VerifyToken(async function (req, res) {
  if (req.method === 'POST') {
    try {
      const { answer } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: req.user_id,
        },
        include: {
          mfa: true,
        },
      });

      if (!user.isMFAEnabled) {
        res.status(400).json({
          message: 'MFA not enabled',
        });
        return;
      }

      if (answer.toLowerCase() === user.mfa.answer.toLowerCase()) {
        res.status(200).json({
          message: 'Verified the answer successfully',
        });
      } else {
        res.status(400).json({
          message: 'Invalid answer',
        });
      }
    } catch (error) {
      console.log('Log:::::: error', error);
      res.status(500).json({
        message: 'Something went wrong',
        desc: error,
      });
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    });
  }
});
