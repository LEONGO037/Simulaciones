import { useState } from 'react'
import './SimulacionTienda.css'

const SimulacionTienda = () => {
  // Estado para los parámetros de entrada
  const [dias, setDias] = useState(1)
  const [horas, setHoras] = useState(8)
  const [minClientes, setMinClientes] = useState(0)
  const [maxClientes, setMaxClientes] = useState(4)
  const [costoFijo, setCostoFijo] = useState(300)
  const [costoArticulo, setCostoArticulo] = useState(50)
  const [precioVenta, setPrecioVenta] = useState(75)
  
  // Estado para las probabilidades de artículos
  const [probabilidades, setProbabilidades] = useState([
    { articulos: 1, probabilidad: 0.2 },
    { articulos: 2, probabilidad: 0.3 },
    { articulos: 3, probabilidad: 0.4 },
    { articulos: 4, probabilidad: 0.1 }
  ])

  const [resultados, setResultados] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [diaSeleccionado, setDiaSeleccionado] = useState(0)

  // Función para generar número aleatorio entre min y max
  const generarUniforme = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Función para determinar cuántos artículos compra un cliente basado en probabilidades
  const determinarArticulosComprados = () => {
    const random = Math.random()
    let acumulado = 0
    
    for (const prob of probabilidades) {
      acumulado += prob.probabilidad
      if (random <= acumulado) {
        return prob.articulos
      }
    }
    
    return probabilidades[probabilidades.length - 1].articulos
  }

  const simularPeriodo = () => {
    const nuevosResultados = []
    let estadisticasTotales = {
      totalClientes: 0,
      totalArticulosVendidos: 0,
      totalIngresos: 0,
      totalCostos: 0,
      totalGananciaNeta: 0,
      diasRentables: 0
    }

    for (let dia = 1; dia <= dias; dia++) {
      const resultadosDia = []
      let totalClientesDia = 0
      let totalArticulosVendidosDia = 0
      let totalIngresosDia = 0

      for (let hora = 1; hora <= horas; hora++) {
        const clientesEstaHora = generarUniforme(minClientes, maxClientes)
        let articulosEstaHora = 0
        const clientesDetalle = []

        for (let i = 0; i < clientesEstaHora; i++) {
          const articulosComprados = determinarArticulosComprados()
          articulosEstaHora += articulosComprados
          clientesDetalle.push({
            cliente: i + 1,
            articulosComprados,
            ingresoCliente: articulosComprados * precioVenta
          })
        }

        const ingresosEstaHora = articulosEstaHora * precioVenta
        
        totalClientesDia += clientesEstaHora
        totalArticulosVendidosDia += articulosEstaHora
        totalIngresosDia += ingresosEstaHora

        resultadosDia.push({
          hora,
          clientes: clientesEstaHora,
          articulosVendidos: articulosEstaHora,
          ingresos: ingresosEstaHora,
          clientesDetalle
        })
      }

      const costosDia = costoFijo + (totalArticulosVendidosDia * costoArticulo)
      const gananciaNetaDia = totalIngresosDia - costosDia

      // Actualizar estadísticas totales
      estadisticasTotales.totalClientes += totalClientesDia
      estadisticasTotales.totalArticulosVendidos += totalArticulosVendidosDia
      estadisticasTotales.totalIngresos += totalIngresosDia
      estadisticasTotales.totalCostos += costosDia
      estadisticasTotales.totalGananciaNeta += gananciaNetaDia
      if (gananciaNetaDia > 0) {
        estadisticasTotales.diasRentables++
      }

      nuevosResultados.push({
        dia,
        resultados: resultadosDia,
        estadisticasDia: {
          totalClientes: totalClientesDia,
          totalArticulosVendidos: totalArticulosVendidosDia,
          totalIngresos: totalIngresosDia,
          costos: costosDia,
          gananciaNeta: gananciaNetaDia,
          rentabilidad: gananciaNetaDia > 0 ? 'RENTABLE' : 'NO RENTABLE'
        }
      })
    }

    // Calcular promedios
    const promedioClientesPorDia = estadisticasTotales.totalClientes / dias
    const promedioArticulosPorDia = estadisticasTotales.totalArticulosVendidos / dias
    const promedioIngresosPorDia = estadisticasTotales.totalIngresos / dias
    const promedioGananciaPorDia = estadisticasTotales.totalGananciaNeta / dias
    const porcentajeDiasRentables = (estadisticasTotales.diasRentables / dias) * 100

    setResultados(nuevosResultados)
    setEstadisticas({
      ...estadisticasTotales,
      promedios: {
        clientes: promedioClientesPorDia,
        articulos: promedioArticulosPorDia,
        ingresos: promedioIngresosPorDia,
        ganancia: promedioGananciaPorDia
      },
      porcentajeDiasRentables,
      rentabilidadGeneral: estadisticasTotales.totalGananciaNeta > 0 ? 'RENTABLE' : 'NO RENTABLE'
    })
    setMostrarResultados(true)
    setDiaSeleccionado(0) // Mostrar el primer día por defecto
  }

  const limpiarSimulacion = () => {
    setResultados([])
    setEstadisticas(null)
    setMostrarResultados(false)
    setDiaSeleccionado(0)
  }

  const actualizarProbabilidad = (index, campo, valor) => {
    const nuevasProbabilidades = [...probabilidades]
    
    if (campo === 'articulos') {
      nuevasProbabilidades[index].articulos = parseInt(valor)
    } else if (campo === 'probabilidad') {
      nuevasProbabilidades[index].probabilidad = parseFloat(valor)
    }
    
    setProbabilidades(nuevasProbabilidades)
  }

  const agregarFilaProbabilidad = () => {
    setProbabilidades([
      ...probabilidades,
      { articulos: 1, probabilidad: 0.1 }
    ])
  }

  const eliminarFilaProbabilidad = (index) => {
    if (probabilidades.length > 1) {
      const nuevasProbabilidades = probabilidades.filter((_, i) => i !== index)
      setProbabilidades(nuevasProbabilidades)
    }
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor).replace('BOB', 'Bs.')
  }

  // Validar que las probabilidades sumen 1
  const sumaProbabilidades = probabilidades.reduce((sum, prob) => sum + prob.probabilidad, 0)
  const probabilidadesValidas = Math.abs(sumaProbabilidades - 1) < 0.001

  return (
    <div className="simulacion-tienda-container">
      <h1>🏪 Simulación de Tienda</h1>
      
      <div className="explicacion-simulacion">
        <h3>📋 Descripción del Modelo:</h3>
        <div className="descripcion-modelo">
          <p>
            Simulación de ventas en una tienda donde los clientes llegan siguiendo una distribución uniforme 
            y compran artículos según probabilidades definidas. Se calcula la ganancia neta considerando 
            costos fijos, costos variables y precio de venta.
          </p>
        </div>
      </div>

      <div className="parametros-simulacion">
        <h3>⚙️ Parámetros de la Simulación</h3>
        
        <div className="parametros-grid">
          <div className="parametro-grupo">
            <h4>📅 Período de Simulación</h4>
            <div className="input-group">
              <label>Días a simular:</label>
              <input
                type="number"
                value={dias}
                onChange={(e) => setDias(parseInt(e.target.value))}
                min="1"
                max="365"
              />
            </div>
            <div className="input-group">
              <label>Horas de operación por día:</label>
              <input
                type="number"
                value={horas}
                onChange={(e) => setHoras(parseInt(e.target.value))}
                min="1"
                max="24"
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>📊 Distribución de Clientes</h4>
            <div className="input-group">
              <label>Mínimo clientes por hora:</label>
              <input
                type="number"
                value={minClientes}
                onChange={(e) => setMinClientes(parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Máximo clientes por hora:</label>
              <input
                type="number"
                value={maxClientes}
                onChange={(e) => setMaxClientes(parseInt(e.target.value))}
                min={minClientes}
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>💰 Parámetros Financieros</h4>
            <div className="input-group">
              <label>Costo fijo por día (Bs.):</label>
              <input
                type="number"
                value={costoFijo}
                onChange={(e) => setCostoFijo(parseFloat(e.target.value))}
                min="0"
                step="10"
              />
            </div>
            <div className="input-group">
              <label>Costo por artículo (Bs.):</label>
              <input
                type="number"
                value={costoArticulo}
                onChange={(e) => setCostoArticulo(parseFloat(e.target.value))}
                min="0"
                step="5"
              />
            </div>
            <div className="input-group">
              <label>Precio de venta (Bs.):</label>
              <input
                type="number"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
                min="0"
                step="5"
              />
            </div>
          </div>
        </div>

        <div className="probabilidades-config">
          <h4>🎯 Probabilidad de Compra por Artículos</h4>
          <div className="probabilidades-tabla">
            <table>
              <thead>
                <tr>
                  <th>Cantidad de Artículos</th>
                  <th>Probabilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {probabilidades.map((prob, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        value={prob.articulos}
                        onChange={(e) => actualizarProbabilidad(index, 'articulos', e.target.value)}
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={prob.probabilidad}
                        onChange={(e) => actualizarProbabilidad(index, 'probabilidad', e.target.value)}
                        min="0"
                        max="1"
                        step="0.1"
                      />
                    </td>
                    <td>
                      <button 
                        className="btn-eliminar"
                        onClick={() => eliminarFilaProbabilidad(index)}
                        disabled={probabilidades.length === 1}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-agregar" onClick={agregarFilaProbabilidad}>
              ➕ Agregar Fila
            </button>
            <div className={`validacion-probabilidades ${probabilidadesValidas ? 'valido' : 'invalido'}`}>
              {probabilidadesValidas ? 
                '✅ Las probabilidades suman 1 (100%)' : 
                `❌ Las probabilidades suman ${sumaProbabilidades.toFixed(2)} (deben sumar 1)`
              }
            </div>
          </div>
        </div>

        <div className="resumen-configuracion">
          <div className="config-item">
            <span className="config-label">Total de horas a simular:</span>
            <span className="config-valor">{dias * horas}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Rango de clientes por hora:</span>
            <span className="config-valor">{minClientes} - {maxClientes}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Margen por artículo:</span>
            <span className="config-valor">{formatearMoneda(precioVenta - costoArticulo)}</span>
          </div>
        </div>

        <div className="botones-accion">
          <button 
            className="btn-simular"
            onClick={simularPeriodo}
            disabled={!probabilidadesValidas}
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
          <h2>📈 Resultados del Período ({dias} día{dias !== 1 ? 's' : ''})</h2>
          
          <div className="estadisticas-principales">
            <div className={`estadistica-item ${estadisticas.totalGananciaNeta >= 0 ? 'favorable' : 'desfavorable'}`}>
              <span className="estadistica-label">Ganancia Neta Total</span>
              <span className="estadistica-valor">
                {formatearMoneda(estadisticas.totalGananciaNeta)}
              </span>
              <span className="estadistica-subtexto">{estadisticas.rentabilidadGeneral}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Artículos Vendidos Total</span>
              <span className="estadistica-valor">{estadisticas.totalArticulosVendidos}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Total Clientes</span>
              <span className="estadistica-valor">{estadisticas.totalClientes}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Promedio Ganancia por Día</span>
              <span className="estadistica-valor">{formatearMoneda(estadisticas.promedios.ganancia)}</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Días Rentables</span>
              <span className="estadistica-valor">
                {estadisticas.diasRentables} / {dias} ({estadisticas.porcentajeDiasRentables.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="selector-dias">
            <h3>📅 Seleccionar Día para Ver Detalle</h3>
            <div className="dias-botones">
              {resultados.map((_, index) => (
                <button
                  key={index}
                  className={`btn-dia ${diaSeleccionado === index ? 'activo' : ''} ${
                    resultados[index].estadisticasDia.gananciaNeta >= 0 ? 'rentable' : 'no-rentable'
                  }`}
                  onClick={() => setDiaSeleccionado(index)}
                >
                  Día {index + 1}
                  <span className="estado-dia">
                    {resultados[index].estadisticasDia.gananciaNeta >= 0 ? '✅' : '❌'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {resultados[diaSeleccionado] && (
            <div className="detalle-dia">
              <h3>📊 Detalle del Día {diaSeleccionado + 1}</h3>
              <div className="resumen-dia">
                <div className="resumen-dia-item">
                  <span className="resumen-label">Clientes del día:</span>
                  <span className="resumen-valor">{resultados[diaSeleccionado].estadisticasDia.totalClientes}</span>
                </div>
                <div className="resumen-dia-item">
                  <span className="resumen-label">Artículos vendidos:</span>
                  <span className="resumen-valor">{resultados[diaSeleccionado].estadisticasDia.totalArticulosVendidos}</span>
                </div>
                <div className="resumen-dia-item">
                  <span className="resumen-label">Ingresos del día:</span>
                  <span className="resumen-valor">{formatearMoneda(resultados[diaSeleccionado].estadisticasDia.totalIngresos)}</span>
                </div>
                <div className={`resumen-dia-item ${resultados[diaSeleccionado].estadisticasDia.gananciaNeta >= 0 ? 'favorable' : 'desfavorable'}`}>
                  <span className="resumen-label">Ganancia neta:</span>
                  <span className="resumen-valor">{formatearMoneda(resultados[diaSeleccionado].estadisticasDia.gananciaNeta)}</span>
                </div>
              </div>

              <div className="tabla-resultados">
                <h4>Detalle por Hora - Día {diaSeleccionado + 1}</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Clientes</th>
                      <th>Artículos Vendidos</th>
                      <th>Ingresos (Bs.)</th>
                      <th>Detalle de Compras</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados[diaSeleccionado].resultados.map((resultado, index) => (
                      <tr key={index}>
                        <td className="hora">{resultado.hora}:00</td>
                        <td className="clientes">{resultado.clientes}</td>
                        <td className="articulos">{resultado.articulosVendidos}</td>
                        <td className="ingresos">{formatearMoneda(resultado.ingresos)}</td>
                        <td className="detalle">
                          <div className="detalle-compras">
                            {resultado.clientesDetalle.map((cliente, idx) => (
                              <div key={idx} className="compra-individual">
                                <span className="cliente-info">Cliente {cliente.cliente}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span className="articulos-info">
                                    {cliente.articulosComprados} artículo{cliente.articulosComprados !== 1 ? 's' : ''}
                                  </span>
                                  <span className="ingreso-info">
                                    {formatearMoneda(cliente.ingresoCliente)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="analisis-conclusion">
            <h3>📈 Análisis de Rentabilidad del Período</h3>
            <div className="conclusion-content">
              <p><strong>Total de días simulados:</strong> {dias}</p>
              <p><strong>Días rentables:</strong> {estadisticas.diasRentables} ({estadisticas.porcentajeDiasRentables.toFixed(1)}%)</p>
              <p><strong>Ganancia neta total:</strong> {formatearMoneda(estadisticas.totalGananciaNeta)}</p>
              <p><strong>Promedio de ganancia por día:</strong> {formatearMoneda(estadisticas.promedios.ganancia)}</p>
              <p><strong>Promedio de artículos por cliente:</strong> {(estadisticas.totalArticulosVendidos / estadisticas.totalClientes).toFixed(2)}</p>
              <p><strong>Promedio de clientes por día:</strong> {estadisticas.promedios.clientes.toFixed(2)}</p>
              <div className={`conclusion-final ${estadisticas.totalGananciaNeta >= 0 ? 'favorable' : 'desfavorable'}`}>
                <strong>Conclusión General:</strong> El período simulado fue {estadisticas.totalGananciaNeta >= 0 ? 'rentable' : 'no rentable'} con una ganancia neta total de {formatearMoneda(estadisticas.totalGananciaNeta)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulacionTienda