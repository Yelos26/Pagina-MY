
// ============================================
// SISTEMA DE AUTENTICACIÓN - CON PHP
// ============================================

const STORAGE_KEY = "amor_autenticado";

// ============================================
// INICIAR SESIÓN - Envía contraseña al servidor PHP
// ============================================
async function iniciarSesion(password) {
    try {
        const response = await fetch('php/verificar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            sessionStorage.setItem(STORAGE_KEY, 'true');
            sessionStorage.setItem('token', data.token || '');
            console.log('✅ Autenticación exitosa');
            return true;
        } else {
            console.log('❌ Contraseña incorrecta');
            return false;
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        return false;
    }
}

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
async function estaAutenticado() {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
}

// ============================================
// PROTEGER PÁGINA
// ============================================
async function protegerPagina() {
    const autenticado = await estaAutenticado();
    
    if (!autenticado) {
        window.location.href = 'error.html';
        return false;
    }
    
    // Bloquear botón atrás
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
    
    return true;
}

// ============================================
// CERRAR SESIÓN
// ============================================
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
    
/*

// ============================================
// SISTEMA DE AUTENTICACIÓN - VERSIÓN LOCAL
// ============================================

const STORAGE_KEY = "amor_autenticado";
const CLAVE_SECRETA = "25062025";  // ← ÚNICO LUGAR CON LA CONTRASEÑA

// ============================================
// INICIAR SESIÓN
// ============================================
async function iniciarSesion(password) {
    console.log('🔐 Verificando contraseña...');
    
    if (password === CLAVE_SECRETA) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        console.log('✅ Autenticación exitosa');
        return true;
    } else {
        console.log('❌ Contraseña incorrecta');
        return false;
    }
}

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
async function estaAutenticado() {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
}

// ============================================
// PROTEGER PÁGINA
// ============================================
async function protegerPagina() {
    const autenticado = await estaAutenticado();
    
    if (!autenticado) {
        window.location.href = 'error.html';
        return false;
    }
    
    // Bloquear botón atrás
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
    
    return true;
}

// ============================================
// CERRAR SESIÓN
// ============================================
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}*/