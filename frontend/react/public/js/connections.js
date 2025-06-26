const canvas = document.querySelector('.canvas-container');
const workspace = document.getElementById('workspace');
const svg = document.getElementById('connections');

function screenToSvg(xClient, yClient) {
    const pt = svg.createSVGPoint();
    pt.x = xClient;
    pt.y = yClient;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

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

document.querySelectorAll('.draggable-item').forEach(item => {
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', e.target.dataset.type);
        e.dataTransfer.setData('icon', e.target.dataset.icon);
        e.dataTransfer.setData('source', 'sidebar');

        const img = new Image();
        img.src = e.target.querySelector('img').src;
        img.style.width = '10px';
        e.dataTransfer.setDragImage(img, 10, 10);
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
    el.dataset.type = type;


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
    const nodes = Array.from(document.querySeelctorAll('.workspace-element'));
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

    const gates = nodes.map(el => {
        const t = el.dataset.type;
        const code = typeMap[t] != null ? typeMap[t] : 0;
        return [code, /* inputs */ [], /* outputs */ []];
    });

    connections.forEach(conn => {
        const fromEl = conn.from.element;
        const toEl = conn.to.element;
        const iFrom = nodeIndex.get(fromEl);
        const iTo = nodeIndex.get(toEl);

        if (iFrom == null || iTo == null) return;
        gates[iFrom][2].push(iTo);
        gates[iTo][1].push(iFrom);
    });
    return gates;
}

document.getElementById('export-btn').addEventListener('click', () => {
    const payload = exportSchemeAsList();
    fetch('/api/upload-scheme', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then(data => console.log('Сервер ответил', data))
        .catch(err => console.error('Ошибка при отправке схемы', err));
})

function addPorts(el) {
    const type = el.dataset.type;

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
}


function enableElementDrag(el) {
    let drag = false, offX, offY;

    el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('port')) return;
        e.stopPropagation();
        drag = true;


        // курсор «в центре» элемента
        offX = el.offsetWidth  / 2;
        offY = el.offsetHeight / 2;

        el.style.zIndex = 1000;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });

    function onMove(e) {
        if (!drag) return;

        const rect = workspace.getBoundingClientRect();

        const x = e.clientX - rect.left - offX;
        const y = e.clientY - rect.top  - offY;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        updateConnections();
    }


    function onUp() {
        if (!drag) return;
        drag = false;
        el.style.zIndex = '';
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
let currentLine = null,
    startElement = null,
    startPort = null;


workspace.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('port')) return;
    e.stopPropagation();
    e.preventDefault();


    // вместо вычислений через getBoundingClientRect() —
    // сразу берём координаты в системе SVG
    const start = screenToSvg(e.clientX, e.clientY);
    startElement = e.target.parentElement;
    startPort    = e.target;

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
    document.addEventListener('mouseup',   finishLine);
});




function dragTempLine(e) {
    if (!currentLine) return;
    // получаем координаты курсора в SVG
    const pos = screenToSvg(e.clientX, e.clientY);

    if (snapPort) {
        const c = portCenter(snapPort);  // уже возвращает SVG-координаты
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
    // const wsRect = workspace.getBoundingClientRect();

    const pr     = port.getBoundingClientRect();
    // координаты центра порта на экране (после CSS-scale/translate):
    const screenX = pr.left + pr.width  / 2;
    const screenY = pr.top  + pr.height / 2;

    // получаем инвертированную матрицу экрана→SVG
        const ctmInv = svg.getScreenCTM().inverse();
    const pt     = svg.createSVGPoint();
    pt.x = screenX; pt.y = screenY;

    // преобразуем в локальные SVG-координаты
    const svgP = pt.matrixTransform(ctmInv);
    return { x: svgP.x, y: svgP.y };
}


function updateTransform() {
    canvas.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
}

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

const cursorPos = {x: 0, y: 0};
workspace.addEventListener('mousemove', e => {
    const rect = workspace.getBoundingClientRect();
    cursorPos.x = e.clientX - rect.left;
    cursorPos.y = e.clientY - rect.top;
});


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

document.getElementById('rightbar-toggle')
    .addEventListener('click', () => {
        document
            .querySelector('.playground-right-bar')
            .classList.toggle('is-collapsed');
    });
