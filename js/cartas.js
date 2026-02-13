// ============================================
// SISTEMA DE CARTAS - BOTONES FUNCIONAN EN MÓVIL
// ============================================

class SistemaCartas {
    constructor() {
        this.cartas = [];
        this.cartaActual = null;
        this.paginaActual = 1;
        this.lineasPorPagina = 12;
        this.init();
    }

    init() {
        console.log('📚 Iniciando sistema de cartas...');
        this.crearPetales();
        this.crearBotonCargaManual();
        this.intentarCargaAutomatica();
        this.configurarEventos();
        this.detectarDispositivo();
    }

    detectarDispositivo() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
        
        if (isMobile) {
            this.lineasPorPagina = 10;
            document.body.classList.add('mobile-device');
            console.log('📱 Modo móvil activado');
        } else if (isTablet) {
            this.lineasPorPagina = 12;
            document.body.classList.add('tablet-device');
            console.log('📟 Modo tablet activado');
        } else {
            this.lineasPorPagina = 15;
            document.body.classList.add('desktop-device');
            console.log('💻 Modo PC activado');
        }
    }

    crearPetales() {
        const container = document.querySelector('.petals-container');
        if (!container) return;
        
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const cantidad = isMobile ? 8 : 20;
        
        const petalos = ['🌸', '🌺', '🌷', '💮', '🏵️', '🌹'];
        for (let i = 0; i < cantidad; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDelay = Math.random() * 15 + 's';
            petal.style.animationDuration = (Math.random() * 10 + 15) + 's';
            petal.style.fontSize = (Math.random() * 15 + 15) + 'px';
            petal.textContent = petalos[Math.floor(Math.random() * petalos.length)];
            container.appendChild(petal);
        }
    }

    crearBotonCargaManual() {
        const selectorContainer = document.querySelector('.selector-container');
        if (!selectorContainer) return;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        const seccionCarga = document.createElement('div');
        seccionCarga.className = 'carga-manual';
        seccionCarga.style.cssText = `
            text-align: center;
            margin-bottom: ${isMobile ? '20px' : '30px'};
            padding: ${isMobile ? '20px' : '30px'};
            background: linear-gradient(135deg, #fff0f5, #ffe4e1);
            border-radius: 20px;
            border: 3px dashed #ff69b4;
            animation: pulse-border 2s infinite;
        `;

        seccionCarga.innerHTML = `
            <style>
                @keyframes pulse-border {
                    0% { border-color: #ff69b4; }
                    50% { border-color: #ffb6c1; }
                    100% { border-color: #ff69b4; }
                }
                .carga-manual:hover {
                    transform: scale(1.02);
                    transition: 0.3s;
                }
                @media (max-width: 768px) {
                    .carga-manual {
                        padding: 15px !important;
                    }
                    .carga-manual h3 {
                        font-size: 20px !important;
                    }
                    .carga-manual button {
                        padding: 15px 25px !important;
                        font-size: 16px !important;
                    }
                }
                @media (max-width: 480px) {
                    .carga-manual {
                        padding: 12px !important;
                    }
                    .carga-manual h3 {
                        font-size: 18px !important;
                    }
                    .carga-manual p {
                        font-size: 14px !important;
                    }
                    .carga-manual button {
                        padding: 12px 20px !important;
                        font-size: 15px !important;
                        width: 90% !important;
                    }
                    .carga-manual i {
                        font-size: 40px !important;
                    }
                }
            </style>
            <i class="fas fa-cloud-upload-alt" style="font-size: ${isMobile ? '40px' : '50px'}; color: #ff69b4; margin-bottom: 15px;"></i>
            <h3 style="color: #d63384; margin-bottom: 15px; font-size: ${isMobile ? '20px' : '24px'};">
                📁 ¿No ves tus cartas?
            </h3>
            <p style="color: #8b5a7c; margin-bottom: 20px; font-size: ${isMobile ? '16px' : '18px'};">
                Selecciona tus archivos .txt manualmente
            </p>
            <input type="file" 
                   id="cargarTXT" 
                   accept=".txt" 
                   multiple 
                   style="display: none;">
            <button id="btnSeleccionarCartas" style="
                background: linear-gradient(135deg, #ff69b4, #ff1493);
                color: white;
                border: none;
                padding: ${isMobile ? '15px 25px' : '18px 40px'};
                border-radius: 50px;
                font-size: ${isMobile ? '16px' : '20px'};
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 5px 20px rgba(255,20,147,0.4);
                border: 2px solid white;
                width: ${isMobile ? '100%' : 'auto'};
                max-width: 300px;
            ">
                <i class="fas fa-folder-open"></i> Seleccionar Cartas
            </button>
            <div id="estadoCarga" style="
                margin-top: 20px;
                padding: ${isMobile ? '12px' : '15px'};
                border-radius: 10px;
                font-size: ${isMobile ? '14px' : '16px'};
                color: #5d4a66;
                background: rgba(255,255,255,0.5);
                word-break: break-word;
            "></div>
        `;

        selectorContainer.insertBefore(seccionCarga, selectorContainer.firstChild);

        const btn = document.getElementById('btnSeleccionarCartas');
        const fileInput = document.getElementById('cargarTXT');
        const estado = document.getElementById('estadoCarga');

        btn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            this.cargarArchivosManual(e.target.files);
        });
    }

    cargarArchivosManual(archivos) {
        if (!archivos || archivos.length === 0) return;

        const estado = document.getElementById('estadoCarga');
        estado.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Cargando ${archivos.length} carta(s)...`;
        estado.style.background = '#fff3cd';
        estado.style.color = '#856404';

        this.cartas = [];
        let procesados = 0;

        for (let i = 0; i < archivos.length; i++) {
            const archivo = archivos[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenido = e.target.result;
                
                let nombre = archivo.name
                    .replace('.txt', '')
                    .replace(/-/g, ' ')
                    .replace(/_/g, ' ');
                nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

                this.cartas.push({
                    id: Date.now() + i,
                    nombre: `💌 ${nombre}`,
                    contenido: contenido,
                    fecha: new Date().toLocaleDateString('es-ES'),
                    paginas: this.dividirEnPaginas(contenido)
                });

                procesados++;

                if (procesados === archivos.length) {
                    estado.innerHTML = `<i class="fas fa-check-circle" style="color: #28a745;"></i> ¡${this.cartas.length} carta(s) cargada(s)!`;
                    estado.style.background = '#d4edda';
                    estado.style.color = '#155724';
                    
                    this.mostrarSelectorCartas();
                }
            };

            reader.readAsText(archivo);
        }
    }

    async intentarCargaAutomatica() {
        const estado = document.getElementById('estadoCarga');
        if (estado) estado.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Buscando cartas...`;

        const posiblesArchivos = [
            'carta1.txt',
            'carta2.txt', 
            'aniversario.txt',
            'te-amo.txt',
            'promesas.txt',
            'recuerdos.txt',
            'poema.txt',
            'mi-amor.txt'
        ];

        this.cartas = [];
        let cargadas = 0;

        for (const archivo of posiblesArchivos) {
            try {
                const response = await fetch(`cartas/${archivo}`);
                
                if (response.ok) {
                    const contenido = await response.text();
                    
                    let nombre = archivo
                        .replace('.txt', '')
                        .replace(/-/g, ' ')
                        .replace(/_/g, ' ');
                    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

                    this.cartas.push({
                        id: Date.now() + cargadas,
                        nombre: `📖 ${nombre}`,
                        contenido: contenido,
                        fecha: new Date().toLocaleDateString('es-ES'),
                        paginas: this.dividirEnPaginas(contenido)
                    });

                    cargadas++;
                    console.log(`✅ Cargada: ${archivo}`);
                }
            } catch (error) {
                console.log(`ℹ️ No encontrada: ${archivo}`);
            }
        }

        if (this.cartas.length > 0) {
            if (estado) {
                estado.innerHTML = `<i class="fas fa-check-circle" style="color: #28a745;"></i> ¡${this.cartas.length} carta(s) cargadas!`;
                estado.style.background = '#d4edda';
                estado.style.color = '#155724';
            }
            this.mostrarSelectorCartas();
        } else {
            if (estado) {
                estado.innerHTML = `<i class="fas fa-info-circle" style="color: #17a2b8;"></i> Usa el botón para seleccionar tus cartas`;
                estado.style.background = '#d1ecf1';
                estado.style.color = '#0c5460';
            }
            this.mostrarSinCartas();
        }
    }

    dividirEnPaginas(contenido) {
        const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
        const paginas = [];
        
        for (let i = 0; i < lineas.length; i += this.lineasPorPagina) {
            paginas.push(lineas.slice(i, i + this.lineasPorPagina).join('\n'));
        }
        
        return paginas.length > 0 ? paginas : [contenido];
    }

    mostrarSelectorCartas() {
        const cartasList = document.getElementById('cartasList');
        const noCartasMessage = document.getElementById('noCartasMessage');
        const visualizador = document.getElementById('cartaVisualizador');
        
        if (!cartasList) return;
        
        noCartasMessage.style.display = 'none';
        visualizador.style.display = 'block';
        cartasList.innerHTML = '';
        
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        this.cartas.forEach((carta, index) => {
            const cartaItem = document.createElement('div');
            cartaItem.className = 'carta-item';
            
            cartaItem.innerHTML = `
                <div class="carta-icono">
                    <i class="fas fa-envelope-open-text"></i>
                </div>
                <div class="carta-nombre">${carta.nombre}</div>
                <div class="carta-fecha">
                    <i class="far fa-calendar-alt"></i> ${carta.fecha}
                </div>
            `;
            
            cartaItem.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.carta-item').forEach(item => {
                    item.classList.remove('seleccionada');
                });
                cartaItem.classList.add('seleccionada');
                this.cargarCarta(index);
                
                if (isMobile) {
                    setTimeout(() => {
                        visualizador.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 200);
                }
            });
            
            cartasList.appendChild(cartaItem);
        });
        
        setTimeout(() => {
            const primeraCarta = document.querySelectorAll('.carta-item')[0];
            if (primeraCarta) {
                primeraCarta.click();
            }
        }, 100);
    }

    mostrarSinCartas() {
        const cartasList = document.getElementById('cartasList');
        const noCartasMessage = document.getElementById('noCartasMessage');
        const visualizador = document.getElementById('cartaVisualizador');
        
        if (cartasList) cartasList.innerHTML = '';
        if (noCartasMessage) noCartasMessage.style.display = 'block';
        if (visualizador) visualizador.style.display = 'none';
    }

    cargarCarta(index) {
        this.cartaActual = this.cartas[index];
        this.paginaActual = 1;
        
        const titulo = document.getElementById('cartaTitulo');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        titulo.innerHTML = `${this.cartaActual.nombre} <span style="font-size: ${isMobile ? '14px' : '16px'}; color: #8b5a7c; display: ${isMobile ? 'block' : 'inline'};">📅 ${this.cartaActual.fecha}</span>`;
        
        this.mostrarPagina(1);
        this.actualizarControlesPaginacion();
    }

    mostrarPagina(pagina) {
        const contenido = document.getElementById('cartaContenido');
        
        if (!this.cartaActual) return;
        
        pagina = Math.max(1, Math.min(pagina, this.cartaActual.paginas.length));
        this.paginaActual = pagina;
        
        contenido.textContent = this.cartaActual.paginas[pagina - 1];
        this.actualizarControlesPaginacion();
    }

    // ============================================
    // BOTONES DE PÁGINA - ¡CORREGIDO PARA MÓVIL!
    // ============================================
    cambiarPagina(direccion) {
        console.log('🔄 Cambiando página:', direccion);
        
        if (!this.cartaActual) {
            console.log('❌ No hay carta seleccionada');
            return;
        }
        
        const nuevaPagina = this.paginaActual + direccion;
        
        if (nuevaPagina >= 1 && nuevaPagina <= this.cartaActual.paginas.length) {
            this.mostrarPagina(nuevaPagina);
            
            // Efecto visual en el botón
            const btnId = direccion === -1 ? 'prevPageBtn' : 'nextPageBtn';
            const btn = document.getElementById(btnId);
            
            if (btn) {
                btn.style.transform = 'scale(0.9)';
                btn.style.transition = 'transform 0.1s ease';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            }
            
            console.log(`📄 Página ${this.paginaActual}/${this.cartaActual.paginas.length}`);
        }
    }

    actualizarControlesPaginacion() {
        const paginaActualSpan = document.getElementById('paginaActual');
        const totalPaginasSpan = document.getElementById('totalPaginas');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        const paginacionControl = document.getElementById('paginacionControl');
        
        if (!this.cartaActual) return;
        
        const totalPaginas = this.cartaActual.paginas?.length || 1;
        
        if (totalPaginas <= 1) {
            paginacionControl.style.display = 'none';
            return;
        } else {
            paginacionControl.style.display = 'flex';
        }
        
        paginaActualSpan.textContent = this.paginaActual;
        totalPaginasSpan.textContent = totalPaginas;
        
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            prevBtn.style.width = '50px';
            prevBtn.style.height = '50px';
            prevBtn.style.fontSize = '24px';
            nextBtn.style.width = '50px';
            nextBtn.style.height = '50px';
            nextBtn.style.fontSize = '24px';
            paginaActualSpan.style.fontSize = '20px';
            totalPaginasSpan.style.fontSize = '20px';
        }
        
        prevBtn.disabled = this.paginaActual === 1;
        nextBtn.disabled = this.paginaActual === totalPaginas;
        
        // Quitar el onclick del HTML y usar event listeners
        prevBtn.onclick = null;
        nextBtn.onclick = null;
    }

    configurarEventos() {
        console.log('🔧 Configurando eventos...');
        
        // Esperar a que los botones existan
        const verificarBotones = setInterval(() => {
            const prevBtn = document.getElementById('prevPageBtn');
            const nextBtn = document.getElementById('nextPageBtn');
            
            if (prevBtn && nextBtn) {
                clearInterval(verificarBotones);
                
                // Remover onclick del HTML
                prevBtn.removeAttribute('onclick');
                nextBtn.removeAttribute('onclick');
                
                // Agregar event listeners
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.cambiarPagina(-1);
                });
                
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.cambiarPagina(1);
                });
                
                console.log('✅ Botones de página configurados correctamente');
            }
        }, 100);
        
        window.addEventListener('resize', () => {
            this.detectarDispositivo();
        });
    }
}

// INICIAR
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaCartas = new SistemaCartas();
});