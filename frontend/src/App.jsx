import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Layout from './components/Layout';
import { useStore } from './store';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { user } = useStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={user ? <Layout><Admin /></Layout> : <Login />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```