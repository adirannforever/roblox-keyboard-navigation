// --- 1. Utilidad para buscar en Shadow DOM de forma RECURSIVA ---
// Esto es crucial porque Roblox anida Shadow DOMs dentro de otros Shadow DOMs.
function deepQuerySelector(selector, root = document) {
    // Intentar en el root actual
    let element = root.querySelector(selector);
    if (element) return element;

    // Buscar en todos los shadow roots de este nivel
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node;
    while (node = walker.nextNode()) {
        if (node.shadowRoot) {
            // Llamada recursiva para buscar dentro del shadow root
            element = deepQuerySelector(selector, node.shadowRoot);
            if (element) return element;
        }
    }
    return null;
}

// --- 2. Lógica de navegación ---
function handleNavigation(key) {
    const isTabSwitch = key.includes('ctrl');

    if (isTabSwitch) {
        // --- Navegación entre pestañas (Ctrl + Flechas) ---
        // Selectores basados en el hash de la URL
        const tabSelectors = {
            'friends': 'a[href*="#!/friends"]',
            'followers': 'a[href*="#!/followers"]',
            'following': 'a[href*="#!/following"]'
        };

        const currentHash = window.location.hash;
        let currentTab = 'friends'; // Por defecto
        if (currentHash.includes('followers')) currentTab = 'followers';
        else if (currentHash.includes('following')) currentTab = 'following';

        const tabOrder = ['friends', 'followers', 'following'];
        let currentIndex = tabOrder.indexOf(currentTab);

        // Calcular el índice de la pestaña destino (con wrap-around)
        let nextIndex;
        if (key.includes('ArrowLeft')) {
            nextIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
        } else {
            nextIndex = (currentIndex + 1) % tabOrder.length;
        }

        const nextTabName = tabOrder[nextIndex];
        const tabElement = deepQuerySelector(tabSelectors[nextTabName]);
        
        if (tabElement) {
            console.log(`[Ext] Navegando a pestaña: ${nextTabName}`);
            tabElement.click();
        } else {
            console.warn(`[Ext] No se encontró la pestaña: ${nextTabName}. Revisa si el elemento es un <a> con href.`);
        }

    } else {
        // --- Navegación entre páginas (Flechas solas) ---
        // Selectores exactos según tu imagen: li.pager-prev button y li.pager-next button
        const prevButtonSelector = 'li.pager-prev button';
        const nextButtonSelector = 'li.pager-next button';

        const buttonSelector = key.includes('ArrowLeft') ? prevButtonSelector : nextButtonSelector;
        const button = deepQuerySelector(buttonSelector);

        if (button) {
            if (!button.disabled) {
                console.log(`[Ext] Haciendo clic en: ${key}`);
                button.click();
            } else {
                console.log(`[Ext] Botón deshabilitado (estás en el límite de la página).`);
            }
        } else {
            console.warn(`[Ext] No se encontró el botón con selector: ${buttonSelector}`);
        }
    }
}

// --- 3. Listener de teclado (Fase de Captura) ---
document.addEventListener('keydown', function(event) {
    // Usar composedPath para detectar si el usuario está escribiendo en un input,
    // incluso si ese input está dentro de un Shadow DOM.
    const path = event.composedPath();
    const isTyping = path.some(el => 
        el.tagName === 'INPUT' || 
        el.tagName === 'TEXTAREA' || 
        el.isContentEditable
    );
    
    if (isTyping) return; // Si está escribiendo, no interceptar

    const isLeft = event.key === 'ArrowLeft';
    const isRight = event.key === 'ArrowRight';
    const hasCtrl = event.ctrlKey || event.metaKey; // metaKey para Mac

    if (!isLeft && !isRight) return;

    // Prevenir el scroll por defecto y detener la propagación hacia Roblox
    event.preventDefault();
    event.stopPropagation();

    if (hasCtrl) {
        handleNavigation(isLeft ? 'ctrl+ArrowLeft' : 'ctrl+ArrowRight');
    } else {
        handleNavigation(isLeft ? 'ArrowLeft' : 'ArrowRight');
    }

}, true); // El `true` es VITAL: captura el evento antes de que Roblox lo procese.