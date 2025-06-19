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


// ---------- 2. Панорамирование холста ---------------------------------------
let posX = 0;
let posY = 0;
let scale = 1
let isCanvasDrag = false, startX, startY;

canvas.parentElement.addEventListener('wheel', (e) => {

    if (e.target.closest('.playground-left-bar, .playground-right-bar')) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= delta;
    scale = Math.min(Math.max(0.5, scale), 3);
    updateTransform();
});

canvas.parentElement.addEventListener('mousedown', e => {

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

    canvas.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
});


window.addEventListener('mouseup', () => {
    isCanvasDrag = false;
    canvas.style.cursor = 'grab';
});


// ---------- 3. Drag-&-drop из левой панели ----------------------------------
document.querySelectorAll('.draggable-item').forEach(item => {
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', e.target.dataset.type);
        e.dataTransfer.setData('icon', e.target.dataset.icon);
        e.dataTransfer.setData('source', 'sidebar');
    });
});


workspace.addEventListener('dragover', e => e.preventDefault());
workspace.addEventListener('drop', handleDrop);


function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.getData('source') !== 'sidebar') return;


    const type = e.dataTransfer.getData('type');
    const icon = e.dataTransfer.getData('icon');


    const el = document.createElement('div');
    el.className = 'workspace-element';


    const img = document.createElement('img');
    img.src = icon;
    img.style.transform = 'rotate(90deg)';
    el.appendChild(img);


    addPorts(el, type === 'NOT' ? 1 : 2);


    const rect = workspace.getBoundingClientRect();
    el.style.left = e.clientX - rect.left + 'px';
    el.style.top = e.clientY - rect.top + 'px';


    enableElementDrag(el);
    workspace.appendChild(el);
}


// ---------- 4. Создание портов ----------------------------------------------
function addPorts(el, inputs) {
    const makeInput = pct => {
        const p = document.createElement('div');
        p.className = 'port input-port';
        p.style.top = pct;
        p.style.transform = 'translateY(-50%)';
        el.appendChild(p);
    };
    inputs === 1 ? makeInput('50%') : (makeInput('33%'), makeInput('66%'));

    const out = document.createElement('div');
    out.className = 'port output-port';
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
        offY = e.clientY - rect.top - el.offsetTop;
        el.style.zIndex = 1000;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });


    function onMove(e) {
        if (!drag) return;
        const rect = workspace.getBoundingClientRect();
        let x = e.clientX - rect.left - offX;
        let y = e.clientY - rect.top - offY;
        x = Math.max(0, Math.min(x, rect.width - el.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - el.offsetHeight));
        el.style.left = snap(x) + 'px';
        el.style.top = snap(y) + 'px';
        updateConnections();
    }


    function onUp() {
        if (!drag) return;
        drag = false;
        el.style.zIndex = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
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
let snapPort = null;
const SNAP_R = 20;
let currentLine = null,
    startElement = null,
    startPort = null;


workspace.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('port')) return;
    e.stopPropagation();
    e.preventDefault();


    const rect = workspace.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    startElement = e.target.parentElement;
    startPort = e.target;


    currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    currentLine.setAttribute('x1', x);
    currentLine.setAttribute('y1', y);
    currentLine.setAttribute('x2', x);
    currentLine.setAttribute('y2', y);
    currentLine.setAttribute('stroke', 'black');
    currentLine.setAttribute('stroke-width', '2');
    svg.appendChild(currentLine);


    document.addEventListener('mousemove', dragTempLine);
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

function dragTempLine(e) {
    if (!currentLine) return;
    const rect = workspace.getBoundingClientRect();
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
}


function finishLine(e) {
    if (!currentLine) return;


    const targetPort = snapPort ??
        (e.target.classList.contains('port') ? e.target : null);


    snapPort?.classList.remove('highlight');
    snapPort = null;

    if (!currentLine) return;


    if (targetPort && targetPort !== startPort) {
        const toElement = targetPort.parentElement;

        connections.push({
            from: {element: startElement, port: startPort},
            to: {element: toElement, port: targetPort},
            line: currentLine
        });
        updateConnections();
    } else {
        currentLine.remove();
    }

    currentLine = startElement = startPort = null;
    document.removeEventListener('mousemove', dragTempLine);
    document.removeEventListener('mouseup', finishLine);
}


// ---------- 7. Обновление всех линий ----------------------------------------
function updateConnections() {
    connections.forEach(c => {
        const a = portCenter(c.from.port);
        const b = portCenter(c.to.port);
        c.line.setAttribute('x1', a.x);
        c.line.setAttribute('y1', a.y);
        c.line.setAttribute('x2', b.x);
        c.line.setAttribute('y2', b.y);
    });
}


function portCenter(port) {
    const wsRect = workspace.getBoundingClientRect();
    const pr = port.getBoundingClientRect();
    return {
        x: pr.left - wsRect.left + pr.width / 2,
        y: pr.top - wsRect.top + pr.height / 2
    };
}

function updateTransform() {
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

document.getElementById('leftbar-toggle')
    .addEventListener('click', () => {
        document
            .querySelector('.playground-left-bar')
            .classList.toggle('is-collapsed');
    });
