// ============================================
// SISTEMA DE CARTAS - VERSIÓN COMPLETA
// ============================================

class SistemaCartas {
    constructor() {
        this.cartasServidor = [];
        this.cartasUsuario = [];
        this.cartaActual = null;
        this.paginaActual = 1;
        this.textoParaGuardar = '';
        this.nombreParaGuardar = '';
        this.tipoGuardado = '';
    
        this.init();
        this.cargarCartasServidor();
        this.cargarCartasUsuario();
        this.configurarModalNombre(); 
    }

    init() {
        console.log('📚 Iniciando sistema de cartas...');
        this.crearPetales();
        this.configurarEventos();
        this.detectarDispositivo();
    }

    crearPetales() {
        const container = document.querySelector('.petals-container');
        if (!container) return;
        
        const petalos = ['🌸', '🌺', '🌷', '💮', '🏵️', '🌹'];
        for (let i = 0; i < 15; i++) {
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

    // ============================================
// CARGAR CARTAS DEL SERVIDOR (TODOS LOS .txt)
// ============================================
async cargarCartasServidor() {
    try {
        // Obtener lista de archivos desde PHP
        const response = await fetch('php/listar-cartas.php');
        const archivos = await response.json();
        
        this.cartasServidor = [];

        for (const archivo of archivos) {
            try {
                const response = await fetch(`cartas/${archivo}`);
                if (response.ok) {
                    const contenido = await response.text();
                    let nombre = archivo.replace('.txt', '').replace(/-/g, ' ').replace(/_/g, ' ');
                    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

                    this.cartasServidor.push({
                        id: 'srv_' + Date.now() + Math.random(),
                        nombre: nombre,
                        contenido: contenido,
                        fecha: this.obtenerFechaModificacion(),
                        paginas: this.dividirEnPaginas(contenido),
                        tipo: 'servidor'
                    });
                }
            } catch (error) {
                console.log(`Error cargando ${archivo}`);
            }
        }

        const countElement = document.getElementById('cartasServidorCount');
        if (countElement) countElement.textContent = this.cartasServidor.length;
        this.mostrarCartas('servidor');
        
    } catch (error) {
        console.error('Error al listar cartas:', error);
        // Fallback a lista vacía
        this.cartasServidor = [];
        document.getElementById('cartasServidorCount').textContent = '0';
    }
}

    // ============================================
    // CARGAR CARTAS DEL USUARIO (localStorage)
    // ============================================
    cargarCartasUsuario() {
        const cartasGuardadas = localStorage.getItem('cartasUsuario');
        if (cartasGuardadas) {
            try {
                this.cartasUsuario = JSON.parse(cartasGuardadas);
                // Recalcular páginas
                this.cartasUsuario.forEach(carta => {
                    carta.paginas = this.dividirEnPaginas(carta.contenido);
                });
            } catch (e) {
                this.cartasUsuario = [];
            }
        } else {
            this.cartasUsuario = [];
        }

        const countElement = document.getElementById('cartasUsuarioCount');
        if (countElement) countElement.textContent = this.cartasUsuario.length;
        
        const noCartasElement = document.getElementById('noCartasUsuario');
        if (noCartasElement) {
            noCartasElement.style.display = this.cartasUsuario.length === 0 ? 'block' : 'none';
        }
        
        this.mostrarCartas('usuario');
    }

    // ============================================
    // GUARDAR CARTAS DE USUARIO
    // ============================================
    guardarCartasUsuario() {
        localStorage.setItem('cartasUsuario', JSON.stringify(this.cartasUsuario));
        
        const countElement = document.getElementById('cartasUsuarioCount');
        if (countElement) countElement.textContent = this.cartasUsuario.length;
        
        const noCartasElement = document.getElementById('noCartasUsuario');
        if (noCartasElement) {
            noCartasElement.style.display = this.cartasUsuario.length === 0 ? 'block' : 'none';
        }
        
        this.mostrarCartas('usuario');
    }

    // ============================================
    // MOSTRAR CARTAS CON BOTONES
    // ============================================
    mostrarCartas(tipo) {
    const gridId = tipo === 'servidor' ? 'cartasServidorList' : 'cartasUsuarioList';
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    const cartas = tipo === 'servidor' ? this.cartasServidor : this.cartasUsuario;
    
    grid.innerHTML = '';

    cartas.forEach((carta, index) => {
        const item = document.createElement('div');
        item.className = 'carta-item';
        item.setAttribute('data-id', carta.id);
        item.setAttribute('data-tipo', tipo);
        
        // Contenido principal de la carta
        item.innerHTML = `
            <div class="carta-icono"><i class="fas fa-envelope-open-text"></i></div>
            <div class="carta-nombre" title="${carta.nombre}">${carta.nombre}</div>
            <div class="carta-fecha">${carta.fecha}</div>
            <div class="carta-botones">
                <button class="btn-descargar" title="Descargar carta">
                    <i class="fas fa-download"></i>
                </button>
                ${tipo === 'usuario' ? `
                <button class="btn-eliminar" title="Eliminar carta">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </div>
        `;
        
        // Evento para seleccionar la carta (click en cualquier parte excepto botones)
        item.addEventListener('click', (e) => {
            // Si el click fue en un botón, no seleccionar la carta
            if (e.target.closest('.btn-descargar') || e.target.closest('.btn-eliminar')) {
                return;
            }
            
            document.querySelectorAll('.carta-item').forEach(i => i.classList.remove('seleccionada'));
            item.classList.add('seleccionada');
            
            this.cartaActual = carta;
            this.paginaActual = 1;
            this.mostrarCartaEnVisor();
        });
        
        // Evento para botón de descargar
        const btnDescargar = item.querySelector('.btn-descargar');
        if (btnDescargar) {
            btnDescargar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.descargarCarta(carta);
            });
        }
        
        // Evento para botón de eliminar (solo en Mis cartas)
        const btnEliminar = item.querySelector('.btn-eliminar');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.eliminarCarta(carta.id, tipo);
            });
        }

        grid.appendChild(item);
    });
    }

    // ============================================
    // DESCARGAR CARTA
    // ============================================
    descargarCarta(carta) {
    try {
        // Crear nombre de archivo
        let nombreArchivo = carta.nombre
            .replace(/[^a-zA-Z0-9]/g, '_')
            .toLowerCase();
        nombreArchivo = `${nombreArchivo}.txt`;
        
        // Crear blob con el contenido
        const blob = new Blob([carta.contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Crear link de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Limpiar URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Mostrar mensaje de éxito
        this.mostrarNotificacion('✅ Carta descargada', 'exito');
        
    } catch (error) {
        console.error('Error al descargar:', error);
        this.mostrarNotificacion('❌ Error al descargar', 'error');
    }
    }

    // ============================================
    // ELIMINAR CARTA (solo de Mis cartas)
    // ============================================
    eliminarCarta(id, tipo) {
    if (tipo !== 'usuario') return;
    
    // Confirmar eliminación
    if (!confirm('¿Estás segura de que quieres eliminar esta carta? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // Filtrar la carta
    this.cartasUsuario = this.cartasUsuario.filter(c => c.id !== id);
    
    // Guardar en localStorage
    this.guardarCartasUsuario();
    
    // Si la carta eliminada era la seleccionada actualmente
    if (this.cartaActual && this.cartaActual.id === id) {
        this.cartaActual = null;
        const visualizador = document.getElementById('cartaVisualizador');
        if (visualizador) visualizador.style.display = 'none';
    }
    
    // Mostrar mensaje
    this.mostrarNotificacion('🗑️ Carta eliminada', 'exito');
    }

    // ============================================
    // MOSTRAR NOTIFICACIÓN
    // ============================================
    mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 25px;
        background: ${tipo === 'exito' ? 'rgba(184, 134, 11, 0.9)' : 'rgba(139, 30, 63, 0.9)'};
        color: white;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        border: 1px solid #d4af37;
        backdrop-filter: blur(5px);
        animation: notificacionAparecer 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'notificacionDesaparecer 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 2500);
    }

// ============================================
// DIVIDIR EN PÁGINAS - VERSIÓN CORREGIDA
// ============================================
dividirEnPaginas(contenido) {
    if (!contenido) return [''];
    
    // Aumentar el límite para que las páginas sean más grandes
    // Antes: 450 caracteres
    // Ahora: 1200 caracteres (similar a 20-25 líneas)
    const CARACTERES_POR_PAGINA = 1200;
    
    // Dividir por líneas en lugar de párrafos
    const lineas = contenido.split('\n');
    const paginas = [];
    let paginaActual = [];
    let caracteresActuales = 0;
    
    for (const linea of lineas) {
        // Si la línea está vacía, mantener el formato
        if (linea.trim() === '') {
            paginaActual.push(linea);
            continue;
        }
        
        if (caracteresActuales + linea.length > CARACTERES_POR_PAGINA && paginaActual.length > 0) {
            paginas.push(paginaActual.join('\n'));
            paginaActual = [linea];
            caracteresActuales = linea.length;
        } else {
            paginaActual.push(linea);
            caracteresActuales += linea.length;
        }
    }
    
    if (paginaActual.length > 0) {
        paginas.push(paginaActual.join('\n'));
    }
    
    // Si solo hay una página o menos, devolver así
    if (paginas.length === 0) return [contenido];
    
    // Limitar a máximo 3 páginas para textos normales
    // Si hay más de 3 páginas, aumentar el límite
    if (paginas.length > 3) {
        // Recalcular con límite más grande
        return this.dividirEnPaginasGrandes(contenido);
    }
    
    return paginas;
}

// ============================================
// DIVIDIR EN PÁGINAS GRANDES (para textos largos)
// ============================================
dividirEnPaginasGrandes(contenido) {
    const CARACTERES_POR_PAGINA = 2000; // Límite más grande
    
    const lineas = contenido.split('\n');
    const paginas = [];
    let paginaActual = [];
    let caracteresActuales = 0;
    
    for (const linea of lineas) {
        if (caracteresActuales + linea.length > CARACTERES_POR_PAGINA && paginaActual.length > 0) {
            paginas.push(paginaActual.join('\n'));
            paginaActual = [linea];
            caracteresActuales = linea.length;
        } else {
            paginaActual.push(linea);
            caracteresActuales += linea.length;
        }
    }
    
    if (paginaActual.length > 0) {
        paginas.push(paginaActual.join('\n'));
    }
    
    return paginas.length > 0 ? paginas : [contenido];
}

    // ============================================
// MOSTRAR CARTA EN VISOR (CON FECHA SEPARADA)
// ============================================
mostrarCartaEnVisor() {
    const visualizador = document.getElementById('cartaVisualizador');
    const titulo = document.getElementById('cartaTitulo');
    const fecha = document.getElementById('cartaFecha');
    const contenido = document.getElementById('cartaContenido');
    const paginacion = document.getElementById('paginacionControl');
    
    if (!this.cartaActual || !visualizador || !titulo || !contenido) return;
    
    visualizador.style.display = 'block';
    
    // Título centrado (solo el nombre, sin fecha)
    titulo.textContent = this.cartaActual.nombre;
    
    // Fecha a la derecha con formato bonito
    if (fecha) {
        fecha.textContent = this.cartaActual.fecha;
    }
    
    if (this.cartaActual.paginas && this.cartaActual.paginas.length > 0) {
        contenido.textContent = this.cartaActual.paginas[this.paginaActual - 1];
        
        if (this.cartaActual.paginas.length > 1 && paginacion) {
            paginacion.style.display = 'flex';
            const paginaSpan = document.getElementById('paginaActual');
            const totalSpan = document.getElementById('totalPaginas');
            const prevBtn = document.getElementById('prevPageBtn');
            const nextBtn = document.getElementById('nextPageBtn');
            
            if (paginaSpan) paginaSpan.textContent = this.paginaActual;
            if (totalSpan) totalSpan.textContent = this.cartaActual.paginas.length;
            if (prevBtn) prevBtn.disabled = this.paginaActual === 1;
            if (nextBtn) nextBtn.disabled = this.paginaActual === this.cartaActual.paginas.length;
        } else if (paginacion) {
            paginacion.style.display = 'none';
        }
    } else {
        contenido.textContent = this.cartaActual.contenido;
        if (paginacion) paginacion.style.display = 'none';
    }
}

    // ============================================
    // CONFIGURAR EVENTOS
    // ============================================
    configurarEventos() {
        // Botón subir archivo
        const btnSubir = document.getElementById('btnSubir');
        const inputFile = document.getElementById('subirArchivo');
        
        if (btnSubir && inputFile) {
            btnSubir.addEventListener('click', () => {
                inputFile.click();
            });

            inputFile.addEventListener('change', (e) => {
                this.procesarArchivoSubido(e.target.files[0]);
            });
        }

        // Botones de crear carta
        const btnVista = document.getElementById('btnVistaPrevia');
        const btnLocal = document.getElementById('btnGuardarLocal');
        const btnGitHub = document.getElementById('btnGuardarGitHub');

        if (btnVista) {
            btnVista.addEventListener('click', () => {
                this.vistaPrevia();
            });
        }

        if (btnLocal) {
            btnLocal.addEventListener('click', () => {
                this.guardarCartaLocal();
            });
        }

        if (btnGitHub) {
            btnGitHub.addEventListener('click', () => {
                this.prepararGuardadoGitHub();
            });
        }

        // Botones de paginación
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!this.cartaActual) return;
                if (this.paginaActual > 1) {
                    this.paginaActual--;
                    this.mostrarCartaEnVisor();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!this.cartaActual) return;
                if (this.paginaActual < this.cartaActual.paginas.length) {
                    this.paginaActual++;
                    this.mostrarCartaEnVisor();
                }
            });
        }

        // Configurar modal
        this.configurarModalGitHub();
    }

    // ============================================
    // PROCESAR ARCHIVO SUBIDO
    // ============================================
    procesarArchivoSubido(archivo) {
        if (!archivo) return;
        
        if (!archivo.name.endsWith('.txt')) {
            this.mostrarEstado('subida', '❌ Solo se permiten archivos .txt', 'error');
            return;
        }

        const estado = document.getElementById('estadoSubida');
        if (estado) {
            estado.className = 'estado-mensaje';
            estado.textContent = '📖 Leyendo archivo...';
            estado.style.display = 'block';
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const contenido = e.target.result;
            let nombre = archivo.name.replace('.txt', '').replace(/-/g, ' ').replace(/_/g, ' ');
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

            const nuevaCarta = {
                id: 'usr_' + Date.now(),
                nombre: nombre,
                contenido: contenido,
                fecha: this.obtenerFechaActual(),
                paginas: this.dividirEnPaginas(contenido),
                tipo: 'usuario'
            };

            this.cartasUsuario.unshift(nuevaCarta);
            this.guardarCartasUsuario();
            
            this.mostrarEstado('subida', '✅ Archivo cargado correctamente', 'exito');
            
            setTimeout(() => {
                const cartas = document.querySelectorAll('#cartasUsuarioList .carta-item');
                if (cartas.length > 0) cartas[0].click();
            }, 100);
        };

        reader.readAsText(archivo);
    }

    // ============================================
    // VISTA PREVIA
    // ============================================
    vistaPrevia() {
        const texto = document.getElementById('textoCarta')?.value.trim();
        
        if (!texto) {
            this.mostrarEstado('crear', '❌ Escribe algo para ver la vista previa', 'error');
            return;
        }

        this.textoParaGuardar = texto;

        const cartaPreview = {
            id: 'preview',
            nombre: `Vista previa - ${this.obtenerFechaActual()}`,
            contenido: texto,
            fecha: this.obtenerFechaActual(),
            paginas: this.dividirEnPaginas(texto)
        };

        this.cartaActual = cartaPreview;
        this.paginaActual = 1;
        this.mostrarCartaEnVisor();
        
        this.mostrarEstado('crear', '👀 Vista previa lista', 'exito');
    }

    // ============================================
// GUARDAR CARTA EN LOCAL (CON NOMBRE)
// ============================================
guardarCartaLocal() {
    const texto = document.getElementById('textoCarta')?.value.trim();
    
    if (!texto) {
        this.mostrarEstado('crear', '❌ Escribe algo para guardar', 'error');
        return;
    }

    this.textoParaGuardar = texto;
    this.abrirModalNombre('local');
}

// ============================================
// GUARDAR CARTA EN LOCAL (después de poner nombre)
// ============================================
guardarCartaLocalConNombre(nombre) {
    const nuevaCarta = {
        id: 'usr_' + Date.now(),
        nombre: nombre,
        contenido: this.textoParaGuardar,
        fecha: this.obtenerFechaActual(),
        paginas: this.dividirEnPaginas(this.textoParaGuardar),
        tipo: 'usuario'
    };

    this.cartasUsuario.unshift(nuevaCarta);
    this.guardarCartasUsuario();
    
    this.mostrarEstado('crear', `✅ Carta "${nombre}" guardada`, 'exito');
    
    const textoInput = document.getElementById('textoCarta');
    if (textoInput) textoInput.value = '';
    this.textoParaGuardar = '';
    
    setTimeout(() => {
        const cartas = document.querySelectorAll('#cartasUsuarioList .carta-item');
        if (cartas.length > 0) cartas[0].click();
    }, 100);
}

    // ============================================
// PREPARAR GUARDADO EN GITHUB (CON NOMBRE)
// ============================================
prepararGuardadoGitHub() {
    const texto = document.getElementById('textoCarta')?.value.trim();
    
    if (!texto) {
        this.mostrarEstado('crear', '❌ Escribe algo para guardar', 'error');
        return;
    }
    
    this.textoParaGuardar = texto;
    this.abrirModalNombre('github');
}

// ============================================
// PREPARAR GUARDADO EN GITHUB (después de nombre)
// ============================================
prepararGuardadoGitHubConNombre(nombre) {
    this.nombreParaGuardar = nombre;
    
    const modal = document.getElementById('githubModal');
    if (modal) {
        modal.classList.add('show');
        const passwordInput = document.getElementById('githubPassword');
        if (passwordInput) passwordInput.value = '';
        const errorDiv = document.getElementById('modalError');
        if (errorDiv) errorDiv.style.display = 'none';
    }
}

    // ============================================
    // CONFIGURAR MODAL GITHUB
    // ============================================
    configurarModalGitHub() {
        const modal = document.getElementById('githubModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelarModal');
        const confirmBtn = document.getElementById('confirmarGuardar');

        if (closeBtn) {
            closeBtn.onclick = () => this.cerrarModalGitHub();
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => this.cerrarModalGitHub();
        }
        
        window.onclick = (e) => {
            if (e.target === modal) this.cerrarModalGitHub();
        };

        if (confirmBtn) {
            confirmBtn.onclick = () => this.guardarEnGitHub();
        }
    }

    cerrarModalGitHub() {
        const modal = document.getElementById('githubModal');
        if (modal) modal.classList.remove('show');
    }

    // ============================================
    // GUARDAR EN GITHUB
    // ============================================
    async guardarEnGitHub() {
        const password = document.getElementById('githubPassword')?.value;
        const errorDiv = document.getElementById('modalError');
        const guardarComoNuevo = document.getElementById('guardarComoNuevo')?.checked;

        if (!password) {
            if (errorDiv) {
                errorDiv.textContent = '❌ Ingresa la contraseña';
                errorDiv.style.display = 'block';
            }
            return;
        }

        this.mostrarEstado('crear', '📤 Guardando en GitHub...', 'exito');

        try {
            const response = await fetch('php/github-guardar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: password,
                    nombre: this.nombreParaGuardar,
                    contenido: this.textoParaGuardar,
                    comoNuevo: guardarComoNuevo
                })
            });

            const data = await response.json();

            if (data.success) {
                this.cerrarModalGitHub();
                this.mostrarEstado('crear', '✅ Guardado en GitHub correctamente', 'exito');
                
                if (confirm('¿Quieres agregarla también a Mis cartas?')) {
                    this.guardarCartaLocal();
                }
                
                const textoInput = document.getElementById('textoCarta');
                if (textoInput) textoInput.value = '';
                this.textoParaGuardar = '';
                
            } else {
                if (errorDiv) {
                    errorDiv.textContent = data.message || '❌ Error al guardar';
                    errorDiv.style.display = 'block';
                }
            }
        } catch (error) {
            if (errorDiv) {
                errorDiv.textContent = '❌ Error de conexión';
                errorDiv.style.display = 'block';
            }
        }
    }

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    mostrarEstado(seccion, mensaje, tipo) {
        const estado = document.getElementById(`estado${seccion === 'subida' ? 'Subida' : 'Crear'}`);
        if (!estado) return;
        
        estado.className = `estado-mensaje ${tipo}`;
        estado.textContent = mensaje;
        estado.style.display = 'block';
        
        setTimeout(() => {
            estado.style.display = 'none';
        }, 3000);
    }

    obtenerFechaActual() {
        const now = new Date();
        return now.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    detectarDispositivo() {
        // No necesita hacer nada especial, pero mantenemos la función
    }

    // ============================================
// CONFIGURAR MODAL DE NOMBRE
// ============================================
configurarModalNombre() {
    const modal = document.getElementById('nombreModal');
    const closeBtn = document.getElementById('closeNombreModal');
    const cancelBtn = document.getElementById('cancelarNombreModal');
    const confirmBtn = document.getElementById('confirmarNombreModal');

    if (closeBtn) {
        closeBtn.onclick = () => this.cerrarModalNombre();
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = () => this.cerrarModalNombre();
    }
    
    if (confirmBtn) {
        confirmBtn.onclick = () => this.procesarGuardadoConNombre();
    }
    
    // Cerrar al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) this.cerrarModalNombre();
    });
    
    // Enter para confirmar
    const input = document.getElementById('nombreCartaInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.procesarGuardadoConNombre();
            }
        });
    }
}

// ============================================
// ABRIR MODAL DE NOMBRE
// ============================================
abrirModalNombre(tipo) {
    this.tipoGuardado = tipo; // 'local' o 'github'
    const modal = document.getElementById('nombreModal');
    const input = document.getElementById('nombreCartaInput');
    
    // Sugerir nombre basado en fecha
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES').replace(/\//g, '-');
    input.value = `Carta ${fechaStr}`;
    
    if (modal) {
        modal.classList.add('show');
        setTimeout(() => input.focus(), 100);
    }
}

// ============================================
// CERRAR MODAL DE NOMBRE
// ============================================
cerrarModalNombre() {
    const modal = document.getElementById('nombreModal');
    if (modal) modal.classList.remove('show');
}

// ============================================
// PROCESAR GUARDADO CON NOMBRE
// ============================================
procesarGuardadoConNombre() {
    const input = document.getElementById('nombreCartaInput');
    const errorDiv = document.getElementById('nombreModalError');
    let nombre = input.value.trim();
    
    if (!nombre) {
        errorDiv.textContent = '❌ El nombre no puede estar vacío';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Limitar longitud
    if (nombre.length > 50) {
        nombre = nombre.substring(0, 50);
    }
    
    errorDiv.style.display = 'none';
    this.cerrarModalNombre();
    
    // Guardar según el tipo
    if (this.tipoGuardado === 'local') {
        this.guardarCartaLocalConNombre(nombre);
    } else if (this.tipoGuardado === 'github') {
        this.prepararGuardadoGitHubConNombre(nombre);
    }
}

    
}

// INICIAR
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaCartas = new SistemaCartas();
});