import palette from './palette';
import shadows from './shadows';
import PropTypes from 'prop-types';
import typography from './typography';
import breakpointsX from './breakpoints';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import componentsOverride from './overrides';
import GlobalStyles from './globalStyles';
import borderRadius from './borderRadius';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { selectIsDarkModeState } from '../features/auth/authSlice';

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node
};

function ThemeConfig({ children }) {
  const isLight = useSelector(selectIsDarkModeState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeOptions = {
    palette: palette[isLight ? 'light' : 'dark'],
    shadows: shadows[isLight ? 'light' : 'dark'],
    typography: typography,
    shape: borderRadius,
    breakpoints: breakpointsX,

    components: componentsOverride({
      theme: {
        palette: palette[isLight ? 'light' : 'dark'],
        shadows: shadows[isLight ? 'light' : 'dark'],
        typography: typography,
        shape: borderRadius
      }
    })
  };

  if (!isLight) themeOptions.palette.mode = 'dark';

  const theme = useMemo(() => createMuiTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

export default ThemeConfig;
