import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {
  Badge,
  Input,
  Box,
  IconButton,
  Button,
  DialogContent,
  Checkbox,
  TextField,
  InputLabel,
  MenuItem,
  Grid,
} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import {
  selectIsDarkModeState,
  enableDarkmode,
  setAuthenticationFalse,
  selectUser,
} from '../src/features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import TuneIcon from '@material-ui/icons/Tune';
import Link from 'next/link';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import InputIcon from '@material-ui/icons/Input';
import {
  getNew2FAAction,
  getQuestionsAction,
  manageMfaAction,
  selectQuestions,
  selectSecretState,
  setSecretAction,
} from '../src/features/mfa/mfaSlice';
import { getUserService } from '../src/services/mfa';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: 10,
    marginBottom: 10,
  },
  status: {
    marginLeft: -31,
    marginBottom: -20,
  },
  customBadge: {
    backgroundColor: '#2ecc71',
    color: 'white',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: drawerWidth,
  },
  inputmessage: {
    left: '0',
    bottom: '0',
    position: 'fixed',
    paddingLeft: drawerWidth + 5,
    border: '2px solid' + theme.palette.grey[300],
  },
  msgroot: { display: 'flex', marginBottom: theme.spacing(3) },
  msgcontent: {
    maxWidth: 320,
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral,
    '&.styleMe': {
      color: theme.palette.grey[800],
      backgroundColor: theme.palette.primary.lighter,
    },
  },
  msginfo: {
    paddingLeft: 7,
  },
}));

export default function Chat() {
  const classes = useStyles();
  const darkMode = useSelector(selectIsDarkModeState);
  const qr_url = useSelector(selectSecretState);
  const questions = useSelector(selectQuestions);
  const user = useSelector(selectUser);
  // const mfaDetails = useSelector(selectMfaDetails);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [checkedMfa, setCheckedMfa] = React.useState(false);
  const [values, setValues] = React.useState({
    verification_pin: false,
    otp: false,
    email: false,
    authenticator: false,
    security_question: false,
  });
  const [verificationpin, setGetVerificationPin] = React.useState('');
  const [answer, setSecurityQuestionsAnswer] = React.useState('');
  const [questionId, setQuestionId] = React.useState('');

  const onToggleTheme = () => {
    dispatch(enableDarkmode());
  };

  const chatlist = [
    {
      user: 'Alice',
      icon: '',
    },
  ];

  const handleSetting = () => {
    let payload = {
      isVerificationPin: values.verification_pin,
      isOtp: values.otp,
      isEmailNotification: values.email,
      isAuthenticatorApp: values.authenticator,
      isSecurityQuestion: values.security_question,
      verificationPin: verificationpin,
      answer: answer,
      questionId: questionId,
      isMFAEnabled: checkedMfa,
    };

    dispatch(manageMfaAction(payload));
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(setAuthenticationFalse());
  };

  const handleClickOpen = async () => {
    let mfaDetails = await getUserService().then((res) => res.data);

    if (mfaDetails.mfa !== null) {
      dispatch(setSecretAction(mfaDetails.mfa.otpauth_url));
      setCheckedMfa(mfaDetails.isMFAEnabled);
      setValues({
        verification_pin: mfaDetails.mfa.isVerificationPin,
        otp: mfaDetails.mfa.isOtp,
        email: mfaDetails.mfa.isEmailNotification,
        authenticator: mfaDetails.mfa.isAuthenticatorApp,
        security_question: mfaDetails.mfa.isSecurityQuestion,
      });
      setGetVerificationPin(mfaDetails.mfa.verificationPin);
      setSecurityQuestionsAnswer(mfaDetails.mfa.answer);
      setQuestionId(Number(mfaDetails.mfa.questionsId));
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    setCheckedMfa(!checkedMfa);
  };

  const handleEnableMfaChoices = (e) => {
    if (e.target.name === 'authenticator') {
      dispatch(getNew2FAAction());
    }

    setValues({ ...values, [e.target.name]: e.target.checked });
  };

  React.useEffect(() => {
    dispatch(getQuestionsAction());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <Badge
              color='secondary'
              overlap='circle'
              badgeContent=' '
              variant='dot'
              classes={{ badge: classes.customBadge }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Avatar>
                {user !== null && user ? user.firstName[0] : 'Bob'}
              </Avatar>
            </Badge>
            <Typography variant='subtitle1' className={classes.title}>
              {user !== null && user ? user.firstName : 'Bob'}
            </Typography>
            <div style={{ flexGrow: 1 }}></div>
            <IconButton
              color='inherit'
              aria-label='handle setting'
              onClick={handleClickOpen}
            >
              <TuneIcon />
            </IconButton>
            <IconButton
              color='inherit'
              aria-label='dark mode'
              onClick={onToggleTheme}
            >
              {!darkMode ? (
                <Brightness4Icon fontSize='default' />
              ) : (
                <Brightness7Icon fontSize='default' />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              {chatlist.map((chat, index) => (
                <React.Fragment key={index}>
                  <ListItem button>
                    <ListItemIcon>
                      <Badge
                        color='secondary'
                        overlap='circle'
                        badgeContent=' '
                        variant='dot'
                        classes={{ badge: classes.customBadge }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <Avatar>A</Avatar>
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary={'Anonymous'} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </div>
          <Box flexGrow={1} />
          <Box
            display='flex'
            justifyContent='center'
            mt={2}
            bgcolor='background.dark'
          >
            <Button
              color='primary'
              onClick={handleLogout}
              size='small'
              startIcon={<InputIcon />}
              fullWidth
            >
              Logout
            </Button>
          </Box>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <Box>
            <div>
              <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography
                  noWrap
                  variant='caption'
                  color='textSecondary'
                  className={classes.msginfo}
                >
                  Anonymous
                </Typography>
              </Box>
              <div className={classes.msgcontent}>
                <Typography variant='body1'>
                  You have won a bonus of Rupees 1 lakh cash prize,
                </Typography>
                <Typography variant='body2'>
                  <Link href='/phising'>
                    <a>Click the link to avail.</a>
                  </Link>
                </Typography>
              </div>
            </div>
          </Box>
          <Box>
            <Input
              className={classes.inputmessage}
              disableUnderline
              fullWidth
              autoFocus
              placeholder='Type a message'
              endAdornment={
                <React.Fragment>
                  <IconButton size='small'>
                    <AddPhotoAlternateIcon />
                  </IconButton>
                  <IconButton size='small'>
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton size='small'>
                    <MicIcon />
                  </IconButton>
                  <IconButton color='primary'>
                    <SendIcon />
                  </IconButton>
                </React.Fragment>
              }
            />
          </Box>
          <Dialog
            onClose={handleClose}
            aria-labelledby='settings-dialog'
            open={open}
            maxWidth='md'
            fullWidth={true}
            disableBackdropClick
            disableEscapeKeyDown
          >
            <DialogTitle id='settings-dialog'>Set MFA</DialogTitle>
            <DialogContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedMfa}
                    onChange={handleChange}
                    name='checkedMfa'
                    color='primary'
                  />
                }
                label={checkedMfa ? 'Disable MFA' : 'Enable MFA'}
              />
              {checkedMfa ? (
                <Box border={1} p={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={12} lg={6} md={12}>
                      <FormControl
                        component='fieldset'
                        className={classes.formControl}
                      >
                        <FormLabel component='legend'>
                          You can enable multiple services from below.
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.verification_pin}
                                onChange={handleEnableMfaChoices}
                                name='verification_pin'
                              />
                            }
                            label='Verification Pin'
                          />
                          {values.verification_pin ? (
                            <TextField
                              required
                              size='small'
                              fullWidth
                              id='verification_pin_id'
                              label='Enter Six Digit Pin'
                              variant='outlined'
                              value={verificationpin}
                              inputProps={{ maxLength: 6 }}
                              onChange={(e) =>
                                setGetVerificationPin(e.target.value)
                              }
                            />
                          ) : null}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.otp}
                                onChange={handleEnableMfaChoices}
                                name='otp'
                              />
                            }
                            label='OTP'
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.email}
                                onChange={handleEnableMfaChoices}
                                name='email'
                              />
                            }
                            label='Email Notification'
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.authenticator}
                                onChange={handleEnableMfaChoices}
                                name='authenticator'
                              />
                            }
                            label='Authenticator App'
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.security_question}
                                onChange={handleEnableMfaChoices}
                                name='security_question'
                              />
                            }
                            label='Security Question'
                          />
                          {values.security_question ? (
                            <React.Fragment>
                              <FormControl
                                required
                                variant='outlined'
                                className={classes.formControl}
                                size='small'
                              >
                                <InputLabel id='questions-list-id'>
                                  List of questions
                                </InputLabel>
                                <Select
                                  labelId='questions-list-id'
                                  id='questions-id'
                                  value={questionId}
                                  onChange={(e) =>
                                    setQuestionId(e.target.value)
                                  }
                                  label='List of questions'
                                >
                                  <MenuItem value=''>
                                    <em>None</em>
                                  </MenuItem>
                                  {questions.map((_x, i) => (
                                    <MenuItem key={i} value={_x.id}>
                                      {_x.question}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <TextField
                                required
                                size='small'
                                margin='dense'
                                id='answer'
                                label='Answer'
                                variant='outlined'
                                fullWidth
                                value={answer}
                                onChange={(e) =>
                                  setSecurityQuestionsAnswer(e.target.value)
                                }
                              />
                            </React.Fragment>
                          ) : null}
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={12} lg={6} md={12}>
                      {values.authenticator && (
                        <React.Fragment>
                          <img src={qr_url} alt='qrcode' />
                        </React.Fragment>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color='primary'>
                Close
              </Button>
              <Button onClick={handleSetting} color='primary'>
                Set
              </Button>
            </DialogActions>
          </Dialog>
        </main>
      </div>
    </React.Fragment>
  );
}
