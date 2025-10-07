import { useState } from 'react'
import './SimulacionDepositoPlazoFijo.css'

const SimulacionDepositoPlazoFijo = () => {
  const [capital, setCapital] = useState(2000)
  const [capitalInicial, setCapitalInicial] = useState(2000)
  const [periodos, setPeriodos] = useState(12)
  const [tipoPeriodo, setTipoPeriodo] = useState('meses')
  const [resultados, setResultados] = useState([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [interes, setInteres] = useState(1)

  const simularDeposito = () => {
    setCapitalInicial(capital)
    const nuevosResultados = []
    let capitalActual = capital
    
    const tasaAnual = 0.035
    const tasaMensual = tasaAnual / 12 // Convertir tasa anual a mensual
    setInteres(tasaAnual * 100)

    // Calcular el número total de meses
    const totalMeses = tipoPeriodo === 'meses' ? periodos : periodos * 12

    for (let mes = 1; mes <= totalMeses; mes++) {
      const interesGenerado = capitalActual * tasaMensual
      const capitalFinal = capitalActual + interesGenerado
      
      // Determinar el año y mes para mostrar en la tabla
      const año = Math.floor((mes - 1) / 12) + 1
      const mesDelAño = ((mes - 1) % 12) + 1
      
      nuevosResultados.push({
        periodo: mes,
        año,
        mes: mesDelAño,
        capitalInicial: capitalActual,
        tasaInteres: tasaAnual * 100, // Mostrar tasa mensual
        interesGenerado,
        capitalFinal
      })

      capitalActual = capitalFinal
    }

    setResultados(nuevosResultados)
    setMostrarResultados(true)
  }

  const limpiarSimulacion = () => {
    setResultados([])
    setMostrarResultados(false)
    setCapital(2000)
    setPeriodos(12)
    setCapitalInicial(2000)
    setTipoPeriodo('meses')
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor).replace('BOB', 'Bs.')
  }

  const getLogo = () => {
    return '🏦'
  }

  // Calcular estadísticas para el resumen
  const capitalFinal = resultados[resultados.length - 1]?.capitalFinal || 0
  const interesTotal = capitalFinal - capitalInicial
  const crecimientoPorcentual = ((capitalFinal - capitalInicial) / capitalInicial) * 100
  const totalMeses = resultados.length
  const totalAños = totalMeses / 12

  return (
    <div className="simulacion-container">
      <h1>
        <span className="logo-titulo">{getLogo()}</span>
        Simulación de Depósito a Plazo Fijo
      </h1>
      
      <div className="explicacion">
        <h3>🏦 Tasas de Interés:</h3>
        <div className="tasas-interes">
          <div className="tasa-item">
            <span className="rango-capital">Cualquier cantidad de capital</span>
            <span className="valor-tasa">3.5% de interés</span>
          </div>
        </div>
        <p className="descripcion">
          Esta simulación calcula el crecimiento de tu capital mes a mes aplicando 
          tasas de interés anuales convertidas a tasa mensual. El interés se capitaliza mensualmente.
        </p>
      </div>

      <div className="controles-simulacion">
        <div className="parametros-grid">
          <div className="parametro-grupo">
            <h4>💰 Capital</h4>
            <div className="input-group">
              <label htmlFor="capital">
                Capital Inicial:
              </label>
              <input
                type="number"
                id="capital"
                value={capital}
                onChange={(e) => setCapital(parseFloat(e.target.value))}
                min="100"
                step="100"
              />
              <span className="input-hint">Mínimo: 100 Bs</span>
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>⏰ Período de Tiempo</h4>
            <div className="input-group">
              <label htmlFor="tipoPeriodo">
                Tipo de período:
              </label>
              <select
                id="tipoPeriodo"
                value={tipoPeriodo}
                onChange={(e) => setTipoPeriodo(e.target.value)}
              >
                <option value="meses">Meses</option>
                <option value="años">Años</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="periodos">
                Número de {tipoPeriodo}:
              </label>
              <input
                type="number"
                id="periodos"
                value={periodos}
                onChange={(e) => setPeriodos(parseInt(e.target.value))}
                min="1"
                max={tipoPeriodo === 'meses' ? '600' : '50'}
              />
              <span className="input-hint">
                {tipoPeriodo === 'años' ? `Equivale a ${periodos * 12} meses` : 'Máximo: 600 meses'}
              </span>
            </div>
          </div>
        </div>

        <div className="resumen-configuracion">
          <div className="config-item">
            <span className="config-label">Capital inicial:</span>
            <span className="config-valor">{formatearMoneda(capital)}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Tasa aplicable:</span>
            <span className="config-valor">3.5%</span>
          </div>
          <div className="config-item">
            <span className="config-label">Total de meses a simular:</span>
            <span className="config-valor">
              {tipoPeriodo === 'meses' ? periodos : periodos * 12}
            </span>
          </div>
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
          
          <div className="estadisticas-principales">
            <div className="estadistica-item destacada">
              <span className="estadistica-label">Capital Final</span>
              <span className="estadistica-valor interes-ganado">
                {formatearMoneda(capitalFinal)}
              </span>
              <span className="estadistica-subtexto">
                +{crecimientoPorcentual.toFixed(2)}% de crecimiento
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Interés Total Ganado</span>
              <span className="estadistica-valor interes-ganado">
                {formatearMoneda(interesTotal)}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Capital Inicial</span>
              <span className="estadistica-valor">
                {formatearMoneda(capitalInicial)}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Tasa de Interés Anual</span>
              <span className="estadistica-valor">
                {interes.toFixed(2)}%
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Tiempo Total</span>
              <span className="estadistica-valor">
                {totalMeses} meses ({totalAños.toFixed(1)} años)
              </span>
            </div>
          </div>

          <div className="tabla-resultados">
            <h3>Desglose Mensual (Primeros 24 meses)</h3>
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Año</th>
                  <th>Capital Inicial</th>
                  <th>Tasa de interés</th>
                  <th>Interés Generado</th>
                  <th>Capital Final</th>
                </tr>
              </thead>
              <tbody>
                {resultados.slice(0, 24).map((resultado, index) => (
                  <tr
                    key={index}
                    className={index === resultados.length - 1 ? 'fila-final-resaltada' : ''}
                  >
                    <td className="periodo">{resultado.mes}</td>
                    <td className="periodo">{resultado.año}</td>
                    <td className="capital">{formatearMoneda(resultado.capitalInicial)}</td>
                    <td className="tasa">{resultado.tasaInteres.toFixed(3)}%</td>
                    <td className="interes">{formatearMoneda(resultado.interesGenerado)}</td>
                    <td className="capital-final">{formatearMoneda(resultado.capitalFinal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {resultados.length > 24 && (
              <p className="mensaje-limitado">
                Mostrando solo primeros 24 meses de {totalMeses} meses simulados
              </p>
            )}
          </div>

          <div className="analisis-conclusion">
            <h3>📈 Análisis de la Inversión</h3>
            <div className="conclusion-content">
              <p><strong>Capital inicial:</strong> {formatearMoneda(capitalInicial)}</p>
              <p><strong>Tasa de interés anual:</strong> {interes.toFixed(2)}%</p>
              <p><strong>Tasa de interés mensual:</strong> {(interes / 12).toFixed(3)}%</p>
              <p><strong>Tiempo total:</strong> {totalMeses} meses ({totalAños.toFixed(1)} años)</p>
              <p><strong>Interés total generado:</strong> {formatearMoneda(interesTotal)}</p>
              <p><strong>Crecimiento porcentual:</strong> +{crecimientoPorcentual.toFixed(2)}%</p>
              <p><strong>Interés promedio mensual:</strong> {formatearMoneda(interesTotal / totalMeses)}</p>
              <div className="conclusion-final">
                <strong>Conclusión:</strong> Tu inversión de {formatearMoneda(capitalInicial)} 
                crecerá a {formatearMoneda(capitalFinal)} en {totalMeses} meses ({totalAños.toFixed(1)} años), 
                generando {formatearMoneda(interesTotal)} en intereses con una tasa anual del {interes.toFixed(2)}%.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulacionDepositoPlazoFijo