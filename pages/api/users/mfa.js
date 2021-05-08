import { VerifyToken } from '../auth/verify';
import prisma from '../../../lib/prisma';

export default VerifyToken(async function (req, res) {
  if (req.method === 'POST') {
    try {
      const {
        isVerificationPin,
        isOtp,
        isEmailNotification,
        isAuthenticatorApp,
        isSecurityQuestion,
        verificationPin,
        answer,
        questionId,
        isMFAEnabled,
      } = req.body;

      if (isMFAEnabled) {
        const user = await prisma.user.update({
          where: {
            id: req.user_id,
          },
          data: {
            isMFAEnabled: Boolean(isMFAEnabled),
            mfa: {
              upsert: {
                create: {
                  isVerificationPin: Boolean(isVerificationPin),
                  isOtp: Boolean(isOtp),
                  isAuthenticatorApp: Boolean(isAuthenticatorApp),
                  isSecurityQuestion: Boolean(isSecurityQuestion),
                  isEmailNotification: Boolean(isEmailNotification),
                  verificationPin: verificationPin,
                  answer: answer,
                  questionsId: questionId,
                },
                update: {
                  isVerificationPin: Boolean(isVerificationPin),
                  isOtp: Boolean(isOtp),
                  isAuthenticatorApp: Boolean(isAuthenticatorApp),
                  isSecurityQuestion: Boolean(isSecurityQuestion),
                  isEmailNotification: Boolean(isEmailNotification),
                  verificationPin: verificationPin,
                  answer: answer,
                  questionsId: questionId,
                },
              },
            },
          },
        });
        delete user.password;
        res.status(201).json({
          message: 'Enabled MFA',
          data: user,
        });
      } else {
        const user = await prisma.user.update({
          where: {
            id: req.user_id,
          },
          data: {
            isMFAEnabled: false,
            mfa: {
              delete: true,
            },
          },
        });
        delete user.password;
        res.status(201).json({
          message: 'Disabled MFA',
          data: user,
        });
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
