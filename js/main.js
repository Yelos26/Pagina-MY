// Variables para el carrusel
let currentSlide = 0;
let autoPlayInterval;
const slides = document.querySelectorAll('.carousel-img');
const dotsContainer = document.querySelector('.carousel-dots');

// Crear puntos dinámicamente con estilo
function createDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

// Cambiar slide con animación suave
function changeSlide(direction) {
    const nextSlide = (currentSlide + direction + slides.length) % slides.length;
    goToSlide(nextSlide);
}

// Ir a slide específico con efectos
function goToSlide(index) {
    // Efecto de salida
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
    
    // Efecto de entrada
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('active');
    
    // Efecto visual en el botón activo
    const activeDot = document.querySelectorAll('.dot')[currentSlide];
    activeDot.style.transform = 'scale(1.4)';
    setTimeout(() => {
        activeDot.style.transform = '';
    }, 300);
    
    // Resetear auto-play
    resetAutoPlay();
}

// Auto-play del carrusel
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Función para abrir proyectos con efectos elegantes
function openProject(projectType) {
    const projectData = {
        'carta': {
            title: 'Carta de Amor Eterno',
            content: 'Mi amor,\n\nEres la luz que ilumina mis días...',
            emoji: '💌'
        },
        'galeria': {
            title: 'Galería de Suspiros',
            content: 'Cada foto es un latido de nuestro corazón...',
            emoji: '📸'
        },
        'cancion': {
            title: 'Nuestra Sinfonía',
            content: 'Esta canción dice lo que mis palabras no pueden...',
            emoji: '🎵'
        },
        'timeline': {
            title: 'Nuestra Historia',
            content: 'Desde el primer hasta el último suspiro...',
            emoji: '⏳'
        },
        'razones': {
            title: 'Mil Razones',
            content: '1. Por tu sonrisa que ilumina el universo...',
            emoji: '🌟'
        },
        'promesas': {
            title: 'Promesas Eternas',
            content: 'Te prometo amarte en cada amanecer...',
            emoji: '🤝'
        },
        'sorpresa': {
            title: 'Sorpresa Secreta',
            content: 'Shh... esto es solo para tus ojos...',
            emoji: '🎁'
        },
        'poemas': {
            title: 'Versos para Ti',
            content: 'En tus ojos encontré el cielo...',
            emoji: '✍️'
        }
    };

    const project = projectData[projectType] || {
        title: 'Nuestro Tesoro',
        content: 'Este momento es solo nuestro...',
        emoji: '❤️'
    };

    // Crear modal elegante
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-emoji">${project.emoji}</span>
                <h3>${project.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${project.content}</p>
                <div class="modal-heart">❤️</div>
            </div>
        </div>
    `;

    // Estilos para el modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: modalFadeIn 0.5s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: linear-gradient(135deg, #fff 0%, #f8f5ff 100%);
            width: 90%;
            max-width: 500px;
            border-radius: 25px;
            padding: 40px;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
            animation: modalSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        
        @keyframes modalSlideUp {
            from { transform: translateY(50px) scale(0.9); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        .modal-header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
        }
        
        .modal-emoji {
            font-size: 50px;
            display: block;
            margin-bottom: 15px;
            animation: float 3s ease-in-out infinite;
        }
        
        .modal-header h3 {
            color: #5d4a66;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .modal-close {
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: none;
            font-size: 30px;
            color: #8a7b8d;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #ff6b8b;
        }
        
        .modal-body {
            text-align: center;
            line-height: 1.8;
            color: #666;
            font-size: 18px;
            white-space: pre-line;
        }
        
        .modal-heart {
            margin-top: 30px;
            font-size: 40px;
            animation: heartbeat 1.5s infinite;
            color: #ff6b8b;
        }
        
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Cerrar modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.animation = 'modalFadeOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'modalFadeOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    createDots();
    startAutoPlay();
    
    // Efecto de hover en botones de proyecto
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.03)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        // Efecto de clic
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }, 150);
        });
    });
    
    // Efecto de parallax en elementos flotantes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});

function abrirCartas() {
    window.location.href = 'cartas.html';
}