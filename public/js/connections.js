// ---------- 1. Ссылки на DOM -------------------------------------------------
const canvas    = document.querySelector('.canvas-container');
const workspace = document.getElementById('workspace');
const svg       = document.getElementById('connections');


// ---------- 2. Панорамирование холста ---------------------------------------
let posX = 0;
let posY = 0;
let scale = 1
let isCanvasDrag = false, startX, startY;

canvas.parentElement.addEventListener('wheel', (e) => {
    // Проверяем, не над панелью ли происходит событие
    if (e.target.closest('.playground-left-bar, .playground-right-bar')) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= delta;
    scale = Math.min(Math.max(0.5, scale), 3);
    updateTransform();
});

canvas.parentElement.addEventListener('mousedown', e => {
    // игнор боковых панелей
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
    canvas.style.transform = `translate(${posX}px,${posY}px)`;
    updateConnections();                      // обновляем линии при панорамировании
});


window.addEventListener('mouseup', () => {
    isCanvasDrag = false;
    canvas.style.cursor = 'grab';
});


// ---------- 3. Drag-&-drop из левой панели ----------------------------------
document.querySelectorAll('.draggable-item').forEach(item => {
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type',   e.target.dataset.type);
        e.dataTransfer.setData('icon',   e.target.dataset.icon);
        e.dataTransfer.setData('source', 'sidebar');
    });
});


workspace.addEventListener('dragover',  e => e.preventDefault());
workspace.addEventListener('drop',      handleDrop);


function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.getData('source') !== 'sidebar') return;


    const type = e.dataTransfer.getData('type');
    const icon = e.dataTransfer.getData('icon');


    const el  = document.createElement('div');
    el.className = 'workspace-element';


    const img = document.createElement('img');
    img.src = icon;
    img.style.transform = 'rotate(90deg)';
    el.appendChild(img);


    addPorts(el, type === 'NOT' ? 1 : 2);


    const rect = workspace.getBoundingClientRect();
    el.style.left = e.clientX - rect.left + 'px';
    el.style.top  = e.clientY - rect.top  + 'px';


    enableElementDrag(el);
    workspace.appendChild(el);
}


// ---------- 4. Создание портов ----------------------------------------------
function addPorts(el, inputs) {
    const makeInput = pct => {
        const p = document.createElement('div');
        p.className = 'port input-port';
        p.style.top = pct;
        p.style.transform = 'translateY(-50%)'; // центрирование для точного расчёта
        el.appendChild(p);
    };
    inputs === 1 ? makeInput('50%') : (makeInput('25%'), makeInput('75%'));


    const out = document.createElement('div');
    out.className = 'port output-port';
    // для output-порта transform уже задан в CSS (.output-port)
    el.appendChild(out);
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
        offY = e.clientY - rect.top  - el.offsetTop;
        el.style.zIndex = 1000;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
    });


    function onMove(e) {
        if (!drag) return;
        const rect = workspace.getBoundingClientRect();
        let x = e.clientX - rect.left - offX;
        let y = e.clientY - rect.top  - offY;
        x = Math.max(0, Math.min(x, rect.width  - el.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - el.offsetHeight));
        el.style.left = snap(x) + 'px';
        el.style.top  = snap(y) + 'px';
        updateConnections();
    }


    function onUp() {
        if (!drag) return;                                // страховка от «залипания»
        drag = false;
        el.style.zIndex = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
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
let currentLine = null,
    startElement = null,
    startPort    = null;


workspace.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('port')) return; // теперь любой порт
    e.stopPropagation();
    e.preventDefault();


    const rect = workspace.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    startElement = e.target.parentElement;
    startPort    = e.target;


    currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    currentLine.setAttribute('x1', x);
    currentLine.setAttribute('y1', y);
    currentLine.setAttribute('x2', x);
    currentLine.setAttribute('y2', y);
    currentLine.setAttribute('stroke', 'black');
    currentLine.setAttribute('stroke-width', '2');
    svg.appendChild(currentLine);


    document.addEventListener('mousemove', dragTempLine);
    document.addEventListener('mouseup',   finishLine);
});


function dragTempLine(e) {
    if (!currentLine) return;
    const rect = workspace.getBoundingClientRect();
    currentLine.setAttribute('x2', e.clientX - rect.left);
    currentLine.setAttribute('y2', e.clientY - rect.top);
}


function finishLine(e) {
    const isPort = e.target.classList.contains('port');
    const same   = e.target === startPort;


    if (!currentLine) return;


    if (e.target.classList.contains('port')) {           // любой порт
        const toElement = e.target.parentElement;
        const toPort    = e.target;


        connections.push({
            from: { element: startElement, port: startPort },
            to:   { element: toElement,   port: toPort   },
            line: currentLine
        });
        updateConnections();
    } else {
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
}


// ---------- 7. Обновление всех линий ----------------------------------------
function updateConnections() {
    connections.forEach(c => {
        const a = portCenter(c.from.port);
        const b = portCenter(c.to .port);
        c.line.setAttribute('x1', a.x);
        c.line.setAttribute('y1', a.y);
        c.line.setAttribute('x2', b.x);
        c.line.setAttribute('y2', b.y);
    });
}


function portCenter(port) {
    const wsRect = workspace.getBoundingClientRect();
    const pr     = port.getBoundingClientRect();
    return {
        x: pr.left - wsRect.left + pr.width  / 2,
        y: pr.top  - wsRect.top  + pr.height / 2
    };
}

function updateTransform() {
    canvas.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}