// ============================================
// LOGIN - VERSIÓN SIMPLIFICADA SIN ERROR.JS
// ============================================

const PASSWORD = "25062025"; // Tu fecha especial

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('errorMsg');
    const button = document.querySelector('button');
    
    // Validación básica
    if (!input.value.trim()) {
        errorMsg.textContent = '❌ Por favor, ingresa nuestra fecha especial ❤️';
        errorMsg.classList.add('show');
        input.focus();
        return;
    }
    
    // Efecto de clic en el botón
    button.style.transform = 'scale(0.98)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    if (input.value === PASSWORD) {
        // ✅ Éxito
        button.innerHTML = '<i class="fas fa-heart"></i> ¡Correcto! Entrando...';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        
        // Animación de salida
        document.querySelector('.container').style.animation = 'fadeOut 0.8s ease forwards';
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 800);
    } else {
        // ❌ Error de contraseña
        errorMsg.textContent = '❌ Clave incorrecta, mi amor. Intenta de nuevo ❤️';
        errorMsg.classList.add('show');
        input.style.borderColor = '#e74c3c';
        input.style.boxShadow = '0 0 0 4px rgba(231, 76, 60, 0.15)';
        input.style.animation = 'shake 0.5s ease';
        
        // Contador de intentos fallidos
        if (window.failedAttempts) {
            window.failedAttempts++;
        } else {
            window.failedAttempts = 1;
        }
        
        // Mensaje especial después de 3 intentos
        if (window.failedAttempts >= 3) {
            setTimeout(() => {
                errorMsg.textContent = '💕 ¿Necesitas un recordatorio? Es nuestra fecha especial: 25/06/2025 💕';
                errorMsg.classList.add('show');
            }, 3100);
        }
        
        // Restaurar estilos
        setTimeout(() => {
            input.style.animation = '';
            input.value = '';
            input.focus();
        }, 500);
        
        setTimeout(() => {
            errorMsg.classList.remove('show');
            input.style.borderColor = '#e8e4e9';
            input.style.boxShadow = 'none';
        }, 3000);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Enter para enviar
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Limpiar error al escribir
document.getElementById('passwordInput').addEventListener('input', function() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg.classList.contains('show')) {
        errorMsg.classList.remove('show');
        this.style.borderColor = '#e8e4e9';
        this.style.boxShadow = 'none';
    }
});

// ============================================
// ANIMACIONES
// ============================================

// Añadir animación fadeOut al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ============================================
// DETECCIÓN DE CONEXIÓN
// ============================================

// Verificar conexión al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página de login cargada correctamente');
    
    if (!navigator.onLine) {
        const errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.textContent = '📡 Estás offline. Conéctate para ver la sorpresa ❤️';
            errorMsg.classList.add('show');
        }
    }
});

// Detectar cambios en la conexión
window.addEventListener('offline', function() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.textContent = '⚠️ Perdiste la conexión. Verifica tu internet ❤️';
        errorMsg.classList.add('show');
    }
});

window.addEventListener('online', function() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.textContent = '✅ ¡Conexión restaurada! Ahora puedes continuar ❤️';
        errorMsg.classList.add('show');
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 3000);
    }
});