import { useState } from 'react'
import HomePage from './pages/Homepage'
import MembersPage from './pages/MembersPage'
import StaffLoginPage from './pages/StaffLoginPage'
import NotFoundPage from './pages/NotFoundPage'
import Navbar from './components/Navbar'
import gymBg from './assets/gym-bg.jpg'


function App() {
    const [currentPage, setCurrentPage] = useState("home");

    const renderPage = () => {
        switch (currentPage) {
            case "home":
            return <HomePage />
            case "members":
            return <MembersPage />
            case "staff":
            return <StaffLoginPage />
            default:
            return <NotFoundPage />
        }
    }

  return (
    <div 
      className="min-h-screen bg-[#0B0F0C] text-white antialiased bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${gymBg})`}}    
    >
      <div className="bg-black/70 min-h-screen">
        <Navbar currentPage={ currentPage } setCurrentPage={ setCurrentPage } />

        <main>
        { renderPage() }
        </main>
      </div>
    </div>
  );
}

export default App
