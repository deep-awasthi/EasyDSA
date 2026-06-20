// EasyDSA Recursion Stack Visualizer
window.RecursionVisualizer = {
    init() {
        engine.reset();
        this.renderStack({ frames: [] });
        this.setupRecursionControls();
    },

    renderStack(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.height = '100%';
        container.style.gap = '1.5rem';

        const title = document.createElement('h3');
        title.style.color = 'var(--color-primary)';
        title.style.fontSize = '1.1rem';
        title.innerText = 'Call Stack Frame Visualizer (Factorial)';
        container.appendChild(title);

        const stackBox = document.createElement('div');
        stackBox.className = 'recursion-container';
        stackBox.style.height = '70%';
        stackBox.style.width = '300px';

        const frames = snapshot.frames || [];
        frames.forEach((f, idx) => {
            const frame = document.createElement('div');
            frame.className = 'stack-frame';
            
            if (f.isReturning) {
                frame.classList.add('returning');
                frame.innerHTML = `${f.name} <i class="fa-solid fa-arrow-right"></i> <span style="color:var(--color-success); font-weight:bold;">${f.retVal}</span>`;
            } else {
                frame.innerHTML = `${f.name}`;
                if (idx === frames.length - 1) {
                    frame.classList.add('active');
                }
            }
            stackBox.appendChild(frame);
        });

        if (frames.length === 0) {
            stackBox.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem; margin:auto;">Stack is empty. Run factorial calculation.</span>`;
        }

        container.appendChild(stackBox);
        workspace.appendChild(container);
    },

    setupRecursionControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="rec-val" class="control-input" placeholder="N (e.g. 4)">
            <button class="btn btn-primary" onclick="RecursionVisualizer.runFactorial()"><i class="fa-solid fa-play"></i> Run Factorial</button>
        `;
    },

    runFactorial() {
        const input = document.getElementById('rec-val');
        if (!input.value) return;
        const n = Math.min(Math.max(parseInt(input.value), 1), 5); // Limit from 1 to 5 to fit layout stack depth

        engine.reset();
        engine.onRenderStep = (snap) => this.renderStack(snap);

        engine.addStep({ frames: [] }, `Starting Factorial recursive execution for n = ${n}`);

        const framesState = [];
        
        const fact = (val) => {
            const frameName = `factorial(${val})`;
            framesState.push({ name: frameName, isReturning: false });
            engine.addStep({ frames: [...framesState] }, `Pushing stack frame: ${frameName}`);

            if (val <= 1) {
                engine.addStep({ frames: [...framesState] }, `Reached base case: n <= 1. returning 1.`, 'highlight');
                framesState[framesState.length - 1] = { name: frameName, isReturning: true, retVal: 1 };
                engine.addStep({ frames: [...framesState] }, `Frame ${frameName} returning 1`, 'success');
                return 1;
            }

            engine.addStep({ frames: [...framesState] }, `Calling factorial(${val - 1}) recursively`);
            const subResult = fact(val - 1);
            
            const result = val * subResult;
            framesState.pop(); // Pop subResult frame visually
            framesState[framesState.length - 1] = { name: frameName, isReturning: true, retVal: result };
            engine.addStep({ frames: [...framesState] }, `Multiplying ${val} * factorial(${val - 1}) = ${result}. Frame returning ${result}`, 'success');
            return result;
        };

        const finalResult = fact(n);
        engine.addStep({ frames: [] }, `Recursion completed! Result factorial(${n}) = ${finalResult}`, 'success');
        
        engine.play();
    }
};
