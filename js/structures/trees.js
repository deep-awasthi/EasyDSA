// EasyDSA Trees Structures Visualizer
window.TreesVisualizer = {
    treeData: null, // Root node reference for BST / Binary Tree
    heapData: [],   // Heap array
    trieRoot: null, // Trie root node
    segData: [],    // Segment tree node array
    sourceArr: [],  // Segment tree initial source array

    init(topic) {
        engine.reset();
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        if (topic === 'binarytree' || topic === 'tree-bfs') {
            this.buildDefaultBinaryTree();
            this.renderTree({ root: this.treeData });
            if (topic === 'binarytree') {
                this.setupBinaryTreeControls();
            } else {
                this.setupTreeBFSControls();
            }
        } else if (topic === 'bst') {
            this.treeData = null;
            // Build a small default BST
            [25, 15, 35, 10, 20, 30, 40].forEach(v => this.insertBSTNode(v));
            this.renderTree({ root: this.treeData });
            this.setupBSTControls();
        } else if (topic === 'heaps') {
            this.heapData = [35, 25, 30, 15, 20, 10, 5]; // Pre-filled Max Heap
            this.renderHeap({ heap: this.heapData });
            this.setupHeapControls();
        } else if (topic === 'trie') {
            this.buildDefaultTrie();
            this.renderTrie({ root: this.trieRoot });
            this.setupTrieControls();
        } else if (topic === 'segmenttree') {
            this.sourceArr = [1, 3, 5, 7, 9, 11];
            this.buildSegmentTree();
            this.renderSegmentTree({ tree: this.segData, source: this.sourceArr });
            this.setupSegmentTreeControls();
        }
    },

    // -------------------------------------------------------------
    // Standard BST Tree Helper Class
    // -------------------------------------------------------------
    insertBSTNode(val) {
        const newNode = { val, left: null, right: null, id: Math.random().toString(36).substring(2, 9) };
        if (!this.treeData) {
            this.treeData = newNode;
            return;
        }
        let curr = this.treeData;
        while (true) {
            if (val < curr.val) {
                if (!curr.left) {
                    curr.left = newNode;
                    break;
                }
                curr = curr.left;
            } else {
                if (!curr.right) {
                    curr.right = newNode;
                    break;
                }
                curr = curr.right;
            }
        }
    },

    buildDefaultBinaryTree() {
        this.treeData = {
            val: 1,
            id: 'n1',
            left: {
                val: 2,
                id: 'n2',
                left: { val: 4, id: 'n4', left: null, right: null },
                right: { val: 5, id: 'n5', left: null, right: null }
            },
            right: {
                val: 3,
                id: 'n3',
                left: { val: 6, id: 'n6', left: null, right: null },
                right: { val: 7, id: 'n7', left: null, right: null }
            }
        };
    },

    buildDefaultTrie() {
        this.trieRoot = { char: '', isWord: false, children: {} };
        const words = ["cat", "car", "dog", "dots"];
        words.forEach(w => this.insertTrieWord(w));
    },

    insertTrieWord(word) {
        let curr = this.trieRoot;
        for (let char of word) {
            if (!curr.children[char]) {
                curr.children[char] = { char, isWord: false, children: {} };
            }
            curr = curr.children[char];
        }
        curr.isWord = true;
    },

    buildSegmentTree() {
        const n = this.sourceArr.length;
        this.segData = new Array(4 * n).fill(null);
        
        const buildHelper = (nodeIdx, start, end) => {
            if (start === end) {
                this.segData[nodeIdx] = { val: this.sourceArr[start], range: `[${start}]`, start, end };
                return;
            }
            const mid = Math.floor((start + end) / 2);
            const leftChild = 2 * nodeIdx + 1;
            const rightChild = 2 * nodeIdx + 2;
            buildHelper(leftChild, start, mid);
            buildHelper(rightChild, mid + 1, end);
            this.segData[nodeIdx] = {
                val: this.segData[leftChild].val + this.segData[rightChild].val,
                range: `[${start}-${end}]`,
                start,
                end
            };
        };
        buildHelper(0, 0, n - 1);
    },

    // -------------------------------------------------------------
    // TREE SVG RENDERING
    // -------------------------------------------------------------
    renderTree(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.background = 'transparent';
        
        if (!snapshot.root) {
            workspace.appendChild(svg);
            return;
        }

        const nodes = [];
        const edges = [];
        
        const traverse = (node, x, y, level, levelWidth) => {
            if (!node) return;
            nodes.push({
                id: node.id,
                val: node.val,
                x, y,
                isHighlight: snapshot.highlightNodes && snapshot.highlightNodes.includes(node.id),
                isActive: snapshot.activeNodes && snapshot.activeNodes.includes(node.id),
                isSuccess: snapshot.successNodes && snapshot.successNodes.includes(node.id)
            });
            
            if (node.left) {
                const nextX = x - levelWidth / Math.pow(1.8, level + 1);
                const nextY = y + 60;
                edges.push({ x1: x, y1: y, x2: nextX, y2: nextY, isActive: snapshot.activeEdges && snapshot.activeEdges.includes(`${node.id}-${node.left.id}`) });
                traverse(node.left, nextX, nextY, level + 1, levelWidth);
            }
            if (node.right) {
                const nextX = x + levelWidth / Math.pow(1.8, level + 1);
                const nextY = y + 60;
                edges.push({ x1: x, y1: y, x2: nextX, y2: nextY, isActive: snapshot.activeEdges && snapshot.activeEdges.includes(`${node.id}-${node.right.id}`) });
                traverse(node.right, nextX, nextY, level + 1, levelWidth);
            }
        };

        const width = workspace.clientWidth || 600;
        traverse(snapshot.root, width / 2, 40, 0, width / 3.5);

        // Draw Edges
        edges.forEach(e => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', e.x1);
            line.setAttribute('y1', e.y1);
            line.setAttribute('x2', e.x2);
            line.setAttribute('y2', e.y2);
            line.setAttribute('stroke', e.isActive ? 'var(--color-primary)' : 'var(--border-color)');
            line.setAttribute('stroke-width', e.isActive ? '3' : '2');
            if (e.isActive) {
                line.style.filter = 'drop-shadow(0 0 5px var(--color-primary))';
            }
            svg.appendChild(line);
        });

        // Draw Nodes
        nodes.forEach(n => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', n.x);
            circle.setAttribute('cy', n.y);
            circle.setAttribute('r', '18');
            
            let fill = 'var(--bg-surface-opaque)';
            let stroke = 'var(--border-color)';
            if (n.isHighlight) {
                stroke = 'var(--color-primary)';
                circle.style.filter = 'drop-shadow(0 0 8px var(--color-primary))';
            }
            if (n.isActive) {
                stroke = 'var(--color-secondary)';
                circle.style.filter = 'drop-shadow(0 0 8px var(--color-secondary))';
            }
            if (n.isSuccess) {
                stroke = 'var(--color-success)';
                circle.style.filter = 'drop-shadow(0 0 8px var(--color-success))';
            }

            circle.setAttribute('fill', fill);
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', '2.5');
            g.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', n.x);
            text.setAttribute('y', n.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'var(--text-primary)');
            text.setAttribute('font-size', '11px');
            text.setAttribute('font-weight', '700');
            text.setAttribute('font-family', 'var(--font-sans)');
            text.textContent = n.val;
            g.appendChild(text);

            svg.appendChild(g);
        });

        workspace.appendChild(svg);
    },

    // -------------------------------------------------------------
    // HEAPS RENDERING (Dual representation Tree + Array)
    // -------------------------------------------------------------
    renderHeap(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.width = '100%';
        container.style.height = '100%';

        // 1. Tree View (Takes up 65% height)
        const treeArea = document.createElement('div');
        treeArea.style.flex = '1';
        treeArea.style.position = 'relative';
        container.appendChild(treeArea);

        // 2. Array View (Takes up 35% height)
        const arrayArea = document.createElement('div');
        arrayArea.style.height = '110px';
        arrayArea.style.borderTop = '1px solid var(--border-color)';
        arrayArea.style.display = 'flex';
        arrayArea.style.alignItems = 'center';
        arrayArea.style.justifyContent = 'center';
        container.appendChild(arrayArea);
        workspace.appendChild(container);

        // Render standard array inside the arrayArea
        const heapArr = snapshot.heap || [];
        const arrContainer = document.createElement('div');
        arrContainer.className = 'array-container';
        arrContainer.style.padding = '0.5rem';

        heapArr.forEach((val, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'array-item-wrapper';
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.style.width = '35px';
            cell.style.height = '35px';
            cell.style.fontSize = '0.85rem';
            cell.innerText = val;

            if (snapshot.activeIdxs && snapshot.activeIdxs.includes(idx)) {
                cell.classList.add('active');
            }
            if (snapshot.highlightIdxs && snapshot.highlightIdxs.includes(idx)) {
                cell.classList.add('highlight');
            }

            const label = document.createElement('div');
            label.className = 'array-index';
            label.innerText = idx;
            
            wrapper.appendChild(cell);
            wrapper.appendChild(label);
            arrContainer.appendChild(wrapper);
        });
        arrayArea.appendChild(arrContainer);

        // Render Tree in treeArea
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        treeArea.appendChild(svg);

        if (heapArr.length === 0) return;

        const nodes = [];
        const edges = [];
        const width = treeArea.clientWidth || 500;

        const getCoords = (idx) => {
            let level = Math.floor(Math.log2(idx + 1));
            let levelFirst = Math.pow(2, level) - 1;
            let levelIdx = idx - levelFirst;
            let levelCount = Math.pow(2, level);

            let x = ((levelIdx + 0.5) / levelCount) * width;
            let y = 30 + level * 50;
            return { x, y };
        };

        heapArr.forEach((val, idx) => {
            const p = getCoords(idx);
            nodes.push({
                idx, val,
                x: p.x, y: p.y,
                isActive: snapshot.activeIdxs && snapshot.activeIdxs.includes(idx),
                isHighlight: snapshot.highlightIdxs && snapshot.highlightIdxs.includes(idx)
            });

            if (idx > 0) {
                let parentIdx = Math.floor((idx - 1) / 2);
                let pCoords = getCoords(parentIdx);
                edges.push({
                    x1: pCoords.x, y1: pCoords.y,
                    x2: p.x, y2: p.y,
                    isActive: snapshot.activeIdxs && snapshot.activeIdxs.includes(idx) && snapshot.activeIdxs.includes(parentIdx)
                });
            }
        });

        // Draw Lines
        edges.forEach(e => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', e.x1);
            line.setAttribute('y1', e.y1);
            line.setAttribute('x2', e.x2);
            line.setAttribute('y2', e.y2);
            line.setAttribute('stroke', e.isActive ? 'var(--color-primary)' : 'var(--border-color)');
            line.setAttribute('stroke-width', e.isActive ? '3' : '1.5');
            svg.appendChild(line);
        });

        // Draw Circles
        nodes.forEach(n => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', n.x);
            circle.setAttribute('cy', n.y);
            circle.setAttribute('r', '15');
            
            let fill = 'var(--bg-surface-opaque)';
            let stroke = 'var(--border-color)';
            if (n.isHighlight) stroke = 'var(--color-primary)';
            if (n.isActive) stroke = 'var(--color-secondary)';
            
            circle.setAttribute('fill', fill);
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', '2');
            g.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', n.x);
            text.setAttribute('y', n.y + 4);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'var(--text-primary)');
            text.setAttribute('font-size', '10px');
            text.setAttribute('font-weight', '700');
            text.textContent = n.val;
            g.appendChild(text);

            svg.appendChild(g);
        });
    },

    // -------------------------------------------------------------
    // TRIE RENDERING
    // -------------------------------------------------------------
    renderTrie(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        workspace.appendChild(svg);

        if (!snapshot.root) return;

        const nodes = [];
        const edges = [];
        const width = workspace.clientWidth || 600;

        const traverse = (node, x, y, level, parentX, parentY) => {
            nodes.push({
                char: node.char || 'Root',
                isWord: node.isWord,
                x, y,
                isHighlight: snapshot.activeNodePath && snapshot.activeNodePath.includes(node)
            });

            if (parentX !== null) {
                edges.push({ x1: parentX, y1: parentY, x2: x, y2: y, isActive: snapshot.activeNodePath && snapshot.activeNodePath.includes(node) });
            }

            const childrenKeys = Object.keys(node.children);
            const count = childrenKeys.length;
            const step = width / Math.pow(2.8, level + 1);

            childrenKeys.forEach((char, idx) => {
                const childX = x + (idx - (count - 1) / 2) * step;
                const childY = y + 55;
                traverse(node.children[char], childX, childY, level + 1, x, y);
            });
        };

        traverse(snapshot.root, width / 2, 35, 0, null, null);

        // Draw Edges
        edges.forEach(e => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', e.x1);
            line.setAttribute('y1', e.y1);
            line.setAttribute('x2', e.x2);
            line.setAttribute('y2', e.y2);
            line.setAttribute('stroke', e.isActive ? 'var(--color-primary)' : 'var(--border-color)');
            line.setAttribute('stroke-width', e.isActive ? '2.5' : '1.5');
            svg.appendChild(line);
        });

        // Draw Nodes
        nodes.forEach(n => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', n.x);
            circle.setAttribute('cy', n.y);
            circle.setAttribute('r', '14');
            
            let fill = 'var(--bg-surface-opaque)';
            let stroke = n.isWord ? 'var(--color-success)' : 'var(--border-color)';
            if (n.isHighlight) stroke = 'var(--color-primary)';
            
            circle.setAttribute('fill', fill);
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', n.isWord ? '3' : '1.5');
            g.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', n.x);
            text.setAttribute('y', n.y + 4);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'var(--text-primary)');
            text.setAttribute('font-size', '10px');
            text.textContent = n.char;
            g.appendChild(text);

            svg.appendChild(g);
        });
    },

    // -------------------------------------------------------------
    // SEGMENT TREE RENDERING
    // -------------------------------------------------------------
    renderSegmentTree(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.width = '100%';
        container.style.height = '100%';

        const treeArea = document.createElement('div');
        treeArea.style.flex = '1';
        container.appendChild(treeArea);

        const arrayArea = document.createElement('div');
        arrayArea.style.height = '80px';
        arrayArea.style.borderTop = '1px solid var(--border-color)';
        arrayArea.style.display = 'flex';
        arrayArea.style.alignItems = 'center';
        arrayArea.style.justifyContent = 'center';
        container.appendChild(arrayArea);
        workspace.appendChild(container);

        const srcArr = snapshot.source || [];
        const arrWrapper = document.createElement('div');
        arrWrapper.className = 'array-container';
        arrWrapper.style.padding = '0.5rem';
        srcArr.forEach((val, idx) => {
            const wrap = document.createElement('div');
            wrap.className = 'array-item-wrapper';
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.style.width = '35px';
            cell.style.height = '35px';
            cell.innerText = val;
            
            if (snapshot.queryRange && idx >= snapshot.queryRange[0] && idx <= snapshot.queryRange[1]) {
                cell.classList.add('highlight');
            }

            const ind = document.createElement('div');
            ind.className = 'array-index';
            ind.innerText = idx;
            
            wrap.appendChild(cell);
            wrap.appendChild(ind);
            arrWrapper.appendChild(wrap);
        });
        arrayArea.appendChild(arrWrapper);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        treeArea.appendChild(svg);

        const tree = snapshot.tree || [];
        if (tree.length === 0 || !tree[0]) return;

        const nodes = [];
        const edges = [];
        const width = treeArea.clientWidth || 500;

        const layoutTree = (nodeIdx, x, y, level, step) => {
            const node = tree[nodeIdx];
            if (!node) return;

            nodes.push({
                idx: nodeIdx,
                val: node.val,
                range: node.range,
                x, y,
                isHighlight: snapshot.activeNodeIdxs && snapshot.activeNodeIdxs.includes(nodeIdx)
            });

            const leftChild = 2 * nodeIdx + 1;
            const rightChild = 2 * nodeIdx + 2;

            if (tree[leftChild]) {
                const nextX = x - step;
                const nextY = y + 55;
                edges.push({ x1: x, y1: y, x2: nextX, y2: nextY, isActive: snapshot.activeNodeIdxs && snapshot.activeNodeIdxs.includes(leftChild) });
                layoutTree(leftChild, nextX, nextY, level + 1, step / 1.7);
            }
            if (tree[rightChild]) {
                const nextX = x + step;
                const nextY = y + 55;
                edges.push({ x1: x, y1: y, x2: nextX, y2: nextY, isActive: snapshot.activeNodeIdxs && snapshot.activeNodeIdxs.includes(rightChild) });
                layoutTree(rightChild, nextX, nextY, level + 1, step / 1.7);
            }
        };

        layoutTree(0, width / 2, 35, 0, width / 4.5);

        // Draw edges
        edges.forEach(e => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', e.x1);
            line.setAttribute('y1', e.y1);
            line.setAttribute('x2', e.x2);
            line.setAttribute('y2', e.y2);
            line.setAttribute('stroke', e.isActive ? 'var(--color-primary)' : 'var(--border-color)');
            line.setAttribute('stroke-width', e.isActive ? '2.5' : '1.5');
            svg.appendChild(line);
        });

        // Draw nodes
        nodes.forEach(n => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', n.x - 30);
            rect.setAttribute('y', n.y - 18);
            rect.setAttribute('width', '60');
            rect.setAttribute('height', '30');
            rect.setAttribute('rx', '6');
            
            let stroke = 'var(--border-color)';
            if (n.isHighlight) {
                stroke = 'var(--color-primary)';
                rect.style.filter = 'drop-shadow(0 0 6px var(--color-primary))';
            }

            rect.setAttribute('fill', 'var(--bg-surface-opaque)');
            rect.setAttribute('stroke', stroke);
            rect.setAttribute('stroke-width', '1.5');
            g.appendChild(rect);

            const textVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textVal.setAttribute('x', n.x);
            textVal.setAttribute('y', n.y - 2);
            textVal.setAttribute('text-anchor', 'middle');
            textVal.setAttribute('fill', 'var(--text-primary)');
            textVal.setAttribute('font-size', '9px');
            textVal.setAttribute('font-weight', '700');
            textVal.textContent = `Sum: ${n.val}`;
            g.appendChild(textVal);

            const textRange = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textRange.setAttribute('x', n.x);
            textRange.setAttribute('y', n.y + 8);
            textRange.setAttribute('text-anchor', 'middle');
            textRange.setAttribute('fill', 'var(--color-secondary)');
            textRange.setAttribute('font-size', '8px');
            textRange.textContent = n.range;
            g.appendChild(textRange);

            svg.appendChild(g);
        });
    },

    // -------------------------------------------------------------
    // CONTROLS INJECTIONS
    // -------------------------------------------------------------
    setupBinaryTreeControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="TreesVisualizer.runTreeTraversal('preorder')"><i class="fa-solid fa-play"></i> Preorder Traversal</button>
            <button class="btn btn-primary" onclick="TreesVisualizer.runTreeTraversal('inorder')"><i class="fa-solid fa-play"></i> Inorder Traversal</button>
            <button class="btn btn-primary" onclick="TreesVisualizer.runTreeTraversal('postorder')"><i class="fa-solid fa-play"></i> Postorder Traversal</button>
        `;
    },

    setupTreeBFSControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="TreesVisualizer.runTreeBFS()"><i class="fa-solid fa-play"></i> Run Level Order BFS</button>
        `;
    },

    setupBSTControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="bst-val" class="control-input" placeholder="Val (e.g. 23)">
            <button class="btn btn-primary" onclick="TreesVisualizer.runBSTInsert()"><i class="fa-solid fa-plus"></i> Insert</button>
            <button class="btn btn-secondary" onclick="TreesVisualizer.runBSTSearch()"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
        `;
    },

    setupHeapControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <select id="heap-type-select" class="control-select" onchange="TreesVisualizer.toggleHeapType()">
                <option value="max">Max Heap</option>
                <option value="min">Min Heap</option>
            </select>
            <input type="number" id="heap-val" class="control-input" placeholder="Value">
            <button class="btn btn-primary" onclick="TreesVisualizer.runHeapInsert()"><i class="fa-solid fa-arrow-up"></i> Insert</button>
            <button class="btn btn-danger" onclick="TreesVisualizer.runHeapExtract()"><i class="fa-solid fa-arrow-down"></i> Extract Root</button>
        `;
    },

    toggleHeapType() {
        const select = document.getElementById('heap-type-select');
        if (select.value === 'max') {
            this.heapData = [35, 25, 30, 15, 20, 10, 5];
        } else {
            this.heapData = [5, 10, 15, 25, 20, 30, 35]; // Sorted min-heap values
        }
        this.renderHeap({ heap: this.heapData });
    },

    setupTrieControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="text" id="trie-word" class="control-input" placeholder="Word (e.g. car)" style="width: 130px;">
            <button class="btn btn-primary" onclick="TreesVisualizer.runTrieInsert()"><i class="fa-solid fa-plus"></i> Insert Word</button>
            <button class="btn btn-secondary" onclick="TreesVisualizer.runTrieSearch()"><i class="fa-solid fa-magnifying-glass"></i> Search Word</button>
        `;
    },

    setupSegmentTreeControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="seg-left" class="control-input" placeholder="Left Index (e.g. 1)">
            <input type="number" id="seg-right" class="control-input" placeholder="Right Index (e.g. 4)">
            <button class="btn btn-primary" onclick="TreesVisualizer.runSegmentTreeQuery()"><i class="fa-solid fa-play"></i> Query Range Sum</button>
        `;
    },

    // -------------------------------------------------------------
    // ANIMATIONS RUNNERS
    // -------------------------------------------------------------
    runTreeTraversal(type) {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderTree(snap);

        const visitedNodes = [];
        const activeEdges = [];

        const traverse = (node, parentId = null) => {
            if (!node) return;
            if (parentId) activeEdges.push(`${parentId}-${node.id}`);
            
            if (type === 'preorder') {
                visitedNodes.push(node.id);
                engine.addStep({ root: this.treeData, activeNodes: [...visitedNodes], activeEdges: [...activeEdges] }, `Visited Node ${node.val} (Preorder step)`, 'success');
            }

            traverse(node.left, node.id);
            
            if (type === 'inorder') {
                visitedNodes.push(node.id);
                engine.addStep({ root: this.treeData, activeNodes: [...visitedNodes], activeEdges: [...activeEdges] }, `Visited Node ${node.val} (Inorder step)`, 'success');
            }

            traverse(node.right, node.id);

            if (type === 'postorder') {
                visitedNodes.push(node.id);
                engine.addStep({ root: this.treeData, activeNodes: [...visitedNodes], activeEdges: [...activeEdges] }, `Visited Node ${node.val} (Postorder step)`, 'success');
            }
        };

        engine.addStep({ root: this.treeData }, `Starting ${type.toUpperCase()} Traversal`);
        traverse(this.treeData);
        engine.play();
    },

    runTreeBFS() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderTree(snap);

        const queue = [this.treeData];
        const visitedIds = [];
        const activeEdges = [];

        engine.addStep({ root: this.treeData }, `Starting Level Order BFS Traversal`);

        while (queue.length > 0) {
            const curr = queue.shift();
            if (!curr) continue;

            visitedIds.push(curr.id);
            engine.addStep({
                root: this.treeData,
                activeNodes: [curr.id],
                successNodes: [...visitedIds],
                activeEdges: [...activeEdges]
            }, `Visiting node ${curr.val} popped from queue`, 'success');

            if (curr.left) {
                queue.push(curr.left);
                activeEdges.push(`${curr.id}-${curr.left.id}`);
                engine.addStep({
                    root: this.treeData,
                    successNodes: [...visitedIds],
                    activeNodes: [curr.id],
                    activeEdges: [...activeEdges]
                }, `Added left child ${curr.left.val} to queue`);
            }
            if (curr.right) {
                queue.push(curr.right);
                activeEdges.push(`${curr.id}-${curr.right.id}`);
                engine.addStep({
                    root: this.treeData,
                    successNodes: [...visitedIds],
                    activeNodes: [curr.id],
                    activeEdges: [...activeEdges]
                }, `Added right child ${curr.right.val} to queue`);
            }
        }

        engine.addStep({ root: this.treeData, successNodes: [...visitedIds] }, `BFS Tree Level Order Traversal completed!`, 'success');
        engine.play();
    },

    runBSTInsert() {
        const valInput = document.getElementById('bst-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderTree(snap);
        
        const path = [];
        let curr = this.treeData;
        
        engine.addStep({ root: this.treeData }, `Inserting ${val} in Binary Search Tree`);

        let parentNode = null;
        while (curr) {
            path.push(curr.id);
            parentNode = curr;
            if (val === curr.val) {
                engine.addStep({ root: this.treeData, highlightNodes: [curr.id] }, `Value ${val} already exists in the BST!`);
                engine.play();
                return;
            }
            if (val < curr.val) {
                engine.addStep({ root: this.treeData, activeNodes: [curr.id], highlightNodes: [...path] }, `Checking Node ${curr.val}: ${val} < ${curr.val}, travel left`);
                curr = curr.left;
            } else {
                engine.addStep({ root: this.treeData, activeNodes: [curr.id], highlightNodes: [...path] }, `Checking Node ${curr.val}: ${val} > ${curr.val}, travel right`);
                curr = curr.right;
            }
        }

        this.insertBSTNode(val);
        engine.addStep({ root: this.treeData, successNodes: [path[path.length - 1]] }, `Placed ${val} as child under node ${parentNode ? parentNode.val : 'root'}`, 'success');
        engine.play();
    },

    runBSTSearch() {
        const valInput = document.getElementById('bst-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderTree(snap);

        let curr = this.treeData;
        const path = [];
        let found = false;

        engine.addStep({ root: this.treeData }, `Searching for ${val} in Binary Search Tree`);

        while (curr) {
            path.push(curr.id);
            if (curr.val === val) {
                found = true;
                engine.addStep({ root: this.treeData, successNodes: [curr.id], highlightNodes: [...path] }, `Found node ${val} in BST!`, 'success');
                break;
            }
            if (val < curr.val) {
                engine.addStep({ root: this.treeData, activeNodes: [curr.id], highlightNodes: [...path] }, `Compare ${val} < ${curr.val}. Moving left.`);
                curr = curr.left;
            } else {
                engine.addStep({ root: this.treeData, activeNodes: [curr.id], highlightNodes: [...path] }, `Compare ${val} > ${curr.val}. Moving right.`);
                curr = curr.right;
            }
        }

        if (!found) {
            engine.addStep({ root: this.treeData, highlightNodes: [...path] }, `Finished searching: Node ${val} is not in the tree.`, 'danger');
        }
        engine.play();
    },

    runHeapInsert() {
        const valInput = document.getElementById('heap-val');
        const select = document.getElementById('heap-type-select');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);
        const heapType = select ? select.value : 'max';

        engine.reset();
        engine.onRenderStep = (snap) => this.renderHeap(snap);

        engine.addStep({ heap: this.heapData }, `Inserting ${val} into ${heapType === 'max' ? 'Max' : 'Min'} Heap`);
        
        this.heapData.push(val);
        let curr = this.heapData.length - 1;
        engine.addStep({ heap: [...this.heapData], activeIdxs: [curr] }, `Placed ${val} at index ${curr} (last leaf node)`);

        while (curr > 0) {
            let parentIdx = Math.floor((curr - 1) / 2);
            engine.addStep({ heap: [...this.heapData], activeIdxs: [curr, parentIdx] }, `Compare child ${this.heapData[curr]} with parent ${this.heapData[parentIdx]}`);
            
            let shouldSwap = false;
            if (heapType === 'max') {
                shouldSwap = this.heapData[curr] > this.heapData[parentIdx];
            } else {
                shouldSwap = this.heapData[curr] < this.heapData[parentIdx];
            }

            if (shouldSwap) {
                let temp = this.heapData[curr];
                this.heapData[curr] = this.heapData[parentIdx];
                this.heapData[parentIdx] = temp;
                engine.addStep({ heap: [...this.heapData], highlightIdxs: [curr, parentIdx] }, `Swapped child and parent`, 'highlight');
                curr = parentIdx;
            } else {
                break;
            }
        }

        engine.addStep({ heap: [...this.heapData] }, `Heap insertion complete!`, 'success');
        engine.play();
    },

    runHeapExtract() {
        if (this.heapData.length === 0) return;
        const select = document.getElementById('heap-type-select');
        const heapType = select ? select.value : 'max';

        engine.reset();
        engine.onRenderStep = (snap) => this.renderHeap(snap);

        const rootVal = this.heapData[0];
        engine.addStep({ heap: this.heapData, activeIdxs: [0] }, `Extracting root value (${rootVal}) from heap`);

        if (this.heapData.length === 1) {
            this.heapData.pop();
            engine.addStep({ heap: [] }, `Heap is now empty`, 'success');
            engine.play();
            return;
        }

        const lastVal = this.heapData.pop();
        this.heapData[0] = lastVal;
        engine.addStep({ heap: [...this.heapData], activeIdxs: [0] }, `Replaced root with last element (${lastVal}). Beginning Heapify-Down.`);

        let curr = 0;
        const size = this.heapData.length;

        while (true) {
            let left = 2 * curr + 1;
            let right = 2 * curr + 2;
            let targetIdx = curr;

            if (heapType === 'max') {
                if (left < size && this.heapData[left] > this.heapData[targetIdx]) targetIdx = left;
                if (right < size && this.heapData[right] > this.heapData[targetIdx]) targetIdx = right;
            } else {
                if (left < size && this.heapData[left] < this.heapData[targetIdx]) targetIdx = left;
                if (right < size && this.heapData[right] < this.heapData[targetIdx]) targetIdx = right;
            }

            if (targetIdx !== curr) {
                engine.addStep({ heap: [...this.heapData], activeIdxs: [curr, targetIdx] }, `Target swap child is ${this.heapData[targetIdx]}. Swapping with parent ${this.heapData[curr]}`);
                let temp = this.heapData[curr];
                this.heapData[curr] = this.heapData[targetIdx];
                this.heapData[targetIdx] = temp;
                engine.addStep({ heap: [...this.heapData], highlightIdxs: [curr, targetIdx] }, `Swapped nodes`, 'highlight');
                curr = targetIdx;
            } else {
                break;
            }
        }

        engine.addStep({ heap: [...this.heapData] }, `Heapify-Down completed. Extraction complete!`, 'success');
        engine.play();
    },

    runTrieInsert() {
        const wordInput = document.getElementById('trie-word');
        if (!wordInput.value) return;
        const word = wordInput.value.toLowerCase().replace(/[^a-z]/g, '');
        if (!word) return;

        engine.reset();
        engine.onRenderStep = (snap) => this.renderTrie(snap);
        
        engine.addStep({ root: this.trieRoot }, `Inserting word "${word}" into Trie`);

        let curr = this.trieRoot;
        const path = [curr];

        for (let char of word) {
            let createdNew = false;
            if (!curr.children[char]) {
                curr.children[char] = { char, isWord: false, children: {} };
                createdNew = true;
            }
            curr = curr.children[char];
            path.push(curr);
            engine.addStep({ root: this.trieRoot, activeNodePath: [...path] }, createdNew ? `Created new node for char '${char}'` : `Char '${char}' prefix matches existing node`);
        }

        curr.isWord = true;
        engine.addStep({ root: this.trieRoot, activeNodePath: [...path] }, `Marked terminal node for word "${word}" as complete!`, 'success');
        engine.play();
    },

    runTrieSearch() {
        const wordInput = document.getElementById('trie-word');
        if (!wordInput.value) return;
        const word = wordInput.value.toLowerCase().replace(/[^a-z]/g, '');

        engine.reset();
        engine.onRenderStep = (snap) => this.renderTrie(snap);

        engine.addStep({ root: this.trieRoot }, `Searching for word "${word}" in Trie`);

        let curr = this.trieRoot;
        const path = [curr];
        let found = true;

        for (let char of word) {
            if (!curr.children[char]) {
                found = false;
                engine.addStep({ root: this.trieRoot, activeNodePath: [...path] }, `Prefix char '${char}' not found. Word does not exist in Trie.`, 'danger');
                break;
            }
            curr = curr.children[char];
            path.push(curr);
            engine.addStep({ root: this.trieRoot, activeNodePath: [...path] }, `Found prefix char '${char}'`);
        }

        if (found) {
            if (curr.isWord) {
                engine.addStep({ root: this.trieRoot, activeNodePath: [...path] }, `Reached terminal node! Word "${word}" exists!`, 'success');
            } else {
                engine.addStep({ root: this.trieRoot, activeNodePath: [...path] }, `Reached node, but it is not marked as a word. Word "${word}" does not exist.`, 'danger');
            }
        }

        engine.play();
    },

    runSegmentTreeQuery() {
        const lInput = document.getElementById('seg-left');
        const rInput = document.getElementById('seg-right');
        if (lInput.value === '' || rInput.value === '') return;

        const ql = parseInt(lInput.value);
        const qr = parseInt(rInput.value);
        const maxIdx = this.sourceArr.length - 1;

        if (ql < 0 || qr > maxIdx || ql > qr) {
            engine.addLog("Query boundaries out of array bounds!", "danger");
            return;
        }

        engine.reset();
        engine.onRenderStep = (snap) => this.renderSegmentTree(snap);

        engine.addStep({ tree: this.segData, source: this.sourceArr, queryRange: [ql, qr] }, `Querying Range Sum: Summing elements from index ${ql} to ${qr}`);

        const activeNodes = [];
        
        const querySum = (nodeIdx, start, end, l, r) => {
            if (r < start || end < l) {
                engine.addStep({ tree: this.segData, source: this.sourceArr, queryRange: [ql, qr], activeNodeIdxs: [...activeNodes, nodeIdx] }, `Node [${start}-${end}]: Completely outside range. Returning 0.`);
                return 0;
            }
            if (l <= start && end <= r) {
                activeNodes.push(nodeIdx);
                const nodeVal = this.segData[nodeIdx].val;
                engine.addStep({ tree: this.segData, source: this.sourceArr, queryRange: [ql, qr], activeNodeIdxs: [...activeNodes] }, `Node [${start}-${end}]: Completely inside range. Accumulating value ${nodeVal}.`, 'highlight');
                return nodeVal;
            }

            activeNodes.push(nodeIdx);
            engine.addStep({ tree: this.segData, source: this.sourceArr, queryRange: [ql, qr], activeNodeIdxs: [...activeNodes] }, `Node [${start}-${end}]: Partial overlap. Splitting query.`);

            const mid = Math.floor((start + end) / 2);
            const sumL = querySum(2 * nodeIdx + 1, start, mid, l, r);
            const sumR = querySum(2 * nodeIdx + 2, mid + 1, end, l, r);
            return sumL + sumR;
        };

        const totalSum = querySum(0, 0, maxIdx, ql, qr);
        engine.addStep({ tree: this.segData, source: this.sourceArr, queryRange: [ql, qr], activeNodeIdxs: [...activeNodes] }, `Query Completed! Range Sum [${ql}-${qr}] = ${totalSum}`, 'success');

        engine.play();
    }
};
