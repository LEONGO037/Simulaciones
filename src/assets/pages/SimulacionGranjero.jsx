import { useState } from 'react'
import './SimulacionGranjero.css'

const SimulacionGranjero = () => {
  // Estados para los parámetros configurables
  const [dias, setDias] = useState(300)
  const [gallinasIniciales, setGallinasIniciales] = useState(1)
  const [mediaHuevos, setMediaHuevos] = useState(2)
  const [probRomper, setProbRomper] = useState(0.2)
  const [probNacer, setProbNacer] = useState(0.3)
  const [probQuedarHuevo, setProbQuedarHuevo] = useState(0.5)
  const [probVivir, setProbVivir] = useState(0.8)
  const [probMorir, setProbMorir] = useState(0.2)
  const [precioHuevo, setPrecioHuevo] = useState(2)
  const [precioPollo, setPrecioPollo] = useState(30)

  const [resultados, setResultados] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [mostrarResultados, setMostrarResultados] = useState(false)

  // Función para generar números Poisson
  const poisson = (lambda) => {
    let L = Math.exp(-lambda)
    let k = 0
    let p = 1

    do {
      k++
      p *= Math.random()
    } while (p > L)

    return k - 1
  }

  // Sincronizar probabilidades de vida/muerte
  const actualizarProbVivir = (valor) => {
    const nuevoValor = parseFloat(valor)
    setProbVivir(nuevoValor)
    setProbMorir(1 - nuevoValor)
  }

  const actualizarProbMorir = (valor) => {
    const nuevoValor = parseFloat(valor)
    setProbMorir(nuevoValor)
    setProbVivir(1 - nuevoValor)
  }

  // Sincronizar probabilidades de huevos
  const actualizarProbRomper = (valor) => {
    const nuevoValor = parseFloat(valor)
    setProbRomper(nuevoValor)
    // Recalcular probQuedarHuevo para mantener la suma = 1
    const sumaRestante = 1 - nuevoValor
    const nuevoProbQuedarHuevo = sumaRestante - probNacer
    if (nuevoProbQuedarHuevo >= 0) {
      setProbQuedarHuevo(nuevoProbQuedarHuevo)
    } else {
      // Si no es posible, ajustar probNacer
      setProbNacer(sumaRestante)
      setProbQuedarHuevo(0)
    }
  }

  const actualizarProbNacer = (valor) => {
    const nuevoValor = parseFloat(valor)
    setProbNacer(nuevoValor)
    // Recalcular probQuedarHuevo para mantener la suma = 1
    const sumaRestante = 1 - probRomper
    const nuevoProbQuedarHuevo = sumaRestante - nuevoValor
    if (nuevoProbQuedarHuevo >= 0) {
      setProbQuedarHuevo(nuevoProbQuedarHuevo)
    } else {
      // Si no es posible, ajustar probRomper
      setProbRomper(1 - nuevoValor)
      setProbQuedarHuevo(0)
    }
  }

  const actualizarProbQuedarHuevo = (valor) => {
    const nuevoValor = parseFloat(valor)
    setProbQuedarHuevo(nuevoValor)
    // Recalcular probNacer para mantener la suma = 1
    const sumaRestante = 1 - probRomper
    const nuevoProbNacer = sumaRestante - nuevoValor
    if (nuevoProbNacer >= 0) {
      setProbNacer(nuevoProbNacer)
    } else {
      // Si no es posible, ajustar probRomper
      setProbRomper(1 - nuevoValor)
      setProbNacer(0)
    }
  }

  // Verificar que las probabilidades sumen 1
  const sumaProbabilidadesHuevos = probRomper + probNacer + probQuedarHuevo
  const probabilidadesHuevosValidas = Math.abs(sumaProbabilidadesHuevos - 1) < 0.001

  const simularGranja = () => {
    if (!probabilidadesHuevosValidas) {
      alert('Las probabilidades de huevos deben sumar 1 (100%)')
      return
    }

    const nuevosResultados = []
    let totalHuevosPuestos = 0
    let totalHuevosRotados = 0
    let totalHuevosVendidos = 0
    let totalPollosNacidos = 0
    let totalPollosMuertos = 0
    let totalPollosVendidos = 0
    let gallinasActuales = gallinasIniciales

    for (let dia = 1; dia <= dias; dia++) {
      let huevosPuestosDia = 0
      let huevosRotadosDia = 0
      let huevosVendidosDia = 0
      let pollosNacidosDia = 0
      let pollosMuertosDia = 0
      let pollosVendidosDia = 0

      // Cada gallina pone huevos (distribución Poisson)
      for (let i = 0; i < gallinasActuales; i++) {
        huevosPuestosDia += poisson(mediaHuevos)
      }

      totalHuevosPuestos += huevosPuestosDia

      // Procesar cada huevo puesto
      for (let i = 0; i < huevosPuestosDia; i++) {
        const random = Math.random()
        
        if (random < probRomper) {
          // Huevo se rompe
          huevosRotadosDia++
        } else if (random < probRomper + probNacer) {
          // Nace pollito
          pollosNacidosDia++
          if (Math.random() < probMorir) {
            // Pollito muere
            pollosMuertosDia++
          } else {
            // Pollito sobrevive y se vende
            pollosVendidosDia++
          }
        } else {
          // Huevo se queda como huevo y se vende
          huevosVendidosDia++
        }
      }

      totalHuevosRotados += huevosRotadosDia
      totalHuevosVendidos += huevosVendidosDia
      totalPollosNacidos += pollosNacidosDia
      totalPollosMuertos += pollosMuertosDia
      totalPollosVendidos += pollosVendidosDia

      // Calcular ingresos del día
      const ingresosHuevos = huevosVendidosDia * precioHuevo
      const ingresosPollos = pollosVendidosDia * precioPollo
      const ingresosTotalesDia = ingresosHuevos + ingresosPollos

      nuevosResultados.push({
        dia,
        gallinas: gallinasActuales,
        huevosPuestos: huevosPuestosDia,
        huevosRotados: huevosRotadosDia,
        huevosVendidos: huevosVendidosDia,
        pollosNacidos: pollosNacidosDia,
        pollosMuertos: pollosMuertosDia,
        pollosVendidos: pollosVendidosDia,
        ingresosHuevos,
        ingresosPollos,
        ingresosTotales: ingresosTotalesDia
      })
    }

    // Calcular estadísticas finales
    const ingresosTotales = totalHuevosVendidos * precioHuevo + totalPollosVendidos * precioPollo
    const ingresoPromedioPorDia = ingresosTotales / dias

    setResultados(nuevosResultados)
    setEstadisticas({
      totalHuevosPuestos,
      totalHuevosRotados,
      totalHuevosVendidos,
      totalPollosNacidos,
      totalPollosMuertos,
      totalPollosVendidos,
      ingresosTotales,
      ingresoPromedioPorDia,
      gallinasFinales: gallinasIniciales // En este modelo las gallinas no se reproducen
    })
    setMostrarResultados(true)
  }

  const limpiarSimulacion = () => {
    setResultados([])
    setEstadisticas(null)
    setMostrarResultados(false)
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
    <div className="simulacion-granjero-container">
      <h1>🚜 Simulación de Granja</h1>
      
      <div className="explicacion-simulacion">
        <h3>📋 ¿Qué hace esta simulación?</h3>
        <div className="descripcion-texto">
          <p>
            Esta simulación modela el proceso productivo de una granja avícola. Cada día, las gallinas 
            ponen huevos siguiendo una distribución Poisson. Los huevos pueden romperse, convertirse en 
            pollos que luego pueden morir o sobrevivir para la venta, o venderse directamente como huevos.
          </p>
          <p>
            El programa calcula los ingresos promedio diarios considerando todos estos factores probabilísticos 
            y permite analizar la rentabilidad del negocio avícola bajo diferentes condiciones.
          </p>
        </div>
      </div>

      <div className="parametros-simulacion">
        <h3>⚙️ Parámetros de la Simulación</h3>
        
        <div className="parametros-grid">
          <div className="parametro-grupo">
            <h4>📅 Configuración General</h4>
            <div className="input-group">
              <label>Días a simular:</label>
              <input
                type="number"
                value={dias}
                onChange={(e) => setDias(parseInt(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
            <div className="input-group">
              <label>Gallinas iniciales:</label>
              <input
                type="number"
                value={gallinasIniciales}
                onChange={(e) => setGallinasIniciales(parseInt(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
            <div className="input-group">
              <label>Media de huevos por gallina/día:</label>
              <input
                type="number"
                value={mediaHuevos}
                onChange={(e) => setMediaHuevos(parseFloat(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>🥚 Probabilidades de Huevos</h4>
            <div className="input-group">
              <label>Probabilidad de romperse:</label>
              <input
                type="number"
                value={probRomper}
                onChange={(e) => actualizarProbRomper(e.target.value)}
                min="0"
                max="1"
                step="0.05"
              />
            </div>
            <div className="input-group">
              <label>Probabilidad de nacer pollito:</label>
              <input
                type="number"
                value={probNacer}
                onChange={(e) => actualizarProbNacer(e.target.value)}
                min="0"
                max="1"
                step="0.05"
              />
            </div>
            <div className="input-group">
              <label>Probabilidad de venderse como huevo:</label>
              <input
                type="number"
                value={probQuedarHuevo}
                onChange={(e) => actualizarProbQuedarHuevo(e.target.value)}
                min="0"
                max="1"
                step="0.05"
              />
            </div>
            <div className={`validacion-probabilidades ${probabilidadesHuevosValidas ? 'valido' : 'invalido'}`}>
              {probabilidadesHuevosValidas ? 
                '✅ Las probabilidades suman 1 (100%)' : 
                `❌ Las probabilidades suman ${sumaProbabilidadesHuevos.toFixed(2)} (deben sumar 1)`
              }
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>🐔 Probabilidades de Pollos</h4>
            <div className="input-group">
              <label>Probabilidad de vivir:</label>
              <input
                type="number"
                value={probVivir}
                onChange={(e) => actualizarProbVivir(e.target.value)}
                min="0"
                max="1"
                step="0.05"
              />
            </div>
            <div className="input-group">
              <label>Probabilidad de morir:</label>
              <input
                type="number"
                value={probMorir}
                onChange={(e) => actualizarProbMorir(e.target.value)}
                min="0"
                max="1"
                step="0.05"
              />
            </div>
            <div className={`validacion-probabilidades ${Math.abs((probVivir + probMorir) - 1) < 0.001 ? 'valido' : 'invalido'}`}>
              {Math.abs((probVivir + probMorir) - 1) < 0.001 ? 
                '✅ Las probabilidades suman 1 (100%)' : 
                `❌ Las probabilidades suman ${(probVivir + probMorir).toFixed(2)} (deben sumar 1)`
              }
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>💰 Precios de Venta</h4>
            <div className="input-group">
              <label>Precio por huevo (Bs.):</label>
              <input
                type="number"
                value={precioHuevo}
                onChange={(e) => setPrecioHuevo(parseFloat(e.target.value))}
                min="0"
                step="0.5"
              />
            </div>
            <div className="input-group">
              <label>Precio por pollo (Bs.):</label>
              <input
                type="number"
                value={precioPollo}
                onChange={(e) => setPrecioPollo(parseFloat(e.target.value))}
                min="0"
                step="5"
              />
            </div>
          </div>
        </div>

        <div className="resumen-configuracion">
          <div className="config-item">
            <span className="config-label">Total de huevos esperados:</span>
            <span className="config-valor">{Math.round(dias * gallinasIniciales * mediaHuevos)}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Huevos para venta esperados:</span>
            <span className="config-valor">
              {Math.round(dias * gallinasIniciales * mediaHuevos * probQuedarHuevo)}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Pollos para venta esperados:</span>
            <span className="config-valor">
              {Math.round(dias * gallinasIniciales * mediaHuevos * probNacer * probVivir)}
            </span>
          </div>
        </div>

        <div className="botones-accion">
          <button 
            className="btn-simular"
            onClick={simularGranja}
            disabled={!probabilidadesHuevosValidas}
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

      {mostrarResultados && estadisticas && (
        <div className="resultados-simulacion">
          <h2>📈 Resultados de la Simulación ({dias} días)</h2>
          
          <div className="estadisticas-principales">
            <div className="estadistica-item destacada">
              <span className="estadistica-label">Ingreso Promedio por Día</span>
              <span className="estadistica-valor">
                {formatearMoneda(estadisticas.ingresoPromedioPorDia)}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Ingresos Totales</span>
              <span className="estadistica-valor">
                {formatearMoneda(estadisticas.ingresosTotales)}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Huevos Vendidos</span>
              <span className="estadistica-valor">{estadisticas.totalHuevosVendidos}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Pollos Vendidos</span>
              <span className="estadistica-valor">{estadisticas.totalPollosVendidos}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Huevos Rotados</span>
              <span className="estadistica-valor">{estadisticas.totalHuevosRotados}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Pollos Muertos</span>
              <span className="estadistica-valor">{estadisticas.totalPollosMuertos}</span>
            </div>
          </div>

          <div className="desglose-ingresos">
            <h3>💰 Desglose de Ingresos</h3>
            <div className="ingresos-grid">
              <div className="ingreso-item">
                <span className="ingreso-label">Por huevos:</span>
                <span className="ingreso-valor">
                  {formatearMoneda(estadisticas.totalHuevosVendidos * precioHuevo)}
                </span>
                <span className="ingreso-detalle">
                  ({estadisticas.totalHuevosVendidos} huevos × {formatearMoneda(precioHuevo)})
                </span>
              </div>
              <div className="ingreso-item">
                <span className="ingreso-label">Por pollos:</span>
                <span className="ingreso-valor">
                  {formatearMoneda(estadisticas.totalPollosVendidos * precioPollo)}
                </span>
                <span className="ingreso-detalle">
                  ({estadisticas.totalPollosVendidos} pollos × {formatearMoneda(precioPollo)})
                </span>
              </div>
              <div className="ingreso-item total">
                <span className="ingreso-label">Total:</span>
                <span className="ingreso-valor">
                  {formatearMoneda(estadisticas.ingresosTotales)}
                </span>
              </div>
            </div>
          </div>

          <div className="tabla-resultados">
            <h3>📊 Detalle por Día (Primeros 30 días)</h3>
            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Gallinas</th>
                  <th>Huevos Puestos</th>
                  <th>Huevos Rotos</th>
                  <th>Huevos Vendidos</th>
                  <th>Pollos Nacidos</th>
                  <th>Pollos Muertos</th>
                  <th>Pollos Vendidos</th>
                  <th>Ingreso Total</th>
                </tr>
              </thead>
              <tbody>
                {resultados.slice(0, 30).map((resultado, index) => (
                  <tr key={index}>
                    <td className="dia">{resultado.dia}</td>
                    <td className="gallinas">{resultado.gallinas}</td>
                    <td className="huevos-puestos">{resultado.huevosPuestos}</td>
                    <td className="huevos-rotos">{resultado.huevosRotados}</td>
                    <td className="huevos-vendidos">{resultado.huevosVendidos}</td>
                    <td className="pollos-nacidos">{resultado.pollosNacidos}</td>
                    <td className="pollos-muertos">{resultado.pollosMuertos}</td>
                    <td className="pollos-vendidos">{resultado.pollosVendidos}</td>
                    <td className="ingreso">{formatearMoneda(resultado.ingresosTotales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {resultados.length > 30 && (
              <p className="mensaje-limitado">
                Mostrando solo primeros 30 días de {dias} días simulados
              </p>
            )}
          </div>

          <div className="analisis-conclusion">
            <h3>📈 Análisis de Rentabilidad</h3>
            <div className="conclusion-content">
              <p><strong>Eficiencia de producción:</strong> {(estadisticas.totalHuevosVendidos / estadisticas.totalHuevosPuestos * 100).toFixed(1)}% de los huevos puestos se vendieron</p>
              <p><strong>Tasa de supervivencia de pollos:</strong> {((estadisticas.totalPollosVendidos / estadisticas.totalPollosNacidos) * 100).toFixed(1)}% de los pollos nacidos sobrevivieron</p>
              <p><strong>Ingreso promedio por gallina por día:</strong> {formatearMoneda(estadisticas.ingresoPromedioPorDia / gallinasIniciales)}</p>
              <p><strong>Valor esperado por huevo puesto:</strong> {formatearMoneda((estadisticas.ingresosTotales / estadisticas.totalHuevosPuestos) || 0)}</p>
              <div className="conclusion-final">
                <strong>Conclusión:</strong> El granjero puede esperar un ingreso promedio de {formatearMoneda(estadisticas.ingresoPromedioPorDia)} por día con {gallinasIniciales} gallina{gallinasIniciales !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulacionGranjero