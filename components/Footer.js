import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.primary[200]
        : theme.palette.secondary[800],
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container component='main' className={classes.main} maxWidth='sm'>
        <Typography variant='h2' component='h1' gutterBottom>
          Multifactor Authentication using Rotational Policy
        </Typography>
        <Typography variant='h5' component='h2' gutterBottom>
          {
            'Multi-factor Authentication (MFA) is an authentication method that requires the user to provide two or more verification factors to gain access to a resource such as an application, online account, or a VPN.'
          }
          {
            'MFA is a core component of a strong identity and access management (IAM) policy.'
          }
          {
            'Rather than just asking for a username and password, MFA requires one or more additional verification factors, which decreases the likelihood of a successful cyber attack.'
          }
        </Typography>
        <Typography variant='body1'>Done by Saranya K</Typography>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth='sm'>
          <Typography variant='body1'>
            Powered by ReactJS, NodeJS and NextJS
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
