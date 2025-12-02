import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// import TopicQuestionsPage from './components/topics-management/TopicQuestionsPage';
import QuizLoader from './pages/QuizLoader'; // קומפוננטה חדשה שניצור
import EditTopicPage from './components/edit-topic/EditTopicPage';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert('שגיאה בהתנתקות: ' + error.message);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={session ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          <Route
            path="/dashboard"
            element={session ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/dashboard/topics/:topicId/questions"
            element={session ? <EditTopicPage /> : <Navigate to="/login" replace />}
          />

          {/* כאן נשתמש ב־QuizLoader */}
          <Route
            path="/dashboard/topics/:topicId/quiz"
            element={session ? <QuizLoader /> : <Navigate to="/login" replace />}
          />

          <Route path="*" element={session ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
