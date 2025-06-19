<<<<<<< HEAD
// ---------- 1. Ссылки на DOM -------------------------------------------------
const canvas    = document.querySelector('.canvas-container');
const workspace = document.getElementById('workspace');
const svg       = document.getElementById('connections');
=======
const canvas = document.querySelector('.canvas-container');
const workspace = document.getElementById('workspace');
const svg = document.getElementById('connections');

// ---------- 0. Контекстное меню ---------------------------------------------
const ctxMenu = document.createElement('div');
ctxMenu.className = 'context-menu hidden';
ctxMenu.innerHTML = `
  <button data-action="copy">Copy</button>
  <button data-action="cut">Cut</button>
  <button data-action="paste">Paste</button>
  <hr>
  <button data-action="r90">Turn 90°</button>
  <button data-action="r180">Turn 180°</button>
  <button data-action="flipH">Flip horiz.</button>
  <button data-action="flipV">Flip vert.</button>
`;
document.body.appendChild(ctxMenu);
let ctxTarget = null;

const selection = new Set();

function select(el) {
    if (!selection.has(el)) {
        selection.add(el);
        el.classList.add('selected');
    }
}

function deselect(el) {
    if (selection.delete(el)) {
        el.classList.remove('selected');
    }
}

function clearSelection() {
    selection.forEach(deselect);
}

workspace.addEventListener('click', e => {
    if (e.target.classList.contains('port')) return;

    const el = e.target.closest('.workspace-element');

    if (!el) {
        if (!e.ctrlKey && !e.metaKey) clearSelection();   // кликом снимаем всё
        return;
    }

    if (e.ctrlKey || e.metaKey) {
        selection.has(el) ? deselect(el) : select(el);   // toggle
        return;
    }

    if (selection.size !== 1 || !selection.has(el)) {
        clearSelection();
        select(el);
    }
});
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed


// ---------- 2. Панорамирование холста ---------------------------------------
let posX = 0;
let posY = 0;
let scale = 1
let isCanvasDrag = false, startX, startY;

canvas.parentElement.addEventListener('wheel', (e) => {
<<<<<<< HEAD
    // Проверяем, не над панелью ли происходит событие
=======
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    if (e.target.closest('.playground-left-bar, .playground-right-bar')) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= delta;
    scale = Math.min(Math.max(0.5, scale), 3);
    updateTransform();
});

canvas.parentElement.addEventListener('mousedown', e => {
<<<<<<< HEAD
    // игнор боковых панелей
=======
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    if (e.target.closest('.playground-left-bar, .playground-right-bar')) return;
    isCanvasDrag = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    canvas.style.cursor = 'grabbing';
});


window.addEventListener('mousemove', e => {
    if (!isCanvasDrag) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
<<<<<<< HEAD
    canvas.style.transform = `translate(${posX}px,${posY}px)`;
    updateConnections();                      // обновляем линии при панорамировании
=======
    canvas.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
});


window.addEventListener('mouseup', () => {
    isCanvasDrag = false;
    canvas.style.cursor = 'grab';
});


// ---------- 3. Drag-&-drop из левой панели ----------------------------------
document.querySelectorAll('.draggable-item').forEach(item => {
    item.addEventListener('dragstart', e => {
<<<<<<< HEAD
        e.dataTransfer.setData('type',   e.target.dataset.type);
        e.dataTransfer.setData('icon',   e.target.dataset.icon);
=======
        e.dataTransfer.setData('type', e.target.dataset.type);
        e.dataTransfer.setData('icon', e.target.dataset.icon);
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
        e.dataTransfer.setData('source', 'sidebar');
    });
});


<<<<<<< HEAD
workspace.addEventListener('dragover',  e => e.preventDefault());
workspace.addEventListener('drop',      handleDrop);
=======
workspace.addEventListener('dragover', e => e.preventDefault());
workspace.addEventListener('drop', handleDrop);
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed


function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.getData('source') !== 'sidebar') return;


    const type = e.dataTransfer.getData('type');
    const icon = e.dataTransfer.getData('icon');


<<<<<<< HEAD
    const el  = document.createElement('div');
=======
    const el = document.createElement('div');
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    el.className = 'workspace-element';


    const img = document.createElement('img');
    img.src = icon;
    img.style.transform = 'rotate(90deg)';
    el.appendChild(img);


    addPorts(el, type === 'NOT' ? 1 : 2);


    const rect = workspace.getBoundingClientRect();
    el.style.left = e.clientX - rect.left + 'px';
<<<<<<< HEAD
    el.style.top  = e.clientY - rect.top  + 'px';
=======
    el.style.top = e.clientY - rect.top + 'px';
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed


    enableElementDrag(el);
    workspace.appendChild(el);
}


// ---------- 4. Создание портов ----------------------------------------------
function addPorts(el, inputs) {
    const makeInput = pct => {
        const p = document.createElement('div');
        p.className = 'port input-port';
        p.style.top = pct;
<<<<<<< HEAD
        p.style.transform = 'translateY(-50%)'; // центрирование для точного расчёта
        el.appendChild(p);
    };
    inputs === 1 ? makeInput('50%') : (makeInput('25%'), makeInput('75%'));
=======
        p.style.transform = 'translateY(-50%)';
        el.appendChild(p);
    };
    inputs === 1 ? makeInput('50%') : (makeInput('33%'), makeInput('66%'));
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed


    const out = document.createElement('div');
    out.className = 'port output-port';
<<<<<<< HEAD
    // для output-порта transform уже задан в CSS (.output-port)
    el.appendChild(out);
}

=======

    el.appendChild(out);
}

// ---------- контекст-меню для workspace ------------------------------------
workspace.addEventListener('contextmenu', e => {
    e.preventDefault();

    ctxTarget = e.target.closest('.workspace-element');


    const needEl = ['r90', 'r180', 'flipH', 'flipV', 'copy', 'cut'];
    ctxMenu.querySelectorAll('button').forEach(btn => {
        btn.disabled = !ctxTarget && needEl.includes(btn.dataset.action);
    });

    showCtxMenu(e.clientX, e.clientY);
});


function showCtxMenu(x, y) {
    const {innerWidth: w, innerHeight: h} = window;
    const mW = 170, mH = 180;    // примерные размеры
    ctxMenu.style.left = Math.min(x, w - mW) + 'px';
    ctxMenu.style.top = Math.min(y, h - mH) + 'px';
    ctxMenu.classList.remove('hidden');
}

function hideCtxMenu() {
    ctxMenu.classList.add('hidden');
    ctxTarget = null;
}


document.addEventListener('click', e => {
    if (!e.target.closest('.context-menu')) hideCtxMenu();
});

ctxMenu.addEventListener('click', e => {
    if (!ctxTarget || e.target.tagName !== 'BUTTON') return;
    const act = e.target.dataset.action;
    applyTransform(ctxTarget, act);
    hideCtxMenu();
});

function applyTransform(el, action) {
    if (!el) return;


    const rot = +(el.dataset.angle ?? 0);
    const sx = +(el.dataset.scaleX ?? 1);
    const sy = +(el.dataset.scaleY ?? 1);

    let angle = rot, scaleX = sx, scaleY = sy;
    switch (action) {
        case 'r90':
            angle = (rot + 90) % 360;
            break;
        case 'r180':
            angle = (rot + 180) % 360;
            break;
        case 'flipH':
            scaleX = -scaleX;
            break;
        case 'flipV':
            scaleY = -scaleY;
            break;
    }

    el.dataset.angle = angle;
    el.dataset.scaleX = scaleX;
    el.dataset.scaleY = scaleY;
    el.style.transform = `rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
}


if (!ctxMenu.classList.contains('hidden')) {
    hideCtxMenu();
    // return;
}

>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed

// ---------- 5. Перемещение элементов внутри workspace -----------------------
function enableElementDrag(el) {
    let drag = false, offX, offY;
    const grid = 20;
    const snap = v => Math.round(v / grid) * grid;


    el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('port')) return;
        e.stopPropagation();
        drag = true;
        const rect = workspace.getBoundingClientRect();
        offX = e.clientX - rect.left - el.offsetLeft;
<<<<<<< HEAD
        offY = e.clientY - rect.top  - el.offsetTop;
        el.style.zIndex = 1000;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
=======
        offY = e.clientY - rect.top - el.offsetTop;
        el.style.zIndex = 1000;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    });


    function onMove(e) {
        if (!drag) return;
        const rect = workspace.getBoundingClientRect();
        let x = e.clientX - rect.left - offX;
<<<<<<< HEAD
        let y = e.clientY - rect.top  - offY;
        x = Math.max(0, Math.min(x, rect.width  - el.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - el.offsetHeight));
        el.style.left = snap(x) + 'px';
        el.style.top  = snap(y) + 'px';
=======
        let y = e.clientY - rect.top - offY;
        x = Math.max(0, Math.min(x, rect.width - el.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - el.offsetHeight));
        el.style.left = snap(x) + 'px';
        el.style.top = snap(y) + 'px';
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
        updateConnections();
    }


    function onUp() {
<<<<<<< HEAD
        if (!drag) return;                                // страховка от «залипания»
        drag = false;
        el.style.zIndex = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
=======
        if (!drag) return;
        drag = false;
        el.style.zIndex = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    }


    // dblclick — удалить элемент и его соединения
    el.addEventListener('dblclick', () => {
        connections = connections.filter(c => {
            if (c.from.element === el || c.to.element === el) {
                c.line.remove();
                return false;
            }
            return true;
        });
        el.remove();
    });
}


// ---------- 6. Соединения (SVG line) ----------------------------------------
let connections = [];
<<<<<<< HEAD
let currentLine = null,
    startElement = null,
    startPort    = null;


workspace.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('port')) return; // теперь любой порт
=======
let snapPort = null;
const SNAP_R = 20;
let currentLine = null,
    startElement = null,
    startPort = null;


workspace.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('port')) return;
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    e.stopPropagation();
    e.preventDefault();


    const rect = workspace.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    startElement = e.target.parentElement;
<<<<<<< HEAD
    startPort    = e.target;
=======
    startPort = e.target;
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed


    currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    currentLine.setAttribute('x1', x);
    currentLine.setAttribute('y1', y);
    currentLine.setAttribute('x2', x);
    currentLine.setAttribute('y2', y);
    currentLine.setAttribute('stroke', 'black');
    currentLine.setAttribute('stroke-width', '2');
    svg.appendChild(currentLine);


    document.addEventListener('mousemove', dragTempLine);
<<<<<<< HEAD
    document.addEventListener('mouseup',   finishLine);
});

=======
    document.addEventListener('mouseup', finishLine);
});

function findClosestPort(xClient, yClient, radius) {
    const wsRect = workspace.getBoundingClientRect();
    let best = null, bestD2 = radius * radius;

    document.querySelectorAll('.port').forEach(p => {
        if (p === startPort) return;
        const pr = p.getBoundingClientRect();
        const cx = pr.left - wsRect.left + pr.width / 2;
        const cy = pr.top - wsRect.top + pr.height / 2;
        const dx = cx - (xClient - wsRect.left);
        const dy = cy - (yClient - wsRect.top);
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD2) {
            best = p;
            bestD2 = d2;
        }
    });
    return best;
}

>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed

function dragTempLine(e) {
    if (!currentLine) return;
    const rect = workspace.getBoundingClientRect();
<<<<<<< HEAD
    currentLine.setAttribute('x2', e.clientX - rect.left);
    currentLine.setAttribute('y2', e.clientY - rect.top);
=======
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    const near = findClosestPort(e.clientX, e.clientY, SNAP_R);


    if (near !== snapPort) {
        snapPort?.classList.remove('highlight');
        near?.classList.add('highlight');
        snapPort = near;
    }

    if (snapPort) {
        const c = portCenter(snapPort);
        currentLine.setAttribute('x2', c.x);
        currentLine.setAttribute('y2', c.y);
    } else {
        currentLine.setAttribute('x2', x);
        currentLine.setAttribute('y2', y);
    }
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
}


function finishLine(e) {
<<<<<<< HEAD
    const isPort = e.target.classList.contains('port');
    const same   = e.target === startPort;
=======
    if (!currentLine) return;


    const targetPort = snapPort ??
        (e.target.classList.contains('port') ? e.target : null);


    snapPort?.classList.remove('highlight');
    snapPort = null;
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed


    if (!currentLine) return;


<<<<<<< HEAD
    if (e.target.classList.contains('port')) {           // любой порт
        const toElement = e.target.parentElement;
        const toPort    = e.target;


        connections.push({
            from: { element: startElement, port: startPort },
            to:   { element: toElement,   port: toPort   },
=======
    if (targetPort && targetPort !== startPort) {
        const toElement = targetPort.parentElement;

        connections.push({
            from: {element: startElement, port: startPort},
            to: {element: toElement, port: targetPort},
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
            line: currentLine
        });
        updateConnections();
    } else {
<<<<<<< HEAD
        const near = document.elementFromPoint(e.clientX, e.clientY)
            ?.closest('.port');
        if (near && near !== startPort) {
            connectTo(near);       // вынесено в функцию
        } else {
            currentLine.remove();
        }                              // не попали в порт
    }


    currentLine = startElement = startPort = null;
    document.removeEventListener('mousemove', dragTempLine);
    document.removeEventListener('mouseup',   finishLine);
=======
        currentLine.remove();
    }

    currentLine = startElement = startPort = null;
    document.removeEventListener('mousemove', dragTempLine);
    document.removeEventListener('mouseup', finishLine);
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
}


// ---------- 7. Обновление всех линий ----------------------------------------
function updateConnections() {
    connections.forEach(c => {
        const a = portCenter(c.from.port);
<<<<<<< HEAD
        const b = portCenter(c.to .port);
=======
        const b = portCenter(c.to.port);
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
        c.line.setAttribute('x1', a.x);
        c.line.setAttribute('y1', a.y);
        c.line.setAttribute('x2', b.x);
        c.line.setAttribute('y2', b.y);
    });
}


function portCenter(port) {
    const wsRect = workspace.getBoundingClientRect();
<<<<<<< HEAD
    const pr     = port.getBoundingClientRect();
    return {
        x: pr.left - wsRect.left + pr.width  / 2,
        y: pr.top  - wsRect.top  + pr.height / 2
=======
    const pr = port.getBoundingClientRect();
    return {
        x: pr.left - wsRect.left + pr.width / 2,
        y: pr.top - wsRect.top + pr.height / 2
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
    };
}

function updateTransform() {
<<<<<<< HEAD
    canvas.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}
=======
    canvas.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
}

// ---------- 8.  Буфер обмена -------------------------------------------------
let clipboard = null;

function copy(src = null) {
    const items = src ? [src] : [...selection];
    if (!items.length) return;
    clipboard = items.map(el => el.cloneNode(true));
}

function cut(src = null) {
    const items = src ? [src] : [...selection];
    if (!items.length) return;
    copy(src);
    items.forEach(deleteElement);
    clearSelection();
}

function paste(x, y) {
    if (!clipboard) return;

    clearSelection();

    const gap = 20;
    clipboard.forEach((tpl, i) => {
        const el = tpl.cloneNode(true);

        el.classList.remove('selected');
        selection.delete(el);

        el.style.left = x + gap * i + 'px';
        el.style.top = y + gap * i + 'px';
        enableElementDrag(el);
        workspace.appendChild(el);
    });
}


function deleteElement(el) {
    connections = connections.filter(c => {
        if (c.from.element === el || c.to.element === el) {
            c.line.remove();
            return false;
        }
        return true;
    });
    el.remove();
}

// ---------- 9.  Действия из контекст-меню -----------------------------------
ctxMenu.addEventListener('click', e => {
    if (!e.target.matches('button')) return;
    const act = e.target.dataset.action;


    const target = ctxTarget || null;

    if (act === 'copy') copy(target);
    else if (act === 'cut') cut(target);
    else if (act === 'paste') {


        const x = parseInt(ctxMenu.style.left) - workspace.getBoundingClientRect().left + 10;
        const y = parseInt(ctxMenu.style.top) - workspace.getBoundingClientRect().top + 10;
        paste(x, y);
    } else applyTransform(target, act);

    hideCtxMenu();
});

// ---------- координаты последнего курсора внутри workspace -----------------
const cursorPos = {x: 0, y: 0};
workspace.addEventListener('mousemove', e => {
    const rect = workspace.getBoundingClientRect();
    cursorPos.x = e.clientX - rect.left;
    cursorPos.y = e.clientY - rect.top;
});


// ---------- 10.  Горячие клавиши --------------------------------------------
window.addEventListener('keydown', e => {
    // нужна Ctrl или ⌘ и курсор НЕ в поле ввода
    if (!(e.ctrlKey || e.metaKey) || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    switch (e.code) {
        case 'KeyC':
            e.preventDefault();
            copy();
            break;

        case 'KeyX':
            e.preventDefault();
            cut();
            break;

        case 'KeyV':
            e.preventDefault();
            paste(cursorPos.x, cursorPos.y);
            break;
    }
});
>>>>>>> 450acec34d5e2d158e143a9c0e4a49ce324aa5ed
