import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Featured from './components/Featured';
import Recommended from './components/Recommended';
import Agenda from './components/Agenda';
import Social from './components/Social';
import EventModal from './components/EventModal';
import AuthModal from './components/AuthModal';
import MyRegs from './components/MyRegs';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Footer from './components/Footer';

export default function App() {
  const { toast, authMode, user, isAdmin } = useAuth();
  const [filter, setFilter] = useState('todos');
  const [open, setOpen] = useState(null);
  const [myOpen, setMyOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const goCat = (id) => { setFilter(id); document.getElementById('agenda').scrollIntoView({ behavior: 'smooth' }); };

  useEffect(() => {
    document.body.style.overflow = open || myOpen || profOpen || adminOpen || authMode ? 'hidden' : '';
    const esc = (e) => { if (e.key === 'Escape') { setOpen(null); setMyOpen(false); setProfOpen(false); setAdminOpen(false); } };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, myOpen, profOpen, adminOpen, authMode]);

  return (
    <>
      <Header onCategory={goCat} onMyRegs={() => setMyOpen(true)} onProfile={() => setProfOpen(true)} />
      <main>
        <Hero />
        <Categories onCategory={goCat} />
        <Featured onOpen={setOpen} />
        <Recommended onOpen={setOpen} />
        <Agenda filter={filter} setFilter={setFilter} onOpen={setOpen} />
        <Social />
      </main>
      <Footer />
      {open && <EventModal ev={open} onClose={() => setOpen(null)} />}
      <AuthModal />
      {myOpen && <MyRegs onClose={() => setMyOpen(false)} />}
      {profOpen && user && <Profile onClose={() => setProfOpen(false)} />}
      {adminOpen && isAdmin && <Admin onClose={() => setAdminOpen(false)} />}
      {isAdmin && (
        <button onClick={() => setAdminOpen(true)} className="btn fixed bottom-6 right-6 z-50 bg-accent text-paper shadow-lg hover:opacity-90">⚙ Panel admin</button>
      )}
      {toast && <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper shadow-lg">{toast}</div>}
    </>
  );
}