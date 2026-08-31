import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App'

// // Chặn phím F12, phím tắt Developer Console (Ctrl+Shift+I/J/C) và Chuột phải
// document.addEventListener('contextmenu', (e) => {
//   e.preventDefault();
// });

// document.addEventListener('keydown', (e) => {
//   // Chặn F12
//   if (e.key === 'F12' || e.keyCode === 123) {
//     e.preventDefault();
//     return false;
//   }

//   // Chặn Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K
//   if (
//     (e.ctrlKey || e.metaKey) &&
//     e.shiftKey &&
//     ['I', 'J', 'C', 'K', 'i', 'j', 'c', 'k'].includes(e.key)
//   ) {
//     e.preventDefault();
//     return false;
//   }

//   // Chặn Ctrl+U (Xem nguồn trang)
//   if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
//     e.preventDefault();
//     return false;
//   }
// });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
