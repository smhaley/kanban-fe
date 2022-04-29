import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Board from '../components/board/board';


const Home: NextPage = () => {
  return (
    <Container style= {{width: '100%'}}>
      <Box
        sx={{
          my: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <Board/>
      </Box>
    </Container>
  );
};

export default Home;