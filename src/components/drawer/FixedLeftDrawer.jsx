import React from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as CloseSVG } from '../../assets/svg/side-nav-close.svg';
import { ReactComponent as OpenSVG } from '../../assets/svg/side-nav-open.svg';
import { useDocumentsContext } from '../../store/documentStore';

const drawerWidthOpen = 433;
const drawerWidthClose = 24;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `${open ? drawerWidthOpen : drawerWidthClose}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

function FixedLeftDrawer({ drawerComponent, mainComponent }) {
  const { openDrawer, setOpenDrawer } = useDocumentsContext();
  const drawerWidth = openDrawer ? drawerWidthOpen : drawerWidthClose;

  const toggleDrawerClose = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflow: 'hidden',
            marginTop: '47px',
            height: '100vh',
            boxShadow: openDrawer ? '4px 0px 16px 0px rgba(0, 0, 0, 0.15)' : 'none'
          }
        }}
        variant="persistent"
        anchor="left"
        open={true}>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{ position: 'fixed', top: '63px', left: `${drawerWidth - 20}px`, zIndex: 9999 }}
            onClick={toggleDrawerClose}>
            {openDrawer ? <CloseSVG /> : <OpenSVG />}
          </IconButton>
          <Box sx={{ display: openDrawer ? 'block' : 'none' }}>{drawerComponent}</Box>
        </Box>
      </Drawer>
      <Main open={openDrawer} style={{ backgroundColor: '#E5E8EA', height: '100%' }}>
        {mainComponent}
      </Main>
    </Box>
  );
}

export default FixedLeftDrawer;
