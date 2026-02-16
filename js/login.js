// ============================================
//                  LOGIN
// ============================================

// Verificar que auth.js esté cargado
if (typeof iniciarSesion === 'undefined') {
    console.error('❌ ERROR: auth.js no está cargado');
}

// ============================================
// PREVENIR SCROLL AUTOMÁTICO EN MÓVIL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    
    if (passwordInput) {
        // Eliminar readonly al hacer clic
        passwordInput.addEventListener('click', function() {
            this.removeAttribute('readonly');
        });
        
        // Eliminar readonly al tocar en móvil
        passwordInput.addEventListener('touchstart', function() {
            this.removeAttribute('readonly');
        });
        
        // Prevenir scroll automático
        passwordInput.addEventListener('focus', function(e) {
            // Guardar posición actual
            const scrollY = window.scrollY;
            
            // Permitir foco pero prevenir scroll
            setTimeout(() => {
                window.scrollTo(0, scrollY);
            }, 0);
        });
        
        // Solo permitir números
        passwordInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Mantener posición del scroll
            const scrollY = window.scrollY;
            setTimeout(() => {
                window.scrollTo(0, scrollY);
            }, 0);
        });
        
        // Restaurar readonly cuando pierde foco (opcional)
        passwordInput.addEventListener('blur', function() {
            if (!this.value) {
                this.setAttribute('readonly', true);
            }
        });
    }
    
    // ============================================
    // DETECCIÓN DE CONEXIÓN
    // ============================================
    if (!navigator.onLine) {
        const errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.textContent = 'Estás offline. Pero puedes seguir intentando';
            errorMsg.classList.add('show');
        }
    }
});

// ============================================
// FUNCIÓN PRINCIPAL DE LOGIN
// ============================================
async function checkPassword() {
    const input = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('errorMsg');
    const button = document.querySelector('button');
    
    // Quitar readonly temporalmente
    input.removeAttribute('readonly');
    
    // Validar que no esté vacío
    if (!input.value.trim()) {
        errorMsg.textContent = '❌ Esa no es ';
        errorMsg.classList.add('show');
        input.focus();
        return;
    }
    
    // Validar que solo sean números
    if (!/^\d+$/.test(input.value)) {
        errorMsg.textContent = '❌ Solo números permitidos (DDMMAAAA) ❤️';
        errorMsg.classList.add('show');
        input.value = '';
        input.focus();
        
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 3000);
        return;
    }
    
    // Efecto visual mínimo
    button.style.opacity = '0.9';
    setTimeout(() => {
        button.style.opacity = '1';
    }, 100);
    
    // Guardar scroll actual
    const scrollY = window.scrollY;
    
    // Verificar contraseña
    const exito = await iniciarSesion(input.value);
    
    // Restaurar scroll
    window.scrollTo(0, scrollY);
    
    if (exito) {
        // Correcto
        button.innerHTML = '<i class="fas fa-heart"></i> ¡Correcto! Entrando...';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 800);
    } else {
        // Incorrecto
        button.innerHTML = '<i class="fas fa-heart"></i> Descubrir Sorpresa';
        button.style.background = 'linear-gradient(135deg, #ffb6c1 0%, #db7093 100%)';
        
        errorMsg.textContent = '❌ Clave incorrecta, mi amor. Intenta de nuevo ❤️';
        errorMsg.classList.add('show');
        input.style.borderColor = '#e74c3c';
        
        setTimeout(() => {
            errorMsg.classList.remove('show');
            input.style.borderColor = '#e8e4e9';
            input.value = '';
            input.focus();
        }, 3000);
    }
}

// Enter para enviar
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevenir comportamiento por defecto
        checkPassword();
    }
});

// Limpiar error al escribir
document.getElementById('passwordInput').addEventListener('input', function() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg.classList.contains('show')) {
        errorMsg.classList.remove('show');
        this.style.borderColor = '#e8e4e9';
    }
});

// Eventos de conexión
window.addEventListener('offline', function() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.textContent = '⚠️ Perdiste la conexión ⚠️';
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