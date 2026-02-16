// ============================================
// SISTEMA DE MENSAJES AUTOMÁTICOS - SIN BOTÓN
// ============================================

class SistemaMensajes {
    constructor() {
        this.mensajes = [
            "¡Hola mi amor! ❤️",
            "¿Cómo estás hoy? 💕",
            "Te quiero muchísimo 💖",
            "Eres lo mejor que me ha pasado ✨",
            "Pienso en ti todo el día 💭",
            "Eres hermosa 🌹",
            "Te amo ❤️",
            "Gracias por existir 💗",
            "Me haces muy feliz 😊",
            "Eres única 🌟",
            "Sonríe, te ves hermosa 😍",
            "Nunca me cansaré de decirlo: TE AMO 💝",
            "Eres mi princesa 👑",
            "Mi persona favorita 💫",
            "Hoy también pienso en ti 🌙"
        ];
        
        this.indiceActual = 0;
        this.init();
    }
    
    init() {
        this.mostrarMensajeInicial();
        
        // ✅ ELIMINADO: toggleBtn - AHORA SOLO CAMBIA AUTOMÁTICAMENTE
        
        // Cambiar mensaje cada 20 segundos
        setInterval(() => {
            this.cambiarMensaje();
        }, 20000);
    }
    
    mostrarMensajeInicial() {
        this.indiceActual = Math.floor(Math.random() * this.mensajes.length);
        const mensaje = this.mensajes[this.indiceActual];
        this.actualizarBurbuja(mensaje);
    }
    
    cambiarMensaje() {
        this.indiceActual = (this.indiceActual + 1) % this.mensajes.length;
        const mensaje = this.mensajes[this.indiceActual];
        this.actualizarBurbuja(mensaje);
        this.animarBurbuja();
    }
    
    actualizarBurbuja(mensaje) {
        const bubbleContent = document.getElementById('bubbleContent');
        const bubbleTime = document.getElementById('bubbleTime');
        
        if (bubbleContent) {
            bubbleContent.textContent = mensaje;
        }
        
        if (bubbleTime) {
            const ahora = new Date();
            bubbleTime.textContent = `hace ${this.formatearHora(ahora)}`;
        }
    }
    
    formatearHora(fecha) {
        const minutos = fecha.getMinutes();
        if (minutos < 1) return 'un momento';
        if (minutos === 1) return '1 minuto';
        if (minutos < 60) return `${minutos} minutos`;
        return `${fecha.getHours()}:${minutos.toString().padStart(2, '0')}`;
    }
    
    animarBurbuja() {
        const bubble = document.querySelector('.dialog-bubble');
        if (bubble) {
            bubble.style.transform = 'scale(0.98)';
            bubble.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                bubble.style.transform = 'scale(1)';
            }, 150);
        }
    }
}

// Iniciar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaMensajes = new SistemaMensajes();
});