import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './assets/components/Navbar.jsx'
import Sidebar from './assets/components/Sidebar.jsx'
import Home from './assets/pages/Home.jsx'
import SimulacionDepositoPlazoFijo from './assets/pages/SimulacionDepositoPlazoFijo.jsx'
import SimulacionGranjero from './assets/pages/SimulacionGranjero.jsx'
import SimulacionDados from './assets/pages/SimulacionDados.jsx'
import SimulacionTiendaAzucar from './assets/pages/SimulacionTiendaAzucar.jsx'
import SimulacionClientesTienda from './assets/pages/SimulacionTienda.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/deposito-plazo-fijo" element={<SimulacionDepositoPlazoFijo />} />
              <Route path="/granjero" element={<SimulacionGranjero />} />
              <Route path="/lanzamiento-dados" element={<SimulacionDados />} />
              <Route path="/tienda-azucar" element={<SimulacionTiendaAzucar />} />
              <Route path="/clientes-tienda" element={<SimulacionClientesTienda />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App