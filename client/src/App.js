import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './partials/Header';
import Footer from './partials/Footer';

import ChecksheetPage from './pages/ChecksheetPage';
import SchedulePage from './pages/SchedulePage';
import HistoryPage from './pages/HistoryPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ChecksheetPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
