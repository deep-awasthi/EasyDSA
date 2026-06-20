// EasyDSA Graph Visualizer
window.GraphVisualizer = {
    nodes: [],
    edges: [],
    adjList: {},

    init() {
        engine.reset();
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        // Define coordinate layout for 5 vertices
        const width = workspace.clientWidth || 600;
        const height = workspace.clientHeight || 400;
        
        this.nodes = [
            { id: 0, x: width / 2, y: 60, label: '0' },
            { id: 1, x: width / 3.2, y: 150, label: '1' },
            { id: 2, x: width / 1.45, y: 150, label: '2' },
            { id: 3, x: width / 2, y: 240, label: '3' },
            { id: 4, x: width / 4.2, y: 240, label: '4' }
        ];

        this.edges = [
            { u: 0, v: 1 },
            { u: 0, v: 2 },
            { u: 1, v: 3 },
            { u: 1, v: 4 },
            { u: 2, v: 3 },
            { u: 3, v: 4 }
        ];

        // Build adjacency list representation
        this.adjList = { 0: [1, 2], 1: [0, 3, 4], 2: [0, 3], 3: [1, 2, 4], 4: [1, 3] };

        this.renderGraph({});
        this.setupGraphControls();
    },

    renderGraph(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.width = '100%';
        container.style.height = '100%';

        // Graph SVG Panel
        const graphArea = document.createElement('div');
        graphArea.style.flex = '1';
        container.appendChild(graphArea);

        // Queue/Stack array indicator
        const arrayArea = document.createElement('div');
        arrayArea.style.height = '90px';
        arrayArea.style.borderTop = '1px solid var(--border-color)';
        arrayArea.style.display = 'flex';
        arrayArea.style.alignItems = 'center';
        arrayArea.style.justifyContent = 'center';
        container.appendChild(arrayArea);
        workspace.appendChild(container);

        if (snapshot.structureName) {
            const structureContainer = document.createElement('div');
            structureContainer.style.display = 'flex';
            structureContainer.style.alignItems = 'center';
            structureContainer.style.gap = '0.5rem';
            
            const label = document.createElement('span');
            label.style.fontFamily = 'var(--font-mono)';
            label.style.fontSize = '0.8rem';
            label.style.color = 'var(--text-muted)';
            label.innerText = `${snapshot.structureName}: `;
            structureContainer.appendChild(label);

            const arr = snapshot.structureData || [];
            if (arr.length === 0) {
                const empty = document.createElement('span');
                empty.style.color = 'var(--text-muted)';
                empty.innerText = 'Empty';
                structureContainer.appendChild(empty);
            } else {
                arr.forEach(val => {
                    const cell = document.createElement('div');
                    cell.className = 'array-cell';
                    cell.style.width = '35px';
                    cell.style.height = '35px';
                    cell.style.fontSize = '0.85rem';
                    cell.innerText = val;
                    structureContainer.appendChild(cell);
                });
            }
            arrayArea.appendChild(structureContainer);
        } else {
            arrayArea.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem;">Start a traversal to view BFS Queue or DFS Stack state.</span>`;
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        graphArea.appendChild(svg);

        // Draw edges
        this.edges.forEach(e => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const n1 = this.nodes[e.u];
            const n2 = this.nodes[e.v];
            
            line.setAttribute('x1', n1.x);
            line.setAttribute('y1', n1.y);
            line.setAttribute('x2', n2.x);
            line.setAttribute('y2', n2.y);
            
            const isEdgeActive = snapshot.activeEdges && 
                (snapshot.activeEdges.includes(`${e.u}-${e.v}`) || snapshot.activeEdges.includes(`${e.v}-${e.u}`));

            line.setAttribute('stroke', isEdgeActive ? 'var(--color-primary)' : 'var(--border-color)');
            line.setAttribute('stroke-width', isEdgeActive ? '3.5' : '2');
            if (isEdgeActive) {
                line.style.filter = 'drop-shadow(0 0 5px var(--color-primary))';
            }
            svg.appendChild(line);
        });

        // Draw nodes
        this.nodes.forEach(n => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', n.x);
            circle.setAttribute('cy', n.y);
            circle.setAttribute('r', '20');

            const isVisited = snapshot.visited && snapshot.visited.includes(n.id);
            const isActive = snapshot.activeNode === n.id;

            let fill = 'var(--bg-surface-opaque)';
            let stroke = 'var(--border-color)';
            
            if (isVisited) {
                stroke = 'var(--color-success)';
                circle.style.filter = 'drop-shadow(0 0 6px var(--color-success))';
            }
            if (isActive) {
                stroke = 'var(--color-secondary)';
                circle.style.filter = 'drop-shadow(0 0 8px var(--color-secondary))';
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
            text.setAttribute('font-size', '12px');
            text.setAttribute('font-weight', '700');
            text.textContent = n.label;
            g.appendChild(text);

            svg.appendChild(g);
        });
    },

    setupGraphControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="GraphVisualizer.runBFS(0)"><i class="fa-solid fa-play"></i> Breadth First Search (BFS)</button>
            <button class="btn btn-primary" onclick="GraphVisualizer.runDFS(0)"><i class="fa-solid fa-play"></i> Depth First Search (DFS)</button>
        `;
    },

    runBFS(startNode) {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderGraph(snap);

        const visited = [];
        const queue = [startNode];
        const activeEdges = [];
        const parentMap = {};

        engine.addStep({
            visited: [],
            activeNode: null,
            activeEdges: [],
            structureName: 'BFS Queue',
            structureData: [...queue]
        }, `Initialized BFS starting at node ${startNode}`);

        visited.push(startNode);
        
        while (queue.length > 0) {
            const curr = queue.shift();
            
            // Build current visual edges
            const edgesToRender = [...activeEdges];
            if (parentMap[curr] !== undefined) {
                edgesToRender.push(`${parentMap[curr]}-${curr}`);
            }

            engine.addStep({
                visited: [...visited],
                activeNode: curr,
                activeEdges: edgesToRender,
                structureName: 'BFS Queue',
                structureData: [...queue]
            }, `Processing Node ${curr} popped from Queue`, 'success');

            if (parentMap[curr] !== undefined) {
                activeEdges.push(`${parentMap[curr]}-${curr}`);
            }

            const neighbors = this.adjList[curr] || [];
            for (let neighbor of neighbors) {
                if (!visited.includes(neighbor)) {
                    visited.push(neighbor);
                    queue.push(neighbor);
                    parentMap[neighbor] = curr;
                    engine.addStep({
                        visited: [...visited],
                        activeNode: curr,
                        activeEdges: [...edgesToRender, `${curr}-${neighbor}`],
                        structureName: 'BFS Queue',
                        structureData: [...queue]
                    }, `Neighbor ${neighbor} not visited. Marking visited and adding to Queue.`);
                }
            }
        }

        engine.addStep({
            visited: [...visited],
            activeNode: null,
            activeEdges: [...activeEdges],
            structureName: 'BFS Queue',
            structureData: []
        }, `BFS Traversal completed! Visited path: ${visited.join(' -> ')}`, 'success');

        engine.play();
    },

    runDFS(startNode) {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderGraph(snap);

        const visited = [];
        const stack = [startNode];
        const activeEdges = [];
        const parentMap = {};

        engine.addStep({
            visited: [],
            activeNode: null,
            activeEdges: [],
            structureName: 'DFS Stack',
            structureData: [...stack]
        }, `Initialized DFS starting at node ${startNode}`);

        while (stack.length > 0) {
            const curr = stack.pop();

            if (!visited.includes(curr)) {
                visited.push(curr);
                
                const edgesToRender = [...activeEdges];
                if (parentMap[curr] !== undefined) {
                    edgesToRender.push(`${parentMap[curr]}-${curr}`);
                    activeEdges.push(`${parentMap[curr]}-${curr}`);
                }

                engine.addStep({
                    visited: [...visited],
                    activeNode: curr,
                    activeEdges: edgesToRender,
                    structureName: 'DFS Stack',
                    structureData: [...stack]
                }, `Visited Node ${curr} popped from Stack`, 'success');

                const neighbors = this.adjList[curr] || [];
                // Push neighbors to stack in reverse order so we visit them in index order
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    const neighbor = neighbors[i];
                    if (!visited.includes(neighbor)) {
                        stack.push(neighbor);
                        parentMap[neighbor] = curr;
                        engine.addStep({
                            visited: [...visited],
                            activeNode: curr,
                            activeEdges: [...edgesToRender],
                            structureName: 'DFS Stack',
                            structureData: [...stack]
                        }, `Neighbor ${neighbor} not visited yet. Push to Stack.`);
                    }
                }
            }
        }

        engine.addStep({
            visited: [...visited],
            activeNode: null,
            activeEdges: [...activeEdges],
            structureName: 'DFS Stack',
            structureData: []
        }, `DFS Traversal completed! Visited path: ${visited.join(' -> ')}`, 'success');

        engine.play();
    }
};
