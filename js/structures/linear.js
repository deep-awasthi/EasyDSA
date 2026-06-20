// EasyDSA Linear Structures Visualizer
window.LinearVisualizer = {
    data: [], // Current active data representation

    init(topic) {
        engine.reset();
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        // Setup initial default arrays/lists
        if (topic === 'arrays') {
            this.data = [12, 24, 45, 7, 19, 32];
            this.renderArray({ data: this.data });
            this.setupArrayControls();
        } else if (topic === 'stack') {
            this.data = [15, 30, 45];
            this.renderStack({ data: this.data });
            this.setupStackControls();
        } else if (topic === 'queue') {
            this.data = [10, 20, 30, 40];
            this.renderQueue({ data: this.data });
            this.setupQueueControls();
        } else if (topic === 'deque') {
            this.data = [10, 20, 30];
            this.renderDeque({ data: this.data });
            this.setupDequeControls();
        } else if (topic === 'linkedlist') {
            this.data = [10, 20, 30, 40];
            this.renderLinkedList({ data: this.data, type: 'single' });
            this.setupLinkedListControls('linkedlist');
        } else if (topic === 'doublylinkedlist') {
            this.data = [10, 20, 30, 40];
            this.renderLinkedList({ data: this.data, type: 'double' });
            this.setupLinkedListControls('doublylinkedlist');
        } else if (topic === 'circularlinkedlist') {
            this.data = [10, 20, 30, 40];
            this.renderLinkedList({ data: this.data, type: 'circular' });
            this.setupLinkedListControls('circularlinkedlist');
        }
    },

    // Rendering functions
    renderArray(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'array-container';
        
        const arr = snapshot.data || [];
        arr.forEach((val, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'array-item-wrapper';
            
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.innerText = val;
            
            if (snapshot.highlightIndex === idx) cell.classList.add('highlight');
            if (snapshot.activeIndex === idx) cell.classList.add('active');
            if (snapshot.successIndex === idx) cell.classList.add('success');
            if (snapshot.dangerIndex === idx) cell.classList.add('danger');
            
            const index = document.createElement('div');
            index.className = 'array-index';
            index.innerText = idx;
            
            wrapper.appendChild(cell);
            wrapper.appendChild(index);
            container.appendChild(wrapper);
        });
        
        workspace.appendChild(container);
    },

    renderStack(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'recursion-container'; // Stack container style
        container.style.height = '85%';
        container.style.width = '240px';
        container.style.margin = '0 auto';
        
        const arr = snapshot.data || [];
        arr.forEach((val, idx) => {
            const frame = document.createElement('div');
            frame.className = 'stack-frame';
            frame.innerHTML = `Value: <span style="color: var(--color-primary); font-weight: bold;">${val}</span>`;
            
            if (idx === arr.length - 1) {
                frame.classList.add('active');
                frame.innerHTML += ' <span style="font-size:0.65rem; color:var(--color-secondary); font-weight:bold;">[Top]</span>';
            }
            container.appendChild(frame);
        });
        
        workspace.appendChild(container);
    },

    renderQueue(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const outer = document.createElement('div');
        outer.style.display = 'flex';
        outer.style.flexDirection = 'column';
        outer.style.alignItems = 'center';
        outer.style.justifyContent = 'center';
        outer.style.width = '100%';
        outer.style.height = '100%';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.borderTop = '3px solid var(--border-color)';
        container.style.borderBottom = '3px solid var(--border-color)';
        container.style.padding = '1.5rem 0.5rem';
        container.style.gap = '0.5rem';
        container.style.minWidth = '300px';
        container.style.justifyContent = 'center';

        const arr = snapshot.data || [];
        arr.forEach((val, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'array-item-wrapper';
            
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.innerText = val;
            
            if (idx === 0) {
                cell.classList.add('highlight'); // Front of Queue
                const lbl = document.createElement('div');
                lbl.className = 'pointer-marker pointer-left';
                lbl.innerText = 'Front';
                cell.appendChild(lbl);
            }
            if (idx === arr.length - 1 && arr.length > 1) {
                cell.classList.add('active'); // Rear of Queue
                const lbl = document.createElement('div');
                lbl.className = 'pointer-marker pointer-right';
                lbl.innerText = 'Rear';
                cell.appendChild(lbl);
            }
            
            wrapper.appendChild(cell);
            container.appendChild(wrapper);
        });
        
        outer.appendChild(container);
        workspace.appendChild(outer);
    },

    renderDeque(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const outer = document.createElement('div');
        outer.style.display = 'flex';
        outer.style.flexDirection = 'column';
        outer.style.alignItems = 'center';
        outer.style.justifyContent = 'center';
        outer.style.width = '100%';
        outer.style.height = '100%';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.border = '3px dashed var(--border-color)';
        container.style.borderRadius = '12px';
        container.style.padding = '1.5rem 0.5rem';
        container.style.gap = '0.5rem';
        container.style.minWidth = '300px';
        container.style.justifyContent = 'center';

        const arr = snapshot.data || [];
        arr.forEach((val, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'array-item-wrapper';
            
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.innerText = val;
            
            if (idx === 0) {
                cell.classList.add('highlight');
                const lbl = document.createElement('div');
                lbl.className = 'pointer-marker pointer-left';
                lbl.innerText = 'Front';
                cell.appendChild(lbl);
            }
            if (idx === arr.length - 1 && arr.length > 1) {
                cell.classList.add('active');
                const lbl = document.createElement('div');
                lbl.className = 'pointer-marker pointer-right';
                lbl.innerText = 'Back';
                cell.appendChild(lbl);
            }
            
            wrapper.appendChild(cell);
            container.appendChild(wrapper);
        });
        
        outer.appendChild(container);
        workspace.appendChild(outer);
    },

    renderLinkedList(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'list-container';
        
        const arr = snapshot.data || [];
        const type = snapshot.type || 'single';
        
        arr.forEach((val, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'node-wrapper';
            
            const node = document.createElement('div');
            node.className = 'list-node';
            
            if (snapshot.highlightIndex === idx) node.classList.add('highlight');
            if (snapshot.activeIndex === idx) node.classList.add('active');
            
            const valDiv = document.createElement('div');
            valDiv.className = 'node-val';
            valDiv.innerText = val;
            node.appendChild(valDiv);
            
            if (type === 'double') {
                const prevDiv = document.createElement('div');
                prevDiv.className = 'node-ptr-double';
                prevDiv.innerText = idx === 0 ? 'Ø' : '•';
                node.insertBefore(prevDiv, valDiv);
            }
            
            const nextDiv = document.createElement('div');
            nextDiv.className = 'node-ptr';
            
            if (type === 'circular' && idx === arr.length - 1) {
                nextDiv.innerText = '↺';
            } else {
                nextDiv.innerText = idx === arr.length - 1 ? 'Ø' : '•';
            }
            node.appendChild(nextDiv);
            wrapper.appendChild(node);
            
            // Add arrows between nodes
            if (idx < arr.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'node-arrow';
                if (type === 'double') {
                    arrow.className += ' double-arrow';
                    arrow.innerHTML = '<i class="fa-solid fa-arrows-left-right"></i>';
                } else {
                    arrow.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
                }
                wrapper.appendChild(arrow);
            } else if (type === 'circular' && arr.length > 1) {
                // Render custom circular pointer indicator
                const arrow = document.createElement('div');
                arrow.className = 'node-arrow circular-arrow';
                arrow.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
                wrapper.appendChild(arrow);
            }
            
            container.appendChild(wrapper);
        });
        
        workspace.appendChild(container);
    },

    // Controls setup functions
    setupArrayControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="arr-val" class="control-input" placeholder="Value (e.g. 50)">
            <input type="number" id="arr-idx" class="control-input" placeholder="Index (e.g. 2)">
            <button class="btn btn-primary" onclick="LinearVisualizer.runArrayInsert()"><i class="fa-solid fa-plus"></i> Insert</button>
            <button class="btn btn-danger" onclick="LinearVisualizer.runArrayDelete()"><i class="fa-solid fa-trash"></i> Delete</button>
            <button class="btn btn-secondary" onclick="LinearVisualizer.runArraySearch()"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
        `;
    },

    setupStackControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="stack-val" class="control-input" placeholder="Value">
            <button class="btn btn-primary" onclick="LinearVisualizer.runStackPush()"><i class="fa-solid fa-arrow-down-long"></i> Push</button>
            <button class="btn btn-danger" onclick="LinearVisualizer.runStackPop()"><i class="fa-solid fa-arrow-up-long"></i> Pop</button>
        `;
    },

    setupQueueControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="queue-val" class="control-input" placeholder="Value">
            <button class="btn btn-primary" onclick="LinearVisualizer.runQueueEnqueue()"><i class="fa-solid fa-right-to-bracket"></i> Enqueue</button>
            <button class="btn btn-danger" onclick="LinearVisualizer.runQueueDequeue()"><i class="fa-solid fa-right-from-bracket"></i> Dequeue</button>
        `;
    },

    setupDequeControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="deque-val" class="control-input" placeholder="Value">
            <button class="btn btn-primary" onclick="LinearVisualizer.runDequeInsertFront()"><i class="fa-solid fa-left-to-bracket"></i> Ins Front</button>
            <button class="btn btn-primary" onclick="LinearVisualizer.runDequeInsertLast()"><i class="fa-solid fa-right-to-bracket"></i> Ins Rear</button>
            <button class="btn btn-danger" onclick="LinearVisualizer.runDequeDeleteFront()"><i class="fa-solid fa-left-from-bracket"></i> Del Front</button>
            <button class="btn btn-danger" onclick="LinearVisualizer.runDequeDeleteLast()"><i class="fa-solid fa-right-from-bracket"></i> Del Rear</button>
        `;
    },

    setupLinkedListControls(type) {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="list-val" class="control-input" placeholder="Value">
            <button class="btn btn-primary" onclick="LinearVisualizer.runListInsert('${type}')"><i class="fa-solid fa-plus"></i> Insert First</button>
            <button class="btn btn-danger" onclick="LinearVisualizer.runListDelete('${type}')"><i class="fa-solid fa-trash"></i> Delete Node</button>
        `;
    },

    // Animations runner implementations
    runArrayInsert() {
        const valInput = document.getElementById('arr-val');
        const idxInput = document.getElementById('arr-idx');
        if (!valInput.value) return;
        
        const val = parseInt(valInput.value);
        const idx = idxInput.value === '' ? this.data.length : parseInt(idxInput.value);
        
        if (idx < 0 || idx > this.data.length) {
            engine.addLog("Index out of bounds!", "danger");
            return;
        }

        engine.reset();
        engine.onRenderStep = (snap) => this.renderArray(snap);

        // Step 1: Initial Array
        engine.addStep({ data: this.data }, `Starting Array Insert: Inserting ${val} at index ${idx}`);
        
        // Step 2: Highlight shift indices
        const temp = [...this.data];
        for (let i = temp.length; i > idx; i--) {
            engine.addStep({ data: [...temp], highlightIndex: i - 1 }, `Shifting element at index ${i-1} to index ${i}`);
            temp[i] = temp[i - 1];
        }
        
        // Step 3: Insert element
        temp[idx] = val;
        engine.addStep({ data: [...temp], activeIndex: idx }, `Placed ${val} at index ${idx}`);
        
        // Save back modified data
        this.data = temp;
        engine.play();
    },

    runArrayDelete() {
        const idxInput = document.getElementById('arr-idx');
        if (idxInput.value === '') return;
        const idx = parseInt(idxInput.value);
        
        if (idx < 0 || idx >= this.data.length) {
            engine.addLog("Index out of bounds!", "danger");
            return;
        }

        engine.reset();
        engine.onRenderStep = (snap) => this.renderArray(snap);
        
        engine.addStep({ data: this.data, highlightIndex: idx }, `Deleting element at index ${idx}`);
        
        const temp = [...this.data];
        for (let i = idx; i < temp.length - 1; i++) {
            engine.addStep({ data: [...temp], activeIndex: i + 1 }, `Shifting element from index ${i+1} to index ${i}`);
            temp[i] = temp[i + 1];
        }
        temp.pop();
        engine.addStep({ data: [...temp] }, `Successfully deleted element. New size is ${temp.length}`);
        
        this.data = temp;
        engine.play();
    },

    runArraySearch() {
        const valInput = document.getElementById('arr-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderArray(snap);
        engine.addStep({ data: this.data }, `Searching array for value ${val}`);

        let foundIdx = -1;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === val) {
                foundIdx = i;
                engine.addStep({ data: this.data, successIndex: i }, `Found matching element ${val} at index ${i}!`, 'success');
                break;
            } else {
                engine.addStep({ data: this.data, dangerIndex: i }, `Index ${i}: ${this.data[i]} != ${val}. Moving next.`, 'info');
            }
        }

        if (foundIdx === -1) {
            engine.addStep({ data: this.data }, `Search completed: value ${val} not found in array`, 'danger');
        }
        engine.play();
    },

    runStackPush() {
        const valInput = document.getElementById('stack-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderStack(snap);
        
        engine.addStep({ data: this.data }, `Pushing ${val} onto the Stack`);
        this.data.push(val);
        engine.addStep({ data: this.data }, `Value ${val} pushed to the top of the stack`, 'success');
        
        engine.play();
    },

    runStackPop() {
        if (this.data.length === 0) {
            engine.addLog("Stack Underflow: stack is empty", "danger");
            return;
        }

        engine.reset();
        engine.onRenderStep = (snap) => this.renderStack(snap);
        
        const topVal = this.data[this.data.length - 1];
        engine.addStep({ data: this.data }, `Popping top element (${topVal}) off the stack`);
        
        const popped = this.data.pop();
        engine.addStep({ data: this.data }, `Element ${popped} popped successfully`, 'success');
        
        engine.play();
    },

    runQueueEnqueue() {
        const valInput = document.getElementById('queue-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderQueue(snap);
        
        engine.addStep({ data: this.data }, `Adding ${val} to Queue rear`);
        this.data.push(val);
        engine.addStep({ data: this.data }, `Value ${val} enqueued successfully`, 'success');
        
        engine.play();
    },

    runQueueDequeue() {
        if (this.data.length === 0) {
            engine.addLog("Queue Underflow: queue is empty", "danger");
            return;
        }

        engine.reset();
        engine.onRenderStep = (snap) => this.renderQueue(snap);
        
        const frontVal = this.data[0];
        engine.addStep({ data: this.data }, `Removing front element (${frontVal}) from Queue`);
        
        const popped = this.data.shift();
        engine.addStep({ data: this.data }, `Value ${popped} dequeued successfully`, 'success');
        
        engine.play();
    },

    runDequeInsertFront() {
        const valInput = document.getElementById('deque-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderDeque(snap);
        
        engine.addStep({ data: this.data }, `Deque: Inserting ${val} at Front`);
        this.data.unshift(val);
        engine.addStep({ data: this.data }, `Value ${val} inserted at the front of Deque`, 'success');
        
        engine.play();
    },

    runDequeInsertLast() {
        const valInput = document.getElementById('deque-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderDeque(snap);
        
        engine.addStep({ data: this.data }, `Deque: Inserting ${val} at Rear`);
        this.data.push(val);
        engine.addStep({ data: this.data }, `Value ${val} inserted at the rear of Deque`, 'success');
        
        engine.play();
    },

    runDequeDeleteFront() {
        if (this.data.length === 0) {
            engine.addLog("Deque Underflow!", "danger");
            return;
        }
        engine.reset();
        engine.onRenderStep = (snap) => this.renderDeque(snap);
        
        const val = this.data[0];
        engine.addStep({ data: this.data }, `Deque: Removing front element (${val})`);
        this.data.shift();
        engine.addStep({ data: this.data }, `Successfully removed ${val} from Front`, 'success');
        
        engine.play();
    },

    runDequeDeleteLast() {
        if (this.data.length === 0) {
            engine.addLog("Deque Underflow!", "danger");
            return;
        }
        engine.reset();
        engine.onRenderStep = (snap) => this.renderDeque(snap);
        
        const val = this.data[this.data.length - 1];
        engine.addStep({ data: this.data }, `Deque: Removing rear element (${val})`);
        this.data.pop();
        engine.addStep({ data: this.data }, `Successfully removed ${val} from Rear`, 'success');
        
        engine.play();
    },

    runListInsert(type) {
        const valInput = document.getElementById('list-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderLinkedList(snap);
        
        const itemType = type === 'linkedlist' ? 'single' : (type === 'doublylinkedlist' ? 'double' : 'circular');
        
        engine.addStep({ data: this.data, type: itemType }, `Creating new node containing ${val}`);
        this.data.unshift(val);
        engine.addStep({ data: this.data, type: itemType, activeIndex: 0 }, `Connecting head to the new node`, 'success');
        
        engine.play();
    },

    runListDelete(type) {
        const valInput = document.getElementById('list-val');
        if (!valInput.value) return;
        const val = parseInt(valInput.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderLinkedList(snap);
        const itemType = type === 'linkedlist' ? 'single' : (type === 'doublylinkedlist' ? 'double' : 'circular');

        engine.addStep({ data: this.data, type: itemType }, `Searching list to delete value ${val}`);

        let idx = -1;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === val) {
                idx = i;
                engine.addStep({ data: this.data, type: itemType, activeIndex: i }, `Found node with value ${val} at index ${i}!`, 'highlight');
                break;
            } else {
                engine.addStep({ data: this.data, type: itemType, highlightIndex: i }, `Inspecting node index ${i}: value ${this.data[i]} != ${val}`);
            }
        }

        if (idx !== -1) {
            engine.addStep({ data: this.data, type: itemType, highlightIndex: idx }, `Bypassing node ${val} and updating pointer references`);
            this.data.splice(idx, 1);
            engine.addStep({ data: this.data, type: itemType }, `Successfully deleted node containing ${val}`, 'success');
        } else {
            engine.addStep({ data: this.data, type: itemType }, `Value ${val} not found in the list`, 'danger');
        }
        
        engine.play();
    }
};
