import { Link } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/deposito-plazo-fijo">Depósito a Plazo Fijo</Link></li>
        <li><Link to="/lanzamiento-dados">Lanzamiento de Dados</Link></li>
        <li><Link to="/clientes-tienda">Cantidad de clientes y articulos vendidos</Link></li>
        <li><Link to="/granjero">Simulación Granjero</Link></li>
        <li><Link to="/tienda-azucar">Tienda de Azúcar</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar