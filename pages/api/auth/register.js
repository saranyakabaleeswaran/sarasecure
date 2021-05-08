import { hash } from 'bcrypt';
import prisma from '../../../lib/prisma';

export default async function(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        location,
        device
      } = req.body;
      const hashed = await hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashed,
          firstName: firstname,
          lastName: lastname,
          location: location,
          authenticatedPcOrMobileName: device
        }
      });

      delete user.password;

      res.status(201).json(user);
      res.end();
    } catch (err) {
      res.status(400).json({
        error: true,
        message: err
      });
    }
  } else {
    res.status(405);
    res.end();
  }
}
