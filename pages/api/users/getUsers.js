import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';

export default VerifyToken(async function (req, res) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();

      if (users) {
        let temp = [
          ...users.map((_x) => {
            delete _x.password;
            return _x;
          }),
        ];
        res.status(200).json(temp);
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
