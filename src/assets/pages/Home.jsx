import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <header className="hero-section">
        <h1 className="hero-title">Simulaciones Interactivas</h1>
        <p className="hero-subtitle">Explora el mundo de la simulación y los modelos matemáticos</p>
        <div className="hero-gradient"></div>
      </header>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Análisis Estadístico</h3>
            <p>Simulaciones basadas en probabilidades y análisis de datos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Procesos Iterativos</h3>
            <p>Modelos que se desarrollan a través del tiempo</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Resultados en Tiempo Real</h3>
            <p>Observa cómo cambian los resultados al modificar parámetros</p>
          </div>
        </div>
      </section>

      <section className="simulations-preview">
        <h2>Simulaciones Disponibles</h2>
        <div className="simulations-grid">
            {/* Fila superior - 3 tarjetas */}
            <div className="simulations-row top-row">
            <div className="simulation-card">
                <h4>💰 Depósito a Plazo Fijo</h4>
                <p>Simulación de inversiones y crecimiento financiero con diferentes tasas de interés</p>
                <div className="simulation-tag">Finanzas</div>
            </div>
            <div className="simulation-card">
                <h4>🚜 Simulación Granjero</h4>
                <p>Gestión de recursos agrícolas, cultivos y optimización de producción</p>
                <div className="simulation-tag">Agrícola</div>
            </div>
            <div className="simulation-card">
                <h4>🎲 Lanzamiento de Dados</h4>
                <p>Estudio de probabilidades, distribuciones y ley de los grandes números</p>
                <div className="simulation-tag">Probabilidad</div>
            </div>
            </div>
            
            {/* Fila inferior - 2 tarjetas centradas */}
            <div className="simulations-row bottom-row">
            <div className="simulation-card">
                <h4>🏪 Tienda de Azúcar</h4>
                <p>Gestión de inventarios, demanda variable y puntos de reorden</p>
                <div className="simulation-tag">Inventarios</div>
            </div>
            <div className="simulation-card">
                <h4>👥 Clientes Tienda</h4>
                <p>Comportamiento de clientes, teoría de colas y tiempos de servicio</p>
                <div className="simulation-tag">Colas</div>
            </div>
            </div>
        </div>
        </section>

      <section className="flowchart-section">
        <h2>Proceso de Construcción de Modelos</h2>
        <div className="flowchart">
            <div className="flow-step">
            <div className="step-number">1</div>
            <h4>Diccionario de Variables</h4>
            <p>Especificación y explicación de los componentes del modelo</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
            <div className="step-number">2</div>
            <h4>Clasificación de Variables</h4>
            <p>Identificación de variables Exógenas, de Estado y Endógenas</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
            <div className="step-number">3</div>
            <h4>Relaciones Funcionales</h4>
            <p>Definición de ecuaciones y características de operación</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
            <div className="step-number">4</div>
            <h4>Diagrama de Flujo</h4>
            <p>Representación completa del modelo</p>
            </div>
        </div>
        </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">6</div>
            <div className="stat-label">Simulaciones</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Interactivo</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>¿Listo para comenzar?</h2>
        <p>Selecciona una simulación del menú lateral y explora diferentes escenarios</p>
        <div className="cta-glow"></div>
      </section>
    </div>
  )
}

export default Home