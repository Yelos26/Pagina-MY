// ============================================
// SISTEMA DE MENSAJES VARIABLES - VERSIÓN SIMPLE
// ============================================

class SistemaMensajes {
    constructor() {
        // Mensajes románticos predefinidos
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
        console.log('🎯 Sistema de mensajes iniciado');
        
        // MOSTRAR MENSAJE INMEDIATAMENTE
        this.mostrarMensajeInicial();
        
        // Configurar botón de cambiar mensaje
        const toggleBtn = document.getElementById('messageToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.cambiarMensaje();
            });
            console.log('✅ Botón de mensajes configurado');
        } else {
            console.error('❌ No se encontró el botón messageToggleBtn');
        }
        
        // Cambiar mensaje cada 15 segundos
        setInterval(() => {
            this.cambiarMensaje();
        }, 15000);
    }
    
    mostrarMensajeInicial() {
        this.indiceActual = Math.floor(Math.random() * this.mensajes.length);
        const mensaje = this.mensajes[this.indiceActual];
        this.actualizarBurbuja(mensaje);
        console.log('💬 Mensaje inicial:', mensaje);
    }
    
    cambiarMensaje() {
        this.indiceActual = (this.indiceActual + 1) % this.mensajes.length;
        const mensaje = this.mensajes[this.indiceActual];
        this.actualizarBurbuja(mensaje);
        this.animarBurbuja();
        console.log('🔄 Mensaje cambiado:', mensaje);
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

// INICIALIZAR CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sistema de mensajes...');
    window.sistemaMensajes = new SistemaMensajes();
});