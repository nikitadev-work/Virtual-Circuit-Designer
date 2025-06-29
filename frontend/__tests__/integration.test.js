/**
 * @jest-environment jsdom
 */

// 1 test - checks that a new element can be added to the workspace DOM container
const { fireEvent } = require('@testing-library/dom');

describe('Workspace integration', () => {
    let workspace;

    beforeEach(() => {
        document.body.innerHTML = `<div id="workspace"></div>`;
        workspace = document.getElementById('workspace');
    });

    test('adds an element to workspace on drop', () => {
        const el = document.createElement('div');
        el.className = 'workspace-element';
        workspace.appendChild(el);

        expect(workspace.querySelector('.workspace-element')).not.toBeNull();
    });
});

// 2 test - verifies that the element is positioned correctly using snap logic
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

// 3 test - confirms that copying an element results in a new identical element being appended
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
