import { useState, useEffect } from 'react'
import './SimulacionDepositoPlazoFijo.css'

const SimulacionDepositoPlazoFijo = () => {
  const [capital, setCapital] = useState(2000)
  const [capitalInicial, setCapitalInicial] = useState(2000) // Nuevo estado para guardar el capital inicial
  const [periodos, setPeriodos] = useState(1)
  const [resultados, setResultados] = useState([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [interes, setInteres] = useState(1)

  const calcularTasaInteres = (k) => {
    if (k > 100 && k <= 10000) return 0.035
    if (k > 10000 && k <= 100000) return 0.037
    return 0.04
  }

  const simularDeposito = () => {
    setCapitalInicial(capital) // Guarda el capital inicial solo al inicio de la simulación
    const nuevosResultados = []
    let capitalActual = capital
    let contador = 0
    
    const L = calcularTasaInteres(capitalActual)
    setInteres(L * 100) // Actualiza el estado del interés en porcentaje

    while (contador < periodos) {
      const T = capitalActual * L // Interés generado
      const R = capitalActual + T // Monto total
      
      nuevosResultados.push({
        periodo: contador + 1,
        capitalInicial: capitalActual,
        tasaInteres: L * 100,
        interesGenerado: T,
        capitalFinal: R
      })

      capitalActual = R
      contador++
    }

    setResultados(nuevosResultados)
    setMostrarResultados(true)
  }

  const limpiarSimulacion = () => {
    setResultados([])
    setMostrarResultados(false)
    setCapital(2000)
    setPeriodos(1)
    setCapitalInicial(2000)
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor).replace('BOB', 'Bs');
  }

  return (
    <div className="simulacion-container">
      <h1>Simulación de Depósito a Plazo Fijo</h1>
      
      <div className="explicacion">
        <h3>🏦 Tasas de Interés Según Capital:</h3>
        <div className="tasas-interes">
            <div className="tasa-item">
            <span className="rango-capital">Capital entre 100 Bs y 10,000 Bs</span>
            <span className="valor-tasa">3.5% de interés</span>
            </div>
            <div className="tasa-item">
            <span className="rango-capital">Capital entre 10,001 Bs y 100,000 Bs</span>
            <span className="valor-tasa">3.7% de interés</span>
            </div>
            <div className="tasa-item">
            <span className="rango-capital">Capital mayor a 100,000 Bs</span>
            <span className="valor-tasa">4.0% de interés</span>
            </div>
        </div>
        <p className="descripcion">
            Esta simulación calcula el crecimiento de tu capital a lo largo del tiempo aplicando 
            tasas de interés variables según el monto depositado.
        </p>
        </div>

      <div className="controles-simulacion">
        <div className="input-group">
          <label htmlFor="capital">
            💰 Capital Inicial:
          </label>
          <input
            type="number"
            id="capital"
            value={capital}
            onChange={(e) => setCapital(parseFloat(e.target.value))}
            min="100"
            step="100"
          />
          <span className="input-hint">Mínimo: $100</span>
        </div>

        <div className="input-group">
          <label htmlFor="periodos">
            ⏰ Número de Períodos:
          </label>
          <input
            type="number"
            id="periodos"
            value={periodos}
            onChange={(e) => setPeriodos(parseInt(e.target.value))}
            min="1"
            max="1000000"
          />
          <span className="input-hint">Máximo: 1000000 períodos</span>
        </div>

        <div className="botones-accion">
          <button 
            className="btn-simular"
            onClick={simularDeposito}
          >
            🚀 Ejecutar Simulación
          </button>
          <button 
            className="btn-limpiar"
            onClick={limpiarSimulacion}
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {mostrarResultados && (
        <div className="resultados-simulacion">
          <h2>📈 Resultados de la Simulación</h2>
          
          <div className="resumen-final">
            <div className="resumen-item destacado">
              <span className="resumen-label">Capital Inicial</span>
              <span className="resumen-valor">{formatearMoneda(capitalInicial)}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Porcentaje de interes</span>
              <span className="resumen-valor">{interes.toFixed(2)}%</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Períodos Simulados</span>
              <span className="resumen-valor">{periodos}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Capital Final</span>
              <span className="resumen-valor">
                {formatearMoneda(resultados[resultados.length - 1]?.capitalFinal || 0)}
              </span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Interés Total Ganado</span>
              <span className="resumen-valor interes-ganado">
                {formatearMoneda(
                  (resultados[resultados.length - 1]?.capitalFinal || 0) - capitalInicial
                )}
              </span>
            </div>
          </div>

          <div className="tabla-resultados">
            <h3>Desglose por Período</h3>
            <table>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Capital Inicial</th>
                  <th>Tasa de Interés</th>
                  <th>Interés Generado</th>
                  <th>Capital Final</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((resultado, index) => (
                  <tr
                    key={index}
                    className={index === resultados.length - 1 ? 'fila-final-resaltada' : ''}
                  >
                    <td className="periodo">{resultado.periodo}</td>
                    <td className="capital">{formatearMoneda(resultado.capitalInicial)}</td>
                    <td className="tasa">{resultado.tasaInteres.toFixed(2)}%</td>
                    <td className="interes">{formatearMoneda(resultado.interesGenerado)}</td>
                    <td className="capital-final">{formatearMoneda(resultado.capitalFinal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulacionDepositoPlazoFijo