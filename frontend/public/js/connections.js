/* eslint-disable @typescript-eslint/no-unused-expressions */

/** @type {HTMLDivElement} */
const canvas = document.querySelector('.canvas-container');
/** @type {HTMLDivElement} */
const workspace = document.getElementById('workspace');
/** @type {SVGSVGElement} */
const svg = document.getElementById('connections');

const GRID = 25;
const snap = (v) => {
    const step = GRID * scale;
    return Math.round(v / step) * step;
};

function screenToSvg(xClient, yClient) {
    const pt = svg.createSVGPoint();
    pt.x = xClient;
    pt.y = yClient;
    const ctm = svg.getScreenCTM();
    if (!ctm) throw new Error('Cannot get SVG CTM');
    return pt.matrixTransform(ctm.inverse());
}

const ctxMenu = document.createElement('div');
ctxMenu.className = 'context-menu hidden';
ctxMenu.innerHTML = `
  <button data-action="duplicate">Duplicate</button>
  <button data-action="cut">Cut</button>
  <button data-action="delete">Delete</button>
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
        if (!e.ctrlKey && !e.metaKey) clearSelection();
        return;
    }

    if (e.ctrlKey || e.metaKey) {
        selection.has(el) ? deselect(el) : select(el);
        return;
    }

    if (selection.size !== 1 || !selection.has(el)) {
        clearSelection();
        select(el);
    }
});

let posX = 0;
let posY = 0;
let scale = 1;

function clientToWorkspace(clientX, clientY) {
    const rect = workspace.getBoundingClientRect();
    return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale
    };
}

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
    canvas.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

window.addEventListener('mouseup', () => {
    isCanvasDrag = false;
    canvas.style.cursor = 'grab';
});

document.querySelectorAll('.draggable-item').forEach(item => {
    item.addEventListener('dragstart', e => {
        if (!e.dataTransfer) return;
        const src = e.currentTarget;
        e.dataTransfer.setData('type', src.dataset.type);
        e.dataTransfer.setData('icon', src.dataset.icon);
        e.dataTransfer.setData('source', 'sidebar');
        const img = new Image();
        img.src = src.querySelector('img').src;
        img.style.width = '10px';
        e.dataTransfer.setDragImage(img, 10, 10);
    });
});

workspace.addEventListener('dragover', e => e.preventDefault());
workspace.addEventListener('drop', handleDrop);

function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.getData('source') !== 'sidebar') return;

    const type = (e.dataTransfer.getData('type') || '')
    const icon = e.dataTransfer.getData('icon');
    const el = document.createElement('div');
    el.className = 'workspace-element';
    el.dataset.type = type;
    el.dataset.angle = 0;
    el.dataset.scaleX = 1;
    el.dataset.scaleY = 1;
    const img = document.createElement('img');
    img.src = icon;
    img.style.transform = 'rotate(90deg)';
    el.appendChild(img);

    addPorts(el);

    const rect = workspace.getBoundingClientRect();
    el.style.left = snap(e.clientX - rect.left) + 'px';
    el.style.top = snap(e.clientY - rect.top) + 'px';

    enableElementDrag(el);
    workspace.appendChild(el);
}

function exportSchemeAsList() {
    const nodes = [...document.querySelectorAll('.workspace-element')];
    const nodeIndex = new Map(nodes.map((el, i) => [el, i]));


    const typeMap = {
        INPUT: 0,
        OUTPUT: 1,
        NOT: 2,
        AND: 3,
        OR: 4,
        XOR: 5,
        NAND: 6,
        NOR: 7,
        XNOR: 8
    };

    connections = connections.filter(c => c.from.element.isConnected && c.to.element.isConnected);

    const gates = nodes.map(el => {
        const code = typeMap[(el.dataset.type || '').trim().toUpperCase()] ?? 0;
        return [code, new Set(), new Set()];
    });

    connections.forEach(({from, to}) => {
        const a = nodeIndex.get(from.element);
        const b = nodeIndex.get(to.element);
        if (a == null || b == null) return;
        gates[a][2].add(b);
        gates[b][1].add(a);
    });

    return gates.map(([t, ins, outs]) => [t, [...ins].sort(), [...outs].sort()]);
}

const TOKEN = localStorage.getItem('token');
const HOST = window.location.host;
const API_URL = `http://${HOST}:8052/api/circuits`;

async function sendCircuit() {

    const gates = exportSchemeAsList();

    if (!gates || gates.length === 0) {
        alert("Схема пуста, сохранять нечего");
        return;
    }

    const nameInput = document.getElementById('scheme-name');
    const circuitName =
        nameInput?.value.trim() ||
        prompt('Имя схемы', 'Scheme 1')?.trim();

    if (!circuitName) return;

    const payload = {
        circuit_name: circuitName,
        circuit_description: gates
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    if (TOKEN) {
        headers['Authorization'] = `Bearer ${TOKEN}`;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
        }

        let data = null;

        const contentLength =
            res.headers.get('content-length');

        const hasBody =
            contentLength &&
            contentLength !== '0' &&
            (res.status !== 204);

        const isJson =
            res.headers.get('content-type')?.includes('application/json');

        if (hasBody && isJson) {
            data = await res.json();
        }
        console.log('Saved successfully:', data);
        alert('Схема сохранена');
    } catch (err) {
        console.error('Не удалось сохранить схему:', err);
        alert("Произошла ошибка при сохранении схемы");
    }
}


document.getElementById('save-btn')
    .addEventListener('click', sendCircuit);

function addPorts(el) {
    const type = el.dataset.type?.toUpperCase();

    const cfg = {
        INPUT: {ins: 0, outs: 1},
        OUTPUT: {ins: 1, outs: 0},
        NOT: {ins: 1, outs: 1},
        AND: {ins: 2, outs: 1},
        OR: {ins: 2, outs: 1},
        XOR: {ins: 2, outs: 1},
        NAND: {ins: 2, outs: 1},
        NOR: {ins: 2, outs: 1},
        XNOR: {ins: 2, outs: 1},
    }[type] || {ins: 2, outs: 1};

    for (let i = 0; i < cfg.ins; i++) {
        const p = document.createElement('div');
        p.className = 'port input-port';

        if (type === 'OUTPUT') {
            p.style.left = '-12px';
            p.style.top = '50%';
            p.style.transform = 'translateY(-50%)';
        } else {
            p.style.left = '-20px';
            p.style.top = cfg.ins === 1 ? '50%' : (i === 0 ? '33%' : '66%');
            p.style.transform = 'translateY(-50%)';
        }

        el.appendChild(p);
    }

    for (let i = 0; i < cfg.outs; i++) {
        const p = document.createElement('div');
        p.className = 'port output-port';

        if (type === 'INPUT') {
            p.style.right = '-12px';
            p.style.top = '50%';
            p.style.transform = 'translateY(-50%)';
        } else {
            p.style.right = '-17px';
            p.style.top = '50%';
            p.style.transform = 'translateY(-50%)';
        }

        el.appendChild(p);
    }
}

workspace.addEventListener('contextmenu', e => {
    e.preventDefault();
    ctxTarget = e.target.closest('.workspace-element');

    const needEl = ['duplicate', 'cut', 'delete', 'r90', 'r180', 'flipH', 'flipV'];
    ctxMenu.querySelectorAll('button').forEach(btn => {
        btn.disabled = !ctxTarget && needEl.includes(btn.dataset.action);
    });

    showCtxMenu(e.clientX, e.clientY);
});

function showCtxMenu(x, y) {
    const {innerWidth: w, innerHeight: h} = window;
    const mW = 170, mH = 180;
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


function applyTransform(el, action) {
    if (!el) return;

    const num = (v, def) => Number.isFinite(v = parseFloat(v)) ? v : def;

    let angle = num(el.dataset.angle, 0);
    let scaleX = num(el.dataset.scaleX, 1);
    let scaleY = num(el.dataset.scaleY, 1);

    switch (action) {
        case 'r90':
            angle = (angle + 90) % 360;
            break;
        case 'r180':
            angle = (angle + 180) % 360;
            break;
        case 'fliph':
            scaleX = -scaleX;
            break;
        case 'flipv':
            scaleY = -scaleY;
            break;
    }

    el.dataset.angle = angle;   // ← только число
    el.dataset.scaleX = scaleX;
    el.dataset.scaleY = scaleY;

    el.style.transform = `rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
}


if (!ctxMenu.classList.contains('hidden')) {
    hideCtxMenu();
}

function enableElementDrag(el) {
    let drag = false, startMouseX, startMouseY;
    let dragItems = [];

    el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('port')) return;
        e.stopPropagation();
        drag = true;

        dragItems = selection.has(el) ? [...selection] : [el];

        dragItems.forEach(item => {
            item.__startLeft = parseFloat(item.style.left) || 0;
            item.__startTop = parseFloat(item.style.top) || 0;
        });

        ({x: startMouseX, y: startMouseY} = clientToWorkspace(e.clientX, e.clientY));

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });

    function onMove(e) {
        if (!drag) return;
        const {x: curX, y: curY} = clientToWorkspace(e.clientX, e.clientY);
        const dx = snap(curX - startMouseX);
        const dy = snap(curY - startMouseY);


        dragItems.forEach(item => {
            item.style.left = snap(item.__startLeft + dx) + 'px';
            item.style.top = snap(item.__startTop + dy) + 'px';
        });

        updateConnections();
    }

    function onUp() {
        if (!drag) return;
        drag = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }

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

    const start = screenToSvg(e.clientX, e.clientY);
    startElement = e.target.parentElement;
    startPort = e.target;

    currentLine = document.createElementNS(
        'http://www.w3.org/2000/svg', 'line'
    );
    currentLine.setAttribute('x1', start.x);
    currentLine.setAttribute('y1', start.y);
    currentLine.setAttribute('x2', start.x);
    currentLine.setAttribute('y2', start.y);
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
    const pos = screenToSvg(e.clientX, e.clientY);
    snapPort = findClosestPort(e.clientX, e.clientY, SNAP_R);
    document.querySelectorAll('.port.highlight').forEach(p => p.classList.remove('highlight'));
    if (snapPort) snapPort.classList.add('highlight');

    if (snapPort) {
        const c = portCenter(snapPort);
        currentLine.setAttribute('x2', c.x);
        currentLine.setAttribute('y2', c.y);
    } else {
        currentLine.setAttribute('x2', pos.x);
        currentLine.setAttribute('y2', pos.y);
    }
}

svg.style.overflow = 'visible';

function finishLine(e) {
    if (!currentLine) return;

    const targetPort = snapPort ??
        (e.target.classList.contains('port') ? e.target : null);

    snapPort?.classList.remove('highlight');
    snapPort = null;

    if (!currentLine) return;

    const isInput = p => p?.classList.contains('input-port');
    const isOutput = p => p?.classList.contains('output-port');

    // разрешаем ТОЛЬКО «output-порт → input-порт»
    if (!isOutput(startPort) || !isInput(targetPort)) {
        currentLine.remove();
        currentLine = startElement = startPort = null;
        document.removeEventListener('mousemove', dragTempLine);
        document.removeEventListener('mouseup', finishLine);
        return;
    }
    if (connections.some(c =>
        c.from.port === startPort && c.to.port === targetPort)) {
        currentLine.remove();
        currentLine = startElement = startPort = null;
        document.removeEventListener('mousemove', dragTempLine);
        document.removeEventListener('mouseup', finishLine);
        return;
    }

    const toElement = targetPort.parentElement;
    connections.push({
        from: {element: startElement, port: startPort},
        to: {element: toElement, port: targetPort},
        line: currentLine
    });
    updateConnections();

    currentLine = startElement = startPort = null;
    document.removeEventListener('mousemove', dragTempLine);
    document.removeEventListener('mouseup', finishLine);
}


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
    const pr = port.getBoundingClientRect();
    const screenX = pr.left + pr.width / 2;
    const screenY = pr.top + pr.height / 2;

    const ctmInv = svg.getScreenCTM().inverse();
    const pt = svg.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;

    const svgP = pt.matrixTransform(ctmInv);
    return {x: svgP.x, y: svgP.y};
}

function updateTransform() {
    canvas.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

let clipboard = null;

function copy(src = null) {
    let items;
    if (!src) {
        items = [...selection];          // если аргумента нет — копируем текущее выделение
    } else if (Array.isArray(src)) {
        items = src;                     // передан массив
    } else {
        items = [src];                   // передан единственный элемент
    }
    if (!items.length) return;         // ничего не выбрано — выходим

    const minX = Math.min(...items.map(el => parseFloat(el.style.left) || 0));
    const minY = Math.min(...items.map(el => parseFloat(el.style.top) || 0));

    clipboard = items.map(el => ({
        tpl: el.cloneNode(true),
        dx: (parseFloat(el.style.left) || 0) - minX,
        dy: (parseFloat(el.style.top) || 0) - minY,
    }));
}

function cut(src = null) {
    const items = src ? [src] : [...selection];
    if (!items.length) return;
    copy(src);
    deleteItems(items);
    clearSelection();
}

function paste(x, y) {
    if (!clipboard?.length) return;
    const baseX = snap(x);
    const baseY = snap(y);
    clearSelection();

    clipboard.forEach(({tpl, dx, dy}) => {
        const el = tpl.cloneNode(true);

        el.classList.remove('selected');
        enableElementDrag(el);

        el.style.left = (baseX + dx) + 'px';
        el.style.top = (baseY + dy) + 'px';

        workspace.appendChild(el);
        select(el);
    });

    updateConnections();
}

function deleteItems(list) {
    list.forEach(el => {
        connections = connections.filter(c => {
            if (c.from.element === el || c.to.element === el) {
                c.line.remove();
                return false;
            }
            return true;
        });
        el.remove();
        selection.delete(el);
    });
}


function duplicate(src = null) {
    const items = src ? [src] : [...selection];
    if (!items.length) return;

    const GAP = 30;
    clearSelection();

    items.forEach(el => {
        if (!(el instanceof Element)) return;

        const clone = el.cloneNode(true);
        clone.classList.remove('selected');

        const left = parseFloat(el.style.left) || 0;
        const top = parseFloat(el.style.top) || 0;

        clone.style.left = (left + GAP) + 'px';
        clone.style.top = (top + GAP) + 'px';

        enableElementDrag(clone);
        workspace.appendChild(clone);
        select(clone);
    });

    updateConnections();
}

ctxMenu.addEventListener('click', e => {
    if (!e.target.matches('button')) return;

    const act = (e.target.dataset.action || '').toLowerCase();

    const items = selection.size > 1 ? [...selection] : [ctxTarget];

    switch (act) {
        case 'r90':
        case 'r180':
        case 'fliph':
        case 'flipv':
            items.forEach(el => applyTransform(el, act));
            updateConnections();
            break;

        case 'delete':
            deleteItems(items);
            break;

        case 'cut':
            copy(items);
            deleteItems(items);
            break;

        case 'duplicate':
            duplicate(ctxTarget);
            break;

        case 'copy':
            copy(ctxTarget);
            break;

        case 'paste': {
            const {x, y} = clientToWorkspace(
                parseInt(ctxMenu.style.left) + 10,
                parseInt(ctxMenu.style.top) + 10
            );
            paste(x, y);
            break;
        }
    }

    hideCtxMenu();
});


const cursorPos = {x: 0, y: 0};
workspace.addEventListener('mousemove', e => {
    const {x, y} = clientToWorkspace(e.clientX, e.clientY);
    cursorPos.x = x;
    cursorPos.y = y;
});

window.addEventListener('keydown', e => {
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
        case 'KeyD':
            e.preventDefault();
            duplicate();
            break;
    }
});

document.getElementById('leftbar-toggle')
    .addEventListener('click', () => {
        document
            .querySelector('.playground-left-bar')
            .classList.toggle('is-collapsed');
    });

document.getElementById('rightbar-toggle')
    .addEventListener('click', () => {
        document
            .querySelector('.playground-right-bar')
            .classList.toggle('is-collapsed');
    });

(() => {
    /** прямоугольник-маска */
    const band = document.createElement('div');
    band.id = 'selection-rect';

    let selecting = false;      // идёт ли выделение
    let startX, startY;         // стартовая точка (в координатах workspace)
    let additive = false;       // Ctrl/Meta-click?
    let baseSelection = null;   // что было выделено до начала

    workspace.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (e.target !== workspace) return;
        if (!(e.ctrlKey)) return;
        e.stopPropagation();
        e.preventDefault();

        additive = e.ctrlKey || e.metaKey;
        baseSelection = new Set(selection);

        ({x: startX, y: startY} = clientToWorkspace(e.clientX, e.clientY));

        Object.assign(band.style, {left: startX + 'px', top: startY + 'px', width: 0, height: 0});
        workspace.appendChild(band);
        selecting = true;

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', stop, {once: true});
    });

    function onMove(e) {
        if (!selecting) return;
        const {x: curX, y: curY} = clientToWorkspace(e.clientX, e.clientY);

        const x = Math.min(curX, startX);
        const y = Math.min(curY, startY);
        const w = Math.abs(curX - startX);
        const h = Math.abs(curY - startY);

        Object.assign(band.style, {left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px'});

        // --- проверяем пересечение с каждым .workspace-element ---
        document.querySelectorAll('.workspace-element').forEach(el => {
            const ex = parseFloat(el.style.left) || 0;
            const ey = parseFloat(el.style.top) || 0;
            const ew = el.offsetWidth;
            const eh = el.offsetHeight;

            const hit = !(ex + ew < x || ex > x + w || ey + eh < y || ey > y + h);

            if (hit) {
                select(el);                           // добавить в выбор
            } else if (!additive || !baseSelection.has(el)) {
                deselect(el);                         // убрать, если не «плюсуем» Ctrl-ом
            }
        });
    }

    function stop() {
        selecting = false;
        band.remove();
        window.removeEventListener('mousemove', onMove);
    }
})();