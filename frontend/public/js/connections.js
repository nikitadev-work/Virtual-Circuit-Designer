/* eslint-disable @typescript-eslint/no-unused-expressions */

/** @type {HTMLDivElement} */
const canvas = document.querySelector('.canvas-container');
/** @type {HTMLDivElement} */
const workspace = document.getElementById('workspace');
/** @type {SVGSVGElement} */
const svg = document.getElementById('connections');

function removeConnection(lineEl) {
    connections = connections.filter(c => {
        const match = c.line === lineEl;
        if (match) lineEl.remove();
        return !match;
    });
}

svg.addEventListener('dblclick', e => {
    if (e.target.tagName === 'line') removeConnection(e.target);
});

let selectedLine = null;

svg.addEventListener('click', e => {
    if (e.target.tagName !== 'line') return;

    selectedLine?.classList.remove('selected-line');
    selectedLine = e.target;
    selectedLine.classList.add('selected-line');
});

window.addEventListener('keydown', e => {
    if (e.key === 'Delete' && selectedLine) {
        removeConnection(selectedLine);
        selectedLine = null;
    }
});

const GRID = 25;
const snap = (v) => {
    const step = GRID;
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

let selection = new Set();

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

canvas.parentElement.addEventListener('wheel', e => {
    if (e.target.closest('.playground-left-bar, .playground-right-bar')) return;
    e.preventDefault();

    const {x: mouseX, y: mouseY} = clientToWorkspace(e.clientX, e.clientY);

    const prevScale = scale;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.min(Math.max(0.5, scale * delta), 3);

    posX -= (mouseX * scale - mouseX * prevScale);
    posY -= (mouseY * scale - mouseY * prevScale);

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
    updateTransform();
});

function centerCanvas() {
    const viewW = canvas.parentElement.clientWidth;
    const viewH = canvas.parentElement.clientHeight;
    const workW = workspace.offsetWidth * scale;
    const workH = workspace.offsetHeight * scale;
    posX = (viewW - workW) / 2;
    posY = (viewH - workH) / 2;
    updateTransform();
}


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

    const type = (e.dataTransfer.getData('type') || '').toUpperCase();
    const icon = e.dataTransfer.getData('icon');

    const el = document.createElement('div');
    el.className = 'workspace-element';
    el.dataset.type = type;
    el.dataset.angle = 0;
    el.dataset.scaleX = 1;
    el.dataset.scaleY = 1;

    const img = document.createElement('img');
    img.src = icon;

    const logicTypes = ['NOT', 'AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'];
    if (logicTypes.includes(type)) {
        img.style.transform = 'rotate(90deg)';
    }

    el.appendChild(img);
    addPorts(el);
    addPorts(el);

    const pt = clientToWorkspace(e.clientX, e.clientY);
    el.style.left = snap(pt.x) + 'px';
    el.style.top = snap(pt.y) + 'px';


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

// Сбор данных по координатам и инпутам

function collectInputs() {
    const inputs = [...document.querySelectorAll('.workspace-element')]
        .filter(el => (el.dataset.type || '').toUpperCase() === 'INPUT');

    return inputs.map(el => {
        const value = el.dataset.value;
        return value === '1' ? 1 : 0;
    });
}

function collectCoordinates() {
    const nodes = [...document.querySelectorAll('.workspace-element')];
    return nodes.map((el, i) => {
        const id = i;
        const x = parseFloat(el.style.left) || 0;
        const y = parseFloat(el.style.top) || 0;
        return [id, [x, y]];
    });
}


// Импорт

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
        circuit_description: gates,
        circuit_inputs: collectInputs(),
        circuit_coordinates: collectCoordinates()
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
            const data = await res.json();
            const id = data.id;

            if (typeof id === 'number') {
                window.savedCircuitId = id;
                console.log(`Схема сохранена с ID: ${id}`);
            } else {
                console.warn('Сервер не вернул числовой ID схемы');
            }
        }
        console.log('Saved successfully:', data);
        alert('Схема сохранена');
    } catch (err) {
        console.error('Не удалось сохранить схему:', err);
        alert("Произошла ошибка при сохранении схемы");
    }
}


// Экспорт
async function loadCircuit(id) {
    if (!id) {
        alert("Не передан ID схемы");
        return;
    }

    const headers = {};

    if (TOKEN) {
        headers['Authorization'] = `Bearer ${TOKEN}`;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
        }

        const data = await res.json();
        const { circuit_description, circuit_inputs, circuit_coordinates } = data;
        renderCircuit(circuit_description, circuit_inputs, circuit_coordinates);

    } catch (err) {
        console.error('Ошибка загрузки схемы:', err);
        alert('Не удалось загрузить схему');
    }
}

function renderCircuit(circuit, inputs = [], coordinates = []) {
    document.querySelectorAll('.workspace-element').forEach(e => e.remove());
    connections = [];

    const elements = [];

    circuit.forEach(([type, inputs = [], outputs = []], i) => {
        const el = document.createElement('div');
        el.className = 'workspace-element';
        el.dataset.type = getTypeName(type);
        el.dataset.angle = 0;
        el.dataset.scaleX = 1;
        el.dataset.scaleY = 1;

        const match = coordinates.find(([id]) => id === i);
        const coords = match?.[1];
        el.style.left = coords ? `${coords[0]}px` : `${100 + i * 100}px`;
        el.style.top = coords ? `${coords[1]}px` : `100px`;

        const img = document.createElement('img');
        const typeName = getTypeName(type).toUpperCase();

        let iconPath;
        if (typeName === 'INPUT' || typeName === 'OUTPUT') {
            const value = el.dataset.value ?? '0';
            iconPath = `/Icons/Inputs&Outputs/${typeName}-${value}.svg`;
        } else {
            iconPath = `/Icons/LogicBlocks/${typeName.toLowerCase()}.svg`;
        }
        img.src = iconPath;
        el.appendChild(img);

        addPorts(el);

        if (getTypeName(type) === 'INPUT') {
            const inputControl = document.createElement('input');
            inputControl.type = 'number';
            inputControl.min = '0';
            inputControl.max = '1';
            inputControl.value = inputs.shift() ?? 0;
            inputControl.className = 'input-control';
            inputControl.addEventListener('change', () => {
                el.dataset.value = inputControl.value;
            });
            el.dataset.value = inputControl.value;
            el.appendChild(inputControl);
        }
        enableElementDrag(el);
        workspace.appendChild(el);
        elements.push(el);
    });

    circuit.forEach(([_, inputs = []], targetIndex) => {
        inputs.forEach(sourceIndex => {
            const from = elements[sourceIndex].querySelector('.output-port');
            const to = elements[targetIndex].querySelector('.input-port');
            if (from && to) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('stroke', 'black');
                line.setAttribute('stroke-width', '3');
                line.setAttribute('stroke-linecap', 'round');
                svg.appendChild(line);

                connections.push({
                    from: {element: elements[sourceIndex], port: from},
                    to: {element: elements[targetIndex], port: to},
                    line
                });
            }
        });
    });

    updateConnections();
    centerCanvas();
}

function getTypeName(id) {
    return {
        0: 'INPUT',
        1: 'OUTPUT',
        2: 'NOT',
        3: 'AND',
        4: 'OR',
        5: 'XOR',
        6: 'NAND',
        7: 'NOR',
        8: 'XNOR'
    }[id] || 'INPUT';
}


document.getElementById('save-btn')
    .addEventListener('click', sendCircuit);
document.getElementById('export-btn')
    .addEventListener('click', async () => {
        const id = window.savedCircuitId;
        if (typeof id === 'number') {
            await loadCircuit(id);
        } else {
            alert("ID схемы не найден. Сначала сохраните схему.");
        }
    });


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
            p.style.left = '-3px';
            p.style.top = '49%';
            p.style.transform = 'translateY(-50%)';
        } else {
            p.style.left = '-17px';
            p.style.top = cfg.ins === 1 ? '50%' : (i === 0 ? '35%' : '64%');
            p.style.transform = 'translateY(-50%)';
        }

        el.appendChild(p);
    }

    for (let i = 0; i < cfg.outs; i++) {
        const p = document.createElement('div');
        p.className = 'port output-port';

        if (type === 'INPUT') {
            p.style.right = '-3px';
            p.style.top = '49%';
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

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        hideCtxMenu();
    }
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

    el.dataset.angle = angle;
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
    currentLine.setAttribute('stroke-width', '3');
    currentLine.setAttribute('stroke-linecap', 'round');
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

    if (isInput(startPort) && isInput(targetPort)) {
        currentLine.remove();
        currentLine = startElement = startPort = null;
        document.removeEventListener('mousemove', dragTempLine);
        document.removeEventListener('mouseup', finishLine);
        return;
    }

    if (isOutput(startPort) && isOutput(targetPort)) {
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
    const parent = canvas.parentElement;
    const viewW = parent.clientWidth;
    const viewH = parent.clientHeight;

    const workW = workspace.offsetWidth * scale;
    const workH = workspace.offsetHeight * scale;

    const minX = Math.min(0, viewW - workW);
    const minY = Math.min(0, viewH - workH);
    const maxX = 0;
    const maxY = 0;

    posX = Math.min(maxX, Math.max(minX, posX));
    posY = Math.min(maxY, Math.max(minY, posY));

    canvas.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}


let clipboard = null;

function copy(src = null) {
    let items;
    if (!src) {
        items = [...selection];
    } else if (Array.isArray(src)) {
        items = src;
    } else {
        items = [src];
    }
    if (!items.length) return;

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
    const band = document.createElement('div');
    band.id = 'selection-rect';

    let selecting = false;
    let startX, startY;
    let additive = false;
    let baseSelection = null;

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
                select(el);
            } else if (!additive || !baseSelection.has(el)) {
                deselect(el);
            }
        });
    }

    function stop() {
        selecting = false;
        band.remove();
        window.removeEventListener('mousemove', onMove);
    }
})();

document.getElementById('back-dashboard')
    .addEventListener('click', () => {
        window.location.href = '/dashboard';
    });

function tryCenterCanvas(attempts = 10) {
    if (attempts <= 0) return;
    if (!canvas || !workspace) return;
    if (workspace.offsetWidth > 0 && workspace.offsetHeight > 0) {
        centerCanvas();
    } else {
        setTimeout(() => tryCenterCanvas(attempts - 1), 100);
    }
}

tryCenterCanvas();