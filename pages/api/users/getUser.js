import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';

export default VerifyToken(async function (req, res) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findUnique({
        where: {
          id: req.user_id,
        },
        include: {
          mfa: true,
        },
      });

      if (users) {
        delete users.password;
        res.status(200).json(users);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({
      error: true,
      message: 'Method not allowed',
    });
  }
});
