import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UploadForm from '../src/UploadForm';

function Copyright() {
  const classes = useStyles();
  return (
    <>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        className={classes.copyright}
      >
        {'Copyright © Padmini Chetia '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Typography>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.flickr.com/photos/80497449@N04/10012162166"
        >
          Photo by : Nicholas Raymond
        </a>
      </Typography>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  copyright: {
    background: `rgba(255,255,255,0.9)`,
    color: 'black',
    fontWeight: 'bold',
    padding: `10px`,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  background: {
    background: `url('/map.jpg') no-repeat fixed center`,
    height: '100%',
    width: '100%',
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
  },
  heading: {
    marginBottom: '40px',
  },
}));

export default function Checkout() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Geo Encoding
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.background}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              className={classes.heading}
            >
              Get geo coordinates
            </Typography>
            <UploadForm />
          </Paper>
          <Copyright />
        </main>
      </div>
    </React.Fragment>
  );
}
