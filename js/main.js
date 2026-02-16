// ============================================
// MAIN - CARRUSEL Y FUNCIONALIDADES
// ============================================

// Variables para el carrusel
let currentSlide = 0;
let autoPlayInterval;
const slides = document.querySelectorAll('.carousel-img');
const dotsContainer = document.querySelector('.carousel-dots');

// Crear puntos dinámicamente
function createDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

// Cambiar slide
function changeSlide(direction) {
    const nextSlide = (currentSlide + direction + slides.length) % slides.length;
    goToSlide(nextSlide);
}

// Ir a slide específico
function goToSlide(index) {
    if (!slides.length) return;
    
    // Quitar active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    // Activar nuevo slide
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    
    const dots = document.querySelectorAll('.dot');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
        
        // Efecto visual
        dots[currentSlide].style.transform = 'scale(1.4)';
        setTimeout(() => {
            dots[currentSlide].style.transform = '';
        }, 300);
    }
    
    resetAutoPlay();
}

// Auto-play
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Función para proyectos (placeholder)
function goToProject(projectType) {
    console.log('Proyecto:', projectType);
    
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content" style="background: #2d1c1c; color: #e6d5d5; border: 2px solid #b8860b;">
            <div class="modal-header">
                <span class="modal-emoji">🔨</span>
                <h3 style="color: #e6d5d5;">En construcción</h3>
                <button class="modal-close" style="color: #b8860b;">&times;</button>
            </div>
            <div class="modal-body">
                <p>Próximamente: ${projectType}</p>
                <div class="modal-heart" style="color: #b8860b;">❤️</div>
            </div>
        </div>
    `;
    
    // Estilos básicos
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Abrir cartas
function abrirCartas() {
    window.location.href = 'cartas.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    createDots();
    startAutoPlay();
    
    // Efectos hover
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }, 150);
        });
    });
});