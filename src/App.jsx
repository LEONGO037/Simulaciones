import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import SimulacionDepositoPlazoFijo from './pages/SimulacionDepositoPlazoFijo'
import SimulacionGranjero from './pages/SimulacionGranjero'
import SimulacionDados from './pages/SimulacionDados'
import SimulacionTiendaAzucar from './pages/SimulacionTiendaAzucar'
import SimulacionClientesTienda from './pages/SimulacionClientesTienda'
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
              <Route path="/simulacion-deposito-plazo-fijo" element={<SimulacionDepositoPlazoFijo />} />
              <Route path="/simulacion-granjero" element={<SimulacionGranjero />} />
              <Route path="/simulacion-dados" element={<SimulacionDados />} />
              <Route path="/simulacion-tienda-azucar" element={<SimulacionTiendaAzucar />} />
              <Route path="/simulacion-clientes-tienda" element={<SimulacionClientesTienda />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App