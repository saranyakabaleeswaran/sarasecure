import { verify } from 'jsonwebtoken';

export const VerifyToken = fn => async (req, res) => {
  try {
    if (!req.cookies.token) {
      res.status(403).json({
        error: true,
        message: 'Unauthorized, Token not found'
      });
      return;
    }

    const token = req.cookies.token;

    const decoded = verify(token, process.env.JWT_TOKEN_SECRET);

    if (decoded) {
      req.user_id = decoded.id;
      return await fn(req, res);
    }
  } catch (error) {
    res.status(401).json({
      error: true,
      message: 'Unauthorized',
      desc: error
    });
  }
};
