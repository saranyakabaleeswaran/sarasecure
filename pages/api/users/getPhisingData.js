import prisma from '../../../lib/prisma';

export default async function (req, res) {
  if (req.method === 'GET') {
    try {
      let users = await prisma.phisingData.findMany();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({
      error: true,
      message: 'Method not allowed',
    });
  }
}
