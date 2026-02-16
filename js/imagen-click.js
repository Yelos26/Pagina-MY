// ============================================
// CONTROL DE IMAGEN Y NUBE - CORREGIDO PARA MÓVIL
// ============================================

class ControlImagenNube {
    constructor() {
        this.dialogSection = document.querySelector('.dialog-section');
        this.imageWrapper = document.querySelector('.image-wrapper');
        this.bubble = document.querySelector('.dialog-bubble');
        
        if (!this.dialogSection || !this.imageWrapper) return;
        
        // Estado
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.startLeft = 0;
        this.startBottom = 0;
        
        // Detectar si es móvil
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Nube cerrada al inicio
        this.bubbleVisible = false;
        this.dialogSection.classList.add('bubble-hidden');
        if (this.bubble) this.bubble.style.display = 'none';
        
        this.currentSide = 'left';
        this.margin = 20;
        
        this.init();
        this.loadPosition();
    }
    
    init() {
        // ============================================
        // EVENTOS PARA ARRASTRAR (mejorados para móvil)
        // ============================================
        
        // Mouse events (PC)
        this.imageWrapper.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Touch events (Móvil) - con opciones mejoradas
        this.imageWrapper.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.stopDrag(e));
        document.addEventListener('touchcancel', (e) => this.stopDrag(e));
        
        // ============================================
        // CLICK PARA MOSTRAR/OCULTAR (CORREGIDO PARA MÓVIL)
        // ============================================
        
        // Evento click normal
        this.imageWrapper.addEventListener('click', (e) => {
            if (!this.isDragging) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleBubble();
            }
        });
        
        // Evento touch específico para móvil
        this.imageWrapper.addEventListener('touchend', (e) => {
            if (!this.isDragging) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleBubble();
            }
        });
        
        // Prevenir gestos del navegador en móvil
        this.imageWrapper.addEventListener('touchstart', (e) => {
            // No prevenir aquí para permitir scroll de la página
        }, { passive: true });
        
        console.log('✅ Control de imagen mejorado para móvil');
    }
    
    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        
        // Obtener coordenadas (mouse o touch)
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        
        if (!clientX && clientX !== 0) return;
        
        const rect = this.imageWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        this.startX = clientX;
        this.startY = clientY;
        this.startLeft = rect.left;
        this.startBottom = windowHeight - rect.bottom;
        
        this.imageWrapper.style.transition = 'none';
        this.imageWrapper.style.cursor = 'grabbing';
        this.imageWrapper.style.webkitUserSelect = 'none'; // Prevenir selección en iOS
    }
    
    onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        // Obtener coordenadas (mouse o touch)
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        
        if (!clientX && clientX !== 0) return;
        
        const deltaX = clientX - this.startX;
        const deltaY = this.startY - clientY;
        
        let newLeft = this.startLeft + deltaX;
        let newBottom = this.startBottom + deltaY;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = this.imageWrapper.offsetWidth;
        const elementHeight = this.imageWrapper.offsetHeight;
        
        // Límites para móvil más permisivos
        const mobileMargin = this.isMobile ? 10 : 20;
        
        newLeft = Math.max(mobileMargin, Math.min(newLeft, windowWidth - elementWidth - mobileMargin));
        newBottom = Math.max(mobileMargin, Math.min(newBottom, windowHeight - elementHeight - mobileMargin));
        
        this.imageWrapper.style.left = newLeft + 'px';
        this.imageWrapper.style.bottom = newBottom + 'px';
        
        // Actualizar posición de la nube si está visible
        if (this.bubbleVisible) {
            this.positionBubble();
        }
    }
    
    stopDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        this.imageWrapper.style.transition = '';
        this.imageWrapper.style.cursor = '';
        this.imageWrapper.style.webkitUserSelect = '';
        
        this.snapToNearestEdge();
        this.savePosition();
    }
    
    snapToNearestEdge() {
        const rect = this.imageWrapper.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const leftDistance = rect.left;
        const rightDistance = windowWidth - rect.right;
        const bottomDistance = windowHeight - rect.bottom;
        
        // Decidir lado (para la nube)
        this.currentSide = leftDistance < rightDistance ? 'left' : 'right';
        
        // Margen responsive
        const margin = this.isMobile ? 10 : 20;
        
        // Pegar imagen a la pared más cercana
        let newLeft = leftDistance < rightDistance ? margin : windowWidth - rect.width - margin;
        let newBottom = Math.max(margin, Math.min(windowHeight - rect.height - margin, windowHeight - rect.bottom));
        
        this.imageWrapper.style.left = newLeft + 'px';
        this.imageWrapper.style.bottom = newBottom + 'px';
        
        // Reposicionar nube si está visible
        if (this.bubbleVisible) {
            this.positionBubble();
        }
    }
    
    positionBubble() {
        if (!this.bubble || !this.bubbleVisible) return;
        
        const imgRect = this.imageWrapper.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Mostrar la nube
        this.bubble.style.display = 'block';
        
        // Calcular posición
        this.bubble.style.position = 'fixed';
        
        // Margen responsive
        const margin = this.isMobile ? 8 : 12;
        
        if (this.currentSide === 'left') {
            // Nube a la derecha de la imagen
            this.bubble.style.left = (imgRect.right + margin) + 'px';
            this.bubble.style.right = 'auto';
            
            // Centrar verticalmente con la imagen
            const bubbleHeight = this.bubble.offsetHeight;
            const imgHeight = imgRect.height;
            this.bubble.style.bottom = (windowHeight - imgRect.bottom + (imgHeight/2 - bubbleHeight/2)) + 'px';
            
            // Flecha
            const arrow = this.bubble.querySelector('.bubble-arrow');
            if (arrow) {
                arrow.style.left = '-12px';
                arrow.style.right = 'auto';
                arrow.style.transform = 'none';
            }
        } else {
            // Nube a la izquierda de la imagen
            this.bubble.style.left = 'auto';
            this.bubble.style.right = (windowWidth - imgRect.left + margin) + 'px';
            
            // Centrar verticalmente
            const bubbleHeight = this.bubble.offsetHeight;
            const imgHeight = imgRect.height;
            this.bubble.style.bottom = (windowHeight - imgRect.bottom + (imgHeight/2 - bubbleHeight/2)) + 'px';
            
            // Flecha
            const arrow = this.bubble.querySelector('.bubble-arrow');
            if (arrow) {
                arrow.style.left = 'auto';
                arrow.style.right = '-12px';
                arrow.style.transform = 'rotate(90deg)';
            }
        }
        
        // Asegurar que no se salga de la pantalla
        this.ensureBubbleInScreen();
    }
    
    ensureBubbleInScreen() {
        if (!this.bubble) return;
        
        const bubbleRect = this.bubble.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const margin = 10;
        
        // Ajustar horizontalmente
        if (bubbleRect.left < margin) {
            this.bubble.style.left = margin + 'px';
        }
        if (bubbleRect.right > windowWidth - margin) {
            if (this.currentSide === 'left') {
                this.bubble.style.left = (windowWidth - bubbleRect.width - margin) + 'px';
            } else {
                this.bubble.style.right = margin + 'px';
            }
        }
        
        // Ajustar verticalmente
        if (bubbleRect.top < margin) {
            this.bubble.style.bottom = (windowHeight - bubbleRect.bottom + margin) + 'px';
        }
        if (bubbleRect.bottom > windowHeight - margin) {
            this.bubble.style.bottom = margin + 'px';
        }
    }
    
    toggleBubble() {
        if (!this.bubble) return;
        
        console.log('Toggle bubble:', this.bubbleVisible ? 'ocultar' : 'mostrar');
        
        if (this.bubbleVisible) {
            // Ocultar nube
            this.bubble.style.opacity = '0';
            this.bubble.style.transform = 'scale(0.8)';
            setTimeout(() => {
                this.bubble.style.display = 'none';
                this.bubble.style.opacity = '';
                this.bubble.style.transform = '';
                this.dialogSection.classList.add('bubble-hidden');
            }, 180);
            this.bubbleVisible = false;
        } else {
            // Mostrar nube
            this.dialogSection.classList.remove('bubble-hidden');
            this.bubble.style.display = 'block';
            this.bubble.style.opacity = '0';
            this.bubble.style.transform = 'scale(0.8)';
            
            // Posicionar primero
            this.positionBubble();
            
            // Luego animar
            setTimeout(() => {
                this.bubble.style.opacity = '1';
                this.bubble.style.transform = 'scale(1)';
                this.bubble.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 10);
            
            this.bubbleVisible = true;
        }
        
        // Guardar estado
        setTimeout(() => this.savePosition(), 300);
    }
    
    savePosition() {
        const rect = this.imageWrapper.getBoundingClientRect();
        const position = {
            left: rect.left,
            bottom: window.innerHeight - rect.bottom,
            side: this.currentSide
        };
        localStorage.setItem('imagenPosicion', JSON.stringify(position));
    }
    
    loadPosition() {
        const saved = localStorage.getItem('imagenPosicion');
        if (saved) {
            try {
                const pos = JSON.parse(saved);
                this.imageWrapper.style.left = pos.left + 'px';
                this.imageWrapper.style.bottom = pos.bottom + 'px';
                this.currentSide = pos.side || 'left';
            } catch (e) {
                console.log('Error cargando posición');
            }
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.controlImagen = new ControlImagenNube();
});