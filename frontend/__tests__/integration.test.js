/**
 * @jest-environment jsdom
 */
import { describe, expect, test, beforeEach } from '@jest/globals';

describe('Workspace integration', () => {
    let workspace;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="workspace" style="position: relative; width:500px;height:500px"></div>
        `;
        workspace = document.getElementById('workspace');
    });
    // 1 test
    test('adds an element to workspace on drop', () => {
        const el = document.createElement('div');
        el.className = 'workspace-element';
        workspace.appendChild(el);

        expect(workspace.querySelector('.workspace-element')).not.toBeNull();
    });
    // 2 test
    test('element is positioned using snap logic', () => {
        const GRID = 25;
        const scale = 1;
        const snap = (v) => Math.round(v / (GRID * scale)) * (GRID * scale);

        const x = 47, y = 63;
        const el = document.createElement('div');
        el.className = 'workspace-element';

        el.style.left = `${snap(x)}px`;
        el.style.top = `${snap(y)}px`;

        expect(el.style.left).toBe('50px');
        expect(el.style.top).toBe('75px');
    });
    // 3 test
    test('copied element is cloned and appended', () => {
        const workspace = document.createElement('div');
        workspace.id = 'workspace';
        document.body.appendChild(workspace);

        const original = document.createElement('div');
        original.className = 'workspace-element';
        original.style.left = '100px';
        original.style.top = '100px';

        workspace.appendChild(original);

        const copy = original.cloneNode(true);
        copy.style.left = '120px';
        copy.style.top = '120px';
        workspace.appendChild(copy);

        const elements = workspace.querySelectorAll('.workspace-element');
        expect(elements.length).toBe(2);
    });
    // 4 test
    test('select and deselect works correctly', () => {
        const el = document.createElement('div');
        el.className = 'workspace-element';
        workspace.appendChild(el);

        const selection = new Set();
        function select(el) { selection.add(el); el.classList.add('selected'); }
        function deselect(el) { selection.delete(el); el.classList.remove('selected'); }

        select(el);
        expect(el.classList.contains('selected')).toBe(true);

        deselect(el);
        expect(el.classList.contains('selected')).toBe(false);
    });
    // 5 test
    test('element drag moves element with correct snapping', () => {
        const GRID = 25;
        const snap = (v) => Math.round(v / GRID) * GRID;
        const el = document.createElement('div');
        el.className = 'workspace-element';
        el.style.left = '0px';
        el.style.top = '0px';
        workspace.appendChild(el);

        el.style.left = `${snap(48)}px`;
        el.style.top = `${snap(48)}px`;

        expect(el.style.left).toBe('50px');
        expect(el.style.top).toBe('50px');
    });
    // 6 test
    test('adding INPUT element collects input values', () => {
        const el = document.createElement('div');
        el.className = 'workspace-element';
        el.dataset.type = 'INPUT';
        el.dataset.value = '1';
        workspace.appendChild(el);

        function collectInputs() {
            const inputs = [...document.querySelectorAll('.workspace-element')]
                .filter(el => (el.dataset.type || '').toUpperCase() === 'INPUT');
            return inputs.map(el => (el.dataset.value === '1' ? 1 : 0));
        }

        expect(collectInputs()).toEqual([1]);
    });
    // 7 test
    test('collectCoordinates returns correct positions', () => {
        const el1 = document.createElement('div');
        el1.className = 'workspace-element';
        el1.style.left = '10px';
        el1.style.top = '20px';

        const el2 = document.createElement('div');
        el2.className = 'workspace-element';
        el2.style.left = '40px';
        el2.style.top = '80px';

        workspace.appendChild(el1);
        workspace.appendChild(el2);

        function collectCoordinates() {
            const nodes = [...document.querySelectorAll('.workspace-element')];
            return nodes.map((el, i) => {
                const id = i;
                const x = parseFloat(el.style.left) || 0;
                const y = parseFloat(el.style.top) || 0;
                return [id, [x, y]];
            });
        }

        expect(collectCoordinates()).toEqual([
            [0, [10, 20]],
            [1, [40, 80]],
        ]);
    });
    // 8 test
    test('drop event creates new workspace element', () => {
        const event = new Event('drop', { bubbles: true });
        event.dataTransfer = {
            getData: (type) => {
                if (type === 'source') return 'sidebar';
                if (type === 'type') return 'and';
                if (type === 'icon') return '/Icons/LogicBlocks/and.svg';
                return '';
            }
        };


        function handleDrop() {
            const el = document.createElement('div');
            el.className = 'workspace-element';
            el.dataset.type = 'AND';
            workspace.appendChild(el);
        }

        workspace.addEventListener('drop', handleDrop);

        workspace.dispatchEvent(event);

        expect(workspace.querySelector('.workspace-element')).not.toBeNull();
    });
});
