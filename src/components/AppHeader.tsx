import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CheckIcon from '@mui/icons-material/Check';
import { useContext } from 'react';
import { ProceedButtonContext } from '../contexts/ContextProvider';

export default function ButtonAppBar() {
  const { proceedBtnFn } = useContext(ProceedButtonContext);

  return (
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PhysioTrack
          </Typography>
          <IconButton color="inherit" size='large' onClick={() => proceedBtnFn()}>
            <CheckIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
  );
}