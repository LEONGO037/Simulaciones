import { useState } from 'react'
import './SimulacionDados.css'

const SimulacionDados = () => {
  const [lanzamientos, setLanzamientos] = useState(10)
  const [jugadores, setJugadores] = useState(1)
  const [costoJuego, setCostoJuego] = useState(2)
  const [perdidaCasa, setPerdidaCasa] = useState(5)
  const [resultados, setResultados] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [mostrarResultados, setMostrarResultados] = useState(false)

  const lanzarDados = () => {
    return Math.floor(Math.random() * 6) + 1
  }

  const simularJuego = () => {
    const nuevosResultados = []
    let gananciaNetaTotal = 0
    let juegosGanaCasaTotal = 0
    let totalLanzamientos = 0

    for (let jugador = 1; jugador <= jugadores; jugador++) {
      let gananciaNetaJugador = 0
      let juegosGanaCasaJugador = 0

      for (let lanzamiento = 1; lanzamiento <= lanzamientos; lanzamiento++) {
        const dado1 = lanzarDados()
        const dado2 = lanzarDados()
        const suma = dado1 + dado2

        // El jugador paga siempre el costo del juego
        let gananciaCasa = costoJuego

        // Si gana el jugador (suma 7), la casa paga el premio
        const jugadorGana = suma === 7
        if (jugadorGana) {
          gananciaCasa -= perdidaCasa // La casa paga el premio
        }

        gananciaNetaJugador += gananciaCasa
        gananciaNetaTotal += gananciaCasa

        if (!jugadorGana) {
          juegosGanaCasaJugador++
          juegosGanaCasaTotal++
        }

        totalLanzamientos++

        nuevosResultados.push({
          jugador,
          lanzamiento,
          dado1,
          dado2,
          suma,
          jugadorGana,
          gananciaCasa,
          gananciaAcumuladaJugador: gananciaNetaJugador,
          gananciaAcumuladaTotal: gananciaNetaTotal
        })
      }
    }

    const porcentajeGanaCasa = (juegosGanaCasaTotal / totalLanzamientos) * 100

    setResultados(nuevosResultados)
    setEstadisticas({
      gananciaNeta: gananciaNetaTotal,
      juegosGanaCasa: juegosGanaCasaTotal,
      porcentajeGanaCasa,
      totalLanzamientos,
      totalJugadores: jugadores,
      costoJuego,
      perdidaCasa,
      convieneImplementar: gananciaNetaTotal > 0
    })
    setMostrarResultados(true)
  }

  const limpiarSimulacion = () => {
    setResultados([])
    setEstadisticas(null)
    setMostrarResultados(false)
    setLanzamientos(10)
    setJugadores(1)
    setCostoJuego(2)
    setPerdidaCasa(5)
  }

  // Agregar esta función después de los estados y antes del return
    const obtenerColorJugador = (numeroJugador) => {
    const colores = [
        'rgba(96, 165, 250, 0.15)',    // Azul
        'rgba(168, 85, 247, 0.15)',    // Púrpura
        'rgba(16, 185, 129, 0.15)',    // Verde
        'rgba(245, 158, 11, 0.15)',    // Amarillo
        'rgba(239, 68, 68, 0.15)',     // Rojo
        'rgba(14, 165, 233, 0.15)',    // Cian
        'rgba(249, 115, 22, 0.15)',    // Naranja
        'rgba(139, 92, 246, 0.15)',    // Violeta
        'rgba(20, 184, 166, 0.15)',    // Turquesa
        'rgba(236, 72, 153, 0.15)'     // Rosa
    ]
    return colores[(numeroJugador - 1) % colores.length]
    }

    const obtenerColorBordeJugador = (numeroJugador) => {
    const bordes = [
        '1px solid rgba(96, 165, 250, 0.3)',
        '1px solid rgba(168, 85, 247, 0.3)',
        '1px solid rgba(16, 185, 129, 0.3)',
        '1px solid rgba(245, 158, 11, 0.3)',
        '1px solid rgba(239, 68, 68, 0.3)',
        '1px solid rgba(14, 165, 233, 0.3)',
        '1px solid rgba(249, 115, 22, 0.3)',
        '1px solid rgba(139, 92, 246, 0.3)',
        '1px solid rgba(20, 184, 166, 0.3)',
        '1px solid rgba(236, 72, 153, 0.3)'
    ]
    return bordes[(numeroJugador - 1) % bordes.length]
    }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor).replace('BOB', 'Bs.')
  }

  return (
    <div className="simulacion-dados-container">
      <h1>🎲 Simulación de Juego de Dados</h1>
      
      <div className="explicacion-juego">
        <h3>📋 Reglas del Juego:</h3>
        <div className="reglas">
          <div className="regla-item">
            <span className="regla-icon">👥</span>
            <span className="regla-texto"><strong>{jugadores} jugador{jugadores !== 1 ? 'es' : ''}</strong> lanzarán los dados</span>
          </div>
          <div className="regla-item">
            <span className="regla-icon">🎯</span>
            <span className="regla-texto"><strong>{lanzamientos} lanzamiento{lanzamientos !== 1 ? 's' : ''}</strong> por jugador</span>
          </div>
          <div className="regla-item">
            <span className="regla-icon">💰</span>
            <span className="regla-texto">Costo del juego: <strong>{formatearMoneda(costoJuego)}</strong></span>
          </div>
          <div className="regla-item">
            <span className="regla-icon">⭐</span>
            <span className="regla-texto">Si la suma es 7 → Gana <strong>{formatearMoneda(perdidaCasa)}</strong></span>
          </div>
          <div className="regla-item">
            <span className="regla-icon">❌</span>
            <span className="regla-texto">Cualquier otra suma → Pierde</span>
          </div>
        </div>
        <p className="descripcion-juego">
          Simulación para determinar si conviene implementar este juego de azar desde la perspectiva de la casa.
          {jugadores > 1 && ` Se simularán ${jugadores} jugadores con ${lanzamientos} lanzamientos cada uno.`}
        </p>
      </div>

      <div className="controles-simulacion">
        <div className="inputs-container">
          <div className="input-group">
            <label htmlFor="jugadores">
              👥 Número de Jugadores:
            </label>
            <input
              type="number"
              id="jugadores"
              value={jugadores}
              onChange={(e) => setJugadores(parseInt(e.target.value))}
              min="1"
              max="100"
            />
            <span className="input-hint">Máximo: 100 jugadores</span>
          </div>

          <div className="input-group">
            <label htmlFor="lanzamientos">
              🎯 Lanzamientos por Jugador:
            </label>
            <input
              type="number"
              id="lanzamientos"
              value={lanzamientos}
              onChange={(e) => setLanzamientos(parseInt(e.target.value))}
              min="1"
              max="1000"
            />
            <span className="input-hint">Máximo: 1000 lanzamientos</span>
          </div>

          <div className="input-group">
            <label htmlFor="costoJuego">
              💰 Costo por Juego (Bs.):
            </label>
            <input
              type="number"
              id="costoJuego"
              value={costoJuego}
              onChange={(e) => setCostoJuego(parseFloat(e.target.value))}
              min="0.1"
              max="100"
              step="0.1"
            />
            <span className="input-hint">Cuánto paga el jugador por jugar</span>
          </div>

          <div className="input-group">
            <label htmlFor="perdidaCasa">
              🎯 Pago si Gana Jugador (Bs.):
            </label>
            <input
              type="number"
              id="perdidaCasa"
              value={perdidaCasa}
              onChange={(e) => setPerdidaCasa(parseFloat(e.target.value))}
              min="0.1"
              max="100"
              step="0.1"
            />
            <span className="input-hint">Cuánto paga la casa si suma 7</span>
          </div>
        </div>

        <div className="resumen-configuracion" style={{ justifyItems: 'center', textAlign: 'center' }}>
          <div className="config-item" style={{ justifyContent: 'center' }}>
            <span className="config-label">Total de lanzamientos:</span>
            <span className="config-valor">{jugadores * lanzamientos}</span>
          </div>
          <div className="config-item" style={{ justifyContent: 'center' }}>
            <span className="config-label">Potencial ingreso máximo:</span>
            <span className="config-valor">{formatearMoneda(jugadores * lanzamientos * costoJuego)}</span>
          </div>
        </div>

        <div className="botones-accion">
          <button 
            className="btn-simular"
            onClick={simularJuego}
          >
            🎲 Ejecutar Simulación
          </button>
          <button 
            className="btn-limpiar"
            onClick={limpiarSimulacion}
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {mostrarResultados && estadisticas && (
        <div className="resultados-simulacion">
          <h2>📊 Resultados de la Simulación</h2>
          
          <div className="resumen-global">
            <div className="resumen-item global">
              <span className="resumen-label">Configuración de la Simulación</span>
              <span className="resumen-valor">
                {estadisticas.totalJugadores} jugador{estadisticas.totalJugadores !== 1 ? 'es' : ''} × {lanzamientos} lanzamiento{lanzamientos !== 1 ? 's' : ''} = {estadisticas.totalLanzamientos} lanzamientos totales
                <br />
                Costo: {formatearMoneda(estadisticas.costoJuego)} | Pago al ganar: {formatearMoneda(estadisticas.perdidaCasa)}
              </span>
            </div>
          </div>

          <div className="estadisticas-principales">
            <div className={`estadistica-item ${estadisticas.convieneImplementar ? 'favorable' : 'desfavorable'}`}>
              <span className="estadistica-label">¿Conviene Implementar?</span>
              <span className="estadistica-valor">
                {estadisticas.convieneImplementar ? '✅ SÍ' : '❌ NO'}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Ganancia Neta de la Casa</span>
              <span className={`estadistica-valor ${estadisticas.gananciaNeta >= 0 ? 'ganancia' : 'perdida'}`}>
                {formatearMoneda(estadisticas.gananciaNeta)}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Juegos que Gana la Casa</span>
              <span className="estadistica-valor">
                {estadisticas.juegosGanaCasa} / {estadisticas.totalLanzamientos}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Porcentaje que Gana la Casa</span>
              <span className="estadistica-valor">
                {estadisticas.porcentajeGanaCasa.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="tabla-resultados">
            <h3>Detalle de Lanzamientos por Jugador</h3>
            <table>
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Lanzamiento</th>
                  <th>Dado 1</th>
                  <th>Dado 2</th>
                  <th>Suma</th>
                  <th>Resultado</th>
                  <th>Acumulado Jugador</th>
                  <th>Acumulado Total</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((resultado, index) => (
                  <tr 
                    key={index}
                    className={`${resultado.jugadorGana ? 'fila-gana-jugador' : 'fila-gana-casa'}`}
                    style={{
                      background: obtenerColorJugador(resultado.jugador),
                      borderLeft: obtenerColorBordeJugador(resultado.jugador),
                      borderRight: obtenerColorBordeJugador(resultado.jugador)
                    }}
                  >
                    <td className="jugador" style={{ 
                      background: obtenerColorJugador(resultado.jugador),
                      borderLeft: obtenerColorBordeJugador(resultado.jugador)
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: obtenerColorJugador(resultado.jugador).replace('0.15', '0.8'),
                        marginRight: '8px',
                        border: obtenerColorBordeJugador(resultado.jugador)
                      }}></span>
                      Jugador {resultado.jugador}
                    </td>
                    <td className="lanzamiento">{resultado.lanzamiento}</td>
                    <td className="dado">🎲 {resultado.dado1}</td>
                    <td className="dado">🎲 {resultado.dado2}</td>
                    <td className="suma">{resultado.suma}</td>
                    <td className="resultado">
                      {resultado.jugadorGana ? 
                        <span className="gana">PIERDE LA CASA</span> : 
                        <span className="pierde">GANA LA CASA</span>
                      }
                    </td>
                    <td className="acumulado-jugador">
                      {formatearMoneda(resultado.gananciaAcumuladaJugador)}
                    </td>
                    <td className="acumulado-total">
                      {formatearMoneda(resultado.gananciaAcumuladaTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="analisis-conclusion">
            <h3>📈 Análisis de Rentabilidad</h3>
            <div className="conclusion-content">
              <p>
                <strong>Configuración del juego:</strong> Costo: {formatearMoneda(estadisticas.costoJuego)} | Pago al ganar: {formatearMoneda(estadisticas.perdidaCasa)}
              </p>
              <p>
                <strong>Total de lanzamientos simulados:</strong> {estadisticas.totalLanzamientos} 
                ({estadisticas.totalJugadores} jugador{estadisticas.totalJugadores !== 1 ? 'es' : ''} × {lanzamientos} lanzamiento{lanzamientos !== 1 ? 's' : ''} cada uno)
              </p>
              <p>
                <strong>Ganancia neta de la casa:</strong> {formatearMoneda(estadisticas.gananciaNeta)}
              </p>
              <p>
                <strong>Porcentaje de juegos favorables para la casa:</strong> {estadisticas.porcentajeGanaCasa.toFixed(2)}%
              </p>
              <p className={`conclusion-final ${estadisticas.convieneImplementar ? 'favorable' : 'desfavorable'}`}>
                <strong>Conclusión:</strong> {estadisticas.convieneImplementar 
                  ? '✅ SÍ conviene implementar el juego - La casa tiene ganancia neta positiva' 
                  : '❌ NO conviene implementar el juego - La casa tiene ganancia neta negativa'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulacionDados