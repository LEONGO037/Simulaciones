import React, { useState } from 'react';
import './SimulacionInventario.css';

const SimulacionInventario = () => {
  // Estados para los parámetros configurables
  const [params, setParams] = useState({
    meanDemand: 100,
    reviewDays: 7,
    minDeliveryTime: 1,
    maxDeliveryTime: 3,
    storageCapacity: 700,
    orderCost: 100,
    holdingCost: 0.1,
    acquisitionCost: 3.5,
    sellingPrice: 5,
    simulationDays: 60,
    numSimulations: 100
  });

  const [resultados, setResultados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const exponential = (mean) => {
    return -mean * Math.log(1 - Math.random());
  };


  // Función para generar una variable uniforme discreta
  const uniformDiscrete = (min, max) => {
    return Math.floor(min + Math.random() * (max - min + 1));
  };

  // Función principal de simulación
  const simularInventario = () => {
    setIsLoading(true);

    setTimeout(() => {
      const {
        meanDemand,
        reviewDays,
        minDeliveryTime,
        maxDeliveryTime,
        storageCapacity,
        orderCost,
        holdingCost,
        acquisitionCost,
        sellingPrice,
        simulationDays,
        numSimulations
      } = params;

      const simulaciones = [];
      let totalNetProfit = 0;
      let totalCost = 0;
      let totalRevenue = 0;
      let totalUnsatisfiedDemand = 0;
      let totalHoldingCost = 0;
      let totalOrderCost = 0;
      let totalAcquisitionCost = 0;
      let maxInventoryLevel = 0;
      let minInventoryLevel = storageCapacity;
      let daysWithStockouts = 0;

      // MOVER dailyResults FUERA del bucle de simulaciones
      let dailyResults = [];

      // Calcular el costo inicial: llenar el almacén y el costo de pedir
      const costoInicialAzucar = +(storageCapacity * acquisitionCost).toFixed(2);
      const costoInicialPedido = +orderCost.toFixed(2);
      const costoInicialTotal = +(costoInicialAzucar + costoInicialPedido).toFixed(2);

      for (let sim = 0; sim < numSimulations; sim++) {
        let inventory = Math.round(storageCapacity);
        let pendingOrders = [];
        let simRevenue = 0;
        let simCost = 0;
        let simUnsatisfiedDemand = 0;
        let simHoldingCost = 0;
        let simOrderCost = 0;
        let simAcquisitionCost = 0;
        let simMaxInventory = inventory;
        let simMinInventory = inventory;
        let simDaysWithStockouts = 0;

        // Sumar el costo inicial solo una vez por simulación
        simAcquisitionCost += costoInicialAzucar;
        simOrderCost += costoInicialPedido;

        for (let day = 1; day <= simulationDays; day++) {
          // 1. Recibir pedidos pendientes
          const arrivedOrders = pendingOrders.filter(order => order.arrivalDay === day);
          arrivedOrders.forEach(order => {
            inventory += Math.round(order.quantity);
            simAcquisitionCost += +(Math.round(order.quantity) * acquisitionCost).toFixed(2); // 2 decimales
          });
          pendingOrders = pendingOrders.filter(order => order.arrivalDay > day);

          // 2. Atender demanda del día
          const demand = Math.round(exponential(meanDemand));
          const sales = Math.min(inventory, demand);
          const unsatisfied = demand - sales;

          inventory -= sales;
          simRevenue += +(sales * sellingPrice).toFixed(2); // 2 decimales
          simUnsatisfiedDemand += unsatisfied;

          if (unsatisfied > 0) {
            simDaysWithStockouts++;
          }

          // 3. Calcular costo de mantenimiento
          const dailyHoldingCost = +(Math.round(inventory) * holdingCost).toFixed(2); // 2 decimales
          simHoldingCost += dailyHoldingCost;

          // 4. Revisión de inventario y pedido
          let orderQuantity = 0;
          // Cambia la condición: solo pedir en múltiplos de reviewDays (excepto el primer día)
          if (day % reviewDays === 0) {
            orderQuantity = Math.max(0, storageCapacity - inventory);
            orderQuantity = Math.round(orderQuantity);
            if (orderQuantity > 0) {
              simOrderCost += orderCost;
              const deliveryTime = uniformDiscrete(minDeliveryTime, maxDeliveryTime);
              pendingOrders.push({
                quantity: orderQuantity,
                arrivalDay: day + deliveryTime
              });
            }
          }

          // Actualizar niveles máximos y mínimos
          simMaxInventory = Math.max(simMaxInventory, inventory);
          simMinInventory = Math.min(simMinInventory, inventory);

          // Guardar resultados diarios (solo para la primera simulación)
          if (sim === 0 && day <= 30) {
            dailyResults.push({
              dia: day,
              inventario: Math.round(inventory),
              demanda: demand,
              ventas: sales,
              demandaInsatisfecha: unsatisfied,
              pedidoRealizado: orderQuantity,
              costoMantenimiento: dailyHoldingCost // ya con 2 decimales
            });
          }
        }

        // Calcular costos totales y ganancia neta para esta simulación
        simCost = +(simHoldingCost + simOrderCost + simAcquisitionCost).toFixed(2);
        const simNetProfit = +(simRevenue - simCost).toFixed(2);

        // Acumular estadísticas
        totalNetProfit += simNetProfit;
        totalCost += simCost;
        totalRevenue += simRevenue;
        totalUnsatisfiedDemand += simUnsatisfiedDemand;
        totalHoldingCost += simHoldingCost;
        totalOrderCost += simOrderCost;
        totalAcquisitionCost += simAcquisitionCost;
        maxInventoryLevel = Math.max(maxInventoryLevel, simMaxInventory);
        minInventoryLevel = Math.min(minInventoryLevel, simMinInventory);
        daysWithStockouts += simDaysWithStockouts;

        simulaciones.push({
          simulacion: sim + 1,
          gananciaNeta: simNetProfit,
          ingresos: simRevenue,
          costos: simCost,
          demandaInsatisfecha: Math.round(simUnsatisfiedDemand)
        });
      }

      // Calcular promedios (redondeados a 2 decimales para dinero)
      const avgNetProfit = +(totalNetProfit / numSimulations).toFixed(2);
      const avgRevenue = +(totalRevenue / numSimulations).toFixed(2);
      const avgCost = +(totalCost / numSimulations).toFixed(2);
      const avgUnsatisfiedDemand = Math.round(totalUnsatisfiedDemand / numSimulations);
      const avgHoldingCost = +(totalHoldingCost / numSimulations).toFixed(2);
      const avgOrderCost = +(totalOrderCost / numSimulations).toFixed(2);
      const avgAcquisitionCost = +(totalAcquisitionCost / numSimulations).toFixed(2);
      const avgDaysWithStockouts = Math.round(daysWithStockouts / numSimulations);

      setResultados(simulaciones.slice(0, 10));
      setEstadisticas({
        gananciaNetaPromedio: avgNetProfit,
        ingresosPromedio: avgRevenue,
        costosPromedio: avgCost,
        demandaInsatisfechaPromedio: avgUnsatisfiedDemand,
        costoMantenimientoPromedio: avgHoldingCost,
        costoOrdenarPromedio: avgOrderCost,
        costoAdquisicionPromedio: avgAcquisitionCost,
        diasConDesabastoPromedio: avgDaysWithStockouts,
        nivelMaximoInventario: Math.round(maxInventoryLevel),
        nivelMinimoInventario: Math.round(minInventoryLevel),
        resultadosDiarios: dailyResults,
        costoInicialTotal, // <-- Agrega el costo inicial al objeto de estadísticas
        costoInicialAzucar,
        costoInicialPedido
      });
      setMostrarResultados(true);
      setIsLoading(false);
    }, 100);
  };

  const limpiarSimulacion = () => {
    setResultados([]);
    setEstadisticas(null);
    setMostrarResultados(false);
  };

  const handleParamChange = (param, value) => {
    setParams(prev => ({
      ...prev,
      [param]: parseFloat(value)
    }));
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor).replace('BOB', 'Bs.');
  };

  const formatearNumero = (valor) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(valor);
  };

  return (
    <div className="simulacion-inventario-container">
      <h1>📦 Simulación de Inventario de Azúcar</h1>
      
      <div className="explicacion-simulacion">
        <h3>📋 ¿Qué hace esta simulación?</h3>
        <div className="descripcion-texto">
          <p>
            Esta simulación modela el sistema de inventario de una tienda de azúcar donde la demanda 
            sigue una distribución exponencial. El dueño revisa el inventario periódicamente y realiza 
            pedidos considerando el tiempo de entrega y la capacidad de almacenamiento.
          </p>
          <p>
            El programa calcula la ganancia neta, costos de operación y demanda insatisfecha, 
            permitiendo evaluar si la capacidad actual de almacenamiento es suficiente para 
            el negocio.
          </p>
        </div>
      </div>

      <div className="parametros-simulacion">
        <h3>⚙️ Parámetros de la Simulación</h3>
        
        <div className="parametros-grid">
          <div className="parametro-grupo">
            <h4>📊 Parámetros de Demanda</h4>
            <div className="input-group">
              <label>Demanda media (kg/día):</label>
              <input
                type="number"
                value={params.meanDemand}
                onChange={(e) => handleParamChange('meanDemand', e.target.value)}
                min="1"
                step="1"
              />
            </div>
            <div className="input-group">
              <label>Días entre revisiones:</label>
              <input
                type="number"
                value={params.reviewDays}
                onChange={(e) => handleParamChange('reviewDays', e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>🚚 Tiempos de Entrega</h4>
            <div className="input-group">
              <label>Tiempo mínimo entrega (días):</label>
              <input
                type="number"
                value={params.minDeliveryTime}
                onChange={(e) => handleParamChange('minDeliveryTime', e.target.value)}
                min="1"
                step="1"
              />
            </div>
            <div className="input-group">
              <label>Tiempo máximo entrega (días):</label>
              <input
                type="number"
                value={params.maxDeliveryTime}
                onChange={(e) => handleParamChange('maxDeliveryTime', e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>🏪 Capacidad y Costos</h4>
            <div className="input-group">
              <label>Capacidad almacén (kg):</label>
              <input
                type="number"
                value={params.storageCapacity}
                onChange={(e) => handleParamChange('storageCapacity', e.target.value)}
                min="100"
                step="50"
              />
            </div>
            <div className="input-group">
              <label>Costo ordenar (Bs./orden):</label>
              <input
                type="number"
                value={params.orderCost}
                onChange={(e) => handleParamChange('orderCost', e.target.value)}
                min="0"
                step="10"
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>💰 Costos y Precios</h4>
            <div className="input-group">
              <label>Costo mantenimiento (Bs./kg):</label>
              <input
                type="number"
                value={params.holdingCost}
                onChange={(e) => handleParamChange('holdingCost', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Costo adquisición (Bs./kg):</label>
              <input
                type="number"
                value={params.acquisitionCost}
                onChange={(e) => handleParamChange('acquisitionCost', e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="input-group">
              <label>Precio venta (Bs./kg):</label>
              <input
                type="number"
                value={params.sellingPrice}
                onChange={(e) => handleParamChange('sellingPrice', e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="parametro-grupo">
            <h4>📈 Configuración Simulación</h4>
            <div className="input-group">
              <label>Días a simular:</label>
              <input
                type="number"
                value={params.simulationDays}
                onChange={(e) => handleParamChange('simulationDays', e.target.value)}
                min="30"
                max="365"
                step="30"
              />
            </div>
            <div className="input-group">
              <label>Número de simulaciones:</label>
              <input
                type="number"
                value={params.numSimulations}
                onChange={(e) => handleParamChange('numSimulations', e.target.value)}
                min="1"
                max="1000"
                step="10"
              />
            </div>
          </div>
        </div>

        <div className="resumen-configuracion">
          <div className="config-item">
            <span className="config-label">Revisiones de inventario:</span>
            <span className="config-valor">
              {Math.floor(params.simulationDays / params.reviewDays)} veces
            </span>
          </div>
        </div>

        <div className="botones-accion">
          <button 
            className="btn-simular"
            onClick={simularInventario}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Simulando...' : '🚀 Ejecutar Simulación'}
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
          <h2>📈 Resultados de la Simulación ({params.numSimulations} simulaciones)</h2>
          
          <div className="estadisticas-principales">
            <div className="estadistica-item">
              <span className="estadistica-label">Ganancia Neta Promedio</span>
              <span className="estadistica-valor">
                {formatearMoneda(estadisticas.gananciaNetaPromedio)}
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Demanda Insatisfecha Promedio</span>
              <span className="estadistica-valor">
                {formatearNumero(estadisticas.demandaInsatisfechaPromedio)} kg
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Días con Desabasto Promedio</span>
              <span className="estadistica-valor">
                {formatearNumero(estadisticas.diasConDesabastoPromedio)} días
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Nivel Máximo Inventario</span>
              <span className="estadistica-valor">
                {formatearNumero(estadisticas.nivelMaximoInventario)} kg
              </span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-label">Nivel Mínimo Inventario</span>
              <span className="estadistica-valor">
                {formatearNumero(estadisticas.nivelMinimoInventario)} kg
              </span>
            </div>
          </div>

          <div className="desglose-costos">
            <h3>💰 Desglose de Costos e Ingresos Promedio</h3>
            <div className="costos-grid">
              <div className="costo-item">
                <span className="costo-label">Ingresos por Ventas:</span>
                <span className="costo-valor">
                  {formatearMoneda(estadisticas.ingresosPromedio)}
                </span>
              </div>
              <div className="costo-item">
                <span className="costo-label">Costo de Mantenimiento:</span>
                <span className="costo-valor">
                  {formatearMoneda(estadisticas.costoMantenimientoPromedio)}
                </span>
              </div>
              <div className="costo-item">
                <span className="costo-label">Costo de Ordenar:</span>
                <span className="costo-valor">
                  {formatearMoneda(estadisticas.costoOrdenarPromedio)}
                </span>
              </div>
              <div className="costo-item">
                <span className="costo-label">Costo de Adquisición:</span>
                <span className="costo-valor">
                  {formatearMoneda(estadisticas.costoAdquisicionPromedio)}
                </span>
              </div>
              <div className="costo-item total">
                <span className="costo-label">Costos Totales:</span>
                <span className="costo-valor">
                  {formatearMoneda(estadisticas.costosPromedio)}
                </span>
              </div>
            </div>
          </div>

          <div className="tabla-resultados">
            <h3>📊 Detalle por Día (Primeros 30 días - Simulación 1)</h3>
            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Inventario (kg)</th>
                  <th>Demanda (kg)</th>
                  <th>Ventas (kg)</th>
                  <th>Demanda Insatisfecha (kg)</th>
                  <th>Pedido Realizado (kg)</th>
                  <th>Costo Mantenimiento (Bs.)</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.resultadosDiarios.map((resultado, index) => (
                  <tr key={index}>
                    <td className="dia">{resultado.dia}</td>
                    <td className="inventario">{resultado.inventario}</td>
                    <td className="demanda">{resultado.demanda}</td>
                    <td className="ventas">{resultado.ventas}</td>
                    <td className="demanda-insatisfecha">{resultado.demandaInsatisfecha}</td>
                    <td className="pedido">{resultado.pedidoRealizado}</td>
                    <td className="costo-mantenimiento">{resultado.costoMantenimiento.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {estadisticas.resultadosDiarios.length < params.simulationDays && (
              <p className="mensaje-limitado">
                Mostrando solo primeros 30 días de {params.simulationDays} días simulados
              </p>
            )}
          </div>

          <div className="analisis-conclusion">
            <h3>📈 Análisis de la Capacidad del Almacén</h3>
            <div className="conclusion-content">
              <p><strong>Utilización de capacidad:</strong> {(estadisticas.nivelMaximoInventario / params.storageCapacity * 100).toFixed(1)}% de la capacidad máxima utilizada</p>
              <p><strong>Nivel de servicio:</strong> {((1 - (estadisticas.demandaInsatisfechaPromedio / (params.meanDemand * params.simulationDays))) * 100).toFixed(1)}% de la demanda satisfecha</p>
              <p><strong>Frecuencia de desabastos:</strong> {(estadisticas.diasConDesabastoPromedio / params.simulationDays * 100).toFixed(1)}% de los días con desabasto</p>
              <p><strong>Rentabilidad:</strong> {((estadisticas.gananciaNetaPromedio / estadisticas.ingresosPromedio) * 100).toFixed(1)}% de margen neto</p>
              
              <div className="conclusion-final">
                <strong>Conclusión:</strong> {
                  estadisticas.demandaInsatisfechaPromedio > (params.meanDemand * params.simulationDays * 0.05) 
                    ? `La capacidad actual de ${params.storageCapacity} kg podría ser INSUFICIENTE, se recomienda aumentar la capacidad o ajustar la política de pedidos.`
                    : `La capacidad actual de ${params.storageCapacity} kg parece ser SUFICIENTE para el nivel de demanda actual.`
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulacionInventario