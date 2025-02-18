import './App.css';
import Calendar from './components/Calendar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar
                  closeOnClick
                />
      <Calendar />
    </div>
  );
}

export default App;
