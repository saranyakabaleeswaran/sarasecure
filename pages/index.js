import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Footer from '../components/Footer';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { IconButton, CardHeader } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectIsDarkModeState,
  enableDarkmode,
  setAuthenticated,
  selectLoadingState,
  startLoading,
  stopLoading,
  setUser,
} from '../src/features/auth/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  loginService,
  verifyAuthenticatorService,
  verifyEmailNotificationService,
  verifyOTPService,
  verifySecurityQuestionService,
  verifyVerificationPinService,
} from '../src/services/mfa';
import { Toast } from '../src/provider/alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    // display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const darkMode = useSelector(selectIsDarkModeState);
  const isLoading = useSelector(selectLoadingState);
  const dispatch = useDispatch();
  const router = useRouter();
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });
  const [state, setState] = React.useState('');
  const [question, setQuestion] = React.useState({
    id: '',
    question: 'Oopps! Something went wrong',
  });
  const [otpAndAnswer, setOtpAndAnswer] = React.useState('');

  const onToggleTheme = () => {
    dispatch(enableDarkmode());
  };

  const handleLogin = (e) => {
    e.preventDefault();

    let payload = {
      email: values.email,
      password: values.password,
    };
    dispatch(startLoading());

    loginService(payload)
      .then((res) => {
        if (res.status === 200) {
          const { isMFAEnabled, policy, firstName } = res.data.data;

          if (!isMFAEnabled) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            localStorage.setItem('firstName', firstName);
            dispatch(setAuthenticated());
            dispatch(setUser(res.data.data));
            router.push('/chat');
          } else {
            dispatch(setUser(res.data.data));
            if (policy.policy === 'security_question') {
              setState('security_question');
              setQuestion(policy.value);
            } else {
              setState(policy.policy);
            }
          }
          dispatch(stopLoading());
        }
      })
      .catch((err) => {
        Toast.fire({
          icon: 'error',
          title: err.response.data.message,
        });
        dispatch(stopLoading());
      });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (state === 'otp') {
      dispatch(startLoading());
      await verifyOTPService({
        verificationPin: otpAndAnswer,
      })
        .then((res) => {
          if (res.status === 200) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            dispatch(setAuthenticated());
            dispatch(stopLoading());
            router.push('/chat');
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message,
          });
          dispatch(stopLoading());
        });
    } else if (state === 'verification_pin') {
      dispatch(startLoading());
      await verifyVerificationPinService({
        verificationPin: otpAndAnswer,
      })
        .then((res) => {
          if (res.status === 200) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            dispatch(setAuthenticated());
            dispatch(stopLoading());
            router.push('/chat');
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message,
          });
          dispatch(stopLoading());
        });
    } else if (state === 'authenticator_app') {
      dispatch(startLoading());
      await verifyAuthenticatorService({
        verificationPin: otpAndAnswer,
      })
        .then((res) => {
          if (res.status === 200) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            dispatch(setAuthenticated());
            dispatch(stopLoading());
            router.push('/chat');
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message,
          });
          dispatch(stopLoading());
        });
    } else if (state === 'security_question') {
      dispatch(startLoading());
      await verifySecurityQuestionService({
        answer: otpAndAnswer,
        questionId: question.id,
      })
        .then((res) => {
          if (res.status === 200) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            dispatch(setAuthenticated());
            dispatch(stopLoading());
            router.push('/chat');
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message,
          });
          dispatch(stopLoading());
        });
    } else if (state === 'email_notification') {
      dispatch(startLoading());
      await verifyEmailNotificationService({
        verificationPin: otpAndAnswer,
      })
        .then((res) => {
          if (res.status === 200) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            dispatch(setAuthenticated());
            dispatch(stopLoading());
            router.push('/chat');
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message,
          });
          dispatch(stopLoading());
        });
    } else {
      dispatch(startLoading());
      await verifyOTPService({
        verificationPin: otpAndAnswer,
      })
        .then((res) => {
          if (res.status === 200) {
            Toast.fire({
              icon: 'success',
              title: 'Signed in successfully',
            });
            dispatch(setAuthenticated());
            dispatch(stopLoading());
            router.push('/chat');
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message,
          });
          dispatch(stopLoading());
        });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Footer />
      </Grid>
      <Grid item xs={6}>
        <div>
          <Container component='main' maxWidth='lg'>
            <IconButton
              color='primary'
              aria-label='dark mode'
              onClick={onToggleTheme}
            >
              {!darkMode ? (
                <Brightness4Icon fontSize='default' />
              ) : (
                <Brightness7Icon fontSize='default' />
              )}
            </IconButton>

            <div>
              <Card className={classes.paper}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                    </Avatar>
                  }
                />
                <CardContent>
                  <Typography component='h1' variant='h5'>
                    Sign in
                  </Typography>
                  {state === '' && (
                    <React.Fragment>
                      <form
                        className={classes.form}
                        onSubmit={handleLogin}
                        noValidate
                      >
                        <TextField
                          variant='outlined'
                          margin='normal'
                          required
                          fullWidth
                          id='email'
                          label='Email Address'
                          name='email'
                          autoComplete='email'
                          autoFocus
                          value={values.email}
                          onChange={handleChange}
                        />
                        <TextField
                          variant='outlined'
                          margin='normal'
                          required
                          fullWidth
                          name='password'
                          label='Password'
                          type='password'
                          id='password'
                          autoComplete='current-password'
                          value={values.password}
                          onChange={handleChange}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox value='remember' color='primary' />
                          }
                          label='Remember me'
                        />
                        <Button
                          type='submit'
                          fullWidth
                          variant='contained'
                          color='primary'
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Authenticating...' : 'Sign In'}
                        </Button>
                        <Grid container>
                          <Grid item xs>
                            <Link href='#'>Forgot password?</Link>
                          </Grid>
                          <Grid item>
                            <Link href='/register'>
                              {"Don't have an account? Sign Up"}
                            </Link>
                          </Grid>
                        </Grid>
                      </form>
                    </React.Fragment>
                  )}

                  {state === 'otp' && (
                    <React.Fragment>
                      <form
                        className={classes.form}
                        onSubmit={handleVerify}
                        noValidate
                      >
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='otp_id'
                          label='Enter Six Digit OTP Pin'
                          variant='outlined'
                          value={otpAndAnswer}
                          inputProps={{ maxLength: 6 }}
                          onChange={(e) => setOtpAndAnswer(e.target.value)}
                        />
                        <Button
                          type='submit'
                          fullWidth
                          variant='contained'
                          color='primary'
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                        <Button color='primary' onClick={() => setState('')}>
                          Back
                        </Button>
                      </form>
                    </React.Fragment>
                  )}

                  {state === 'verification_pin' && (
                    <React.Fragment>
                      <form
                        className={classes.form}
                        onSubmit={handleVerify}
                        noValidate
                      >
                        <TextField
                          margin='normal'
                          required
                          size='small'
                          fullWidth
                          id='verification_pin_id'
                          label='Enter Six Digit Verification Pin'
                          variant='outlined'
                          value={otpAndAnswer}
                          inputProps={{ maxLength: 6 }}
                          onChange={(e) => setOtpAndAnswer(e.target.value)}
                        />
                        <Button
                          type='submit'
                          fullWidth
                          variant='contained'
                          color='primary'
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                        <Button color='primary' onClick={() => setState('')}>
                          Back
                        </Button>
                      </form>
                    </React.Fragment>
                  )}

                  {state === 'authenticator_app' && (
                    <React.Fragment>
                      <form
                        className={classes.form}
                        onSubmit={handleVerify}
                        noValidate
                      >
                        <TextField
                          margin='normal'
                          required
                          size='small'
                          fullWidth
                          id='authenticator_id'
                          label='Enter Six Digit Pin From Authenticator App'
                          variant='outlined'
                          value={otpAndAnswer}
                          inputProps={{ maxLength: 6 }}
                          onChange={(e) => setOtpAndAnswer(e.target.value)}
                        />
                        <Button
                          type='submit'
                          fullWidth
                          variant='contained'
                          color='primary'
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                        <Button color='primary' onClick={() => setState('')}>
                          Back
                        </Button>
                      </form>
                    </React.Fragment>
                  )}

                  {state === 'security_question' && (
                    <React.Fragment>
                      <form
                        className={classes.form}
                        onSubmit={handleVerify}
                        noValidate
                      >
                        <Typography>{question.question}</Typography>
                        <TextField
                          margin='normal'
                          required
                          size='small'
                          fullWidth
                          id='authenticator_id'
                          label='Enter The Answer'
                          variant='outlined'
                          value={otpAndAnswer}
                          onChange={(e) => setOtpAndAnswer(e.target.value)}
                        />
                        <Button
                          type='submit'
                          fullWidth
                          variant='contained'
                          color='primary'
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                        <Button color='primary' onClick={() => setState('')}>
                          Back
                        </Button>
                      </form>
                    </React.Fragment>
                  )}

                  {state === 'email_notification' && (
                    <React.Fragment>
                      <form
                        className={classes.form}
                        onSubmit={handleVerify}
                        noValidate
                      >
                        <TextField
                          required
                          size='small'
                          fullWidth
                          id='email_notify_id'
                          label='Enter Six Digit OTP Pin From Email'
                          variant='outlined'
                          value={otpAndAnswer}
                          inputProps={{ maxLength: 6 }}
                          onChange={(e) => setOtpAndAnswer(e.target.value)}
                        />
                        <Button
                          type='submit'
                          fullWidth
                          variant='contained'
                          color='primary'
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                        <Button color='primary' onClick={() => setState('')}>
                          Back
                        </Button>
                      </form>
                    </React.Fragment>
                  )}
                </CardContent>
              </Card>
            </div>
          </Container>
        </div>
      </Grid>
    </Grid>
  );
}
