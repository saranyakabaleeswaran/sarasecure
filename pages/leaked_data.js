import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSelector } from 'react-redux';
import { selectPhisingData } from '../src/features/mfa/mfaSlice';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BasicTable() {
  const classes = useStyles();
  const rows = useSelector(selectPhisingData);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <IconButton aria-label='back' size='medium' onClick={handleBack}>
        <ArrowBackIcon fontSize='inherit' />
      </IconButton>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align='right'>Password</TableCell>
              <TableCell align='right'>Source</TableCell>
              <TableCell align='right'>Date Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell component='th' scope='row'>
                  {row.username}
                </TableCell>
                <TableCell align='right'>{row.password}</TableCell>
                <TableCell align='right'>{row.source}</TableCell>
                <TableCell align='right'>{row.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
