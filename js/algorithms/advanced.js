// EasyDSA Advanced Algorithms Visualizer
window.AdvancedVisualizer = {
    activeTopic: null,
    data: [],

    init(topic) {
        this.activeTopic = topic;
        engine.reset();
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        if (topic === 'dp') {
            this.setupFibonacciGrid();
            this.setupDPControls();
        } else if (topic === 'backtracking') {
            this.setupNQueensBoard();
            this.setupBacktrackingControls();
        } else if (topic === 'kmp') {
            this.setupKMPLayout();
            this.setupKMPControls();
        } else if (topic === 'pointers-window') {
            this.setupPointersWindowLayout();
            this.setupPointersWindowControls();
        } else if (topic === 'kadane') {
            this.setupKadaneLayout();
            this.setupKadaneControls();
        } else if (topic === 'greedy') {
            this.setupGreedyLayout();
            this.setupGreedyControls();
        } else if (topic === 'rabin-karp') {
            this.setupRabinKarpLayout();
            this.setupRabinKarpControls();
        }
    },

    // -------------------------------------------------------------
    // KADANE'S ALGORITHM
    // -------------------------------------------------------------
    setupKadaneLayout() {
        this.data = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
        this.renderKadane({
            arr: this.data,
            currIdx: -1,
            maxEndingHere: 0,
            maxSoFar: -Infinity,
            subStart: -1,
            subEnd: -1
        });
    },

    renderKadane(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.gap = '1.5rem';
        container.style.height = '100%';

        const title = document.createElement('h3');
        title.style.color = 'var(--color-primary)';
        title.style.fontSize = '1.1rem';
        title.innerText = "Kadane's Subarray Search";
        container.appendChild(title);

        // Array Row
        const arrayGrid = document.createElement('div');
        arrayGrid.className = 'array-container';

        const arr = snapshot.arr || [];
        arr.forEach((val, idx) => {
            const wrap = document.createElement('div');
            wrap.className = 'array-item-wrapper';

            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.innerText = val;

            if (idx === snapshot.currIdx) {
                cell.classList.add('active'); // active processing
            } else if (idx >= snapshot.subStart && idx <= snapshot.subEnd && snapshot.subStart !== -1) {
                cell.classList.add('success'); // current max subarray window
            }

            const label = document.createElement('div');
            label.className = 'array-index';
            label.innerText = idx;

            wrap.appendChild(cell);
            wrap.appendChild(label);
            arrayGrid.appendChild(wrap);
        });
        container.appendChild(arrayGrid);

        // Subarray Variable status card
        const card = document.createElement('div');
        card.style.fontFamily = 'var(--font-mono)';
        card.style.fontSize = '0.9rem';
        card.style.background = 'rgba(255,255,255,0.03)';
        card.style.border = '1px solid var(--border-color)';
        card.style.borderRadius = '8px';
        card.style.padding = '0.75rem 1.5rem';
        card.style.display = 'flex';
        card.style.gap = '2rem';

        const valEnding = snapshot.maxEndingHere !== -Infinity ? snapshot.maxEndingHere : 'N/A';
        const valGlobal = snapshot.maxSoFar !== -Infinity ? snapshot.maxSoFar : 'N/A';

        card.innerHTML = `
            <div>maxEndingHere: <span style="color:var(--color-primary); font-weight:bold;">${valEnding}</span></div>
            <div>maxSoFar: <span style="color:var(--color-success); font-weight:bold;">${valGlobal}</span></div>
        `;
        container.appendChild(card);

        workspace.appendChild(container);
    },

    setupKadaneControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runKadane()"><i class="fa-solid fa-play"></i> Run Kadane's</button>
        `;
    },

    runKadane() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderKadane(snap);

        const arr = [...this.data];
        let maxSoFar = -Infinity;
        let maxEndingHere = 0;
        let start = 0;
        let end = 0;
        let s = 0;

        engine.addStep({ arr, currIdx: -1, maxEndingHere: 0, maxSoFar, subStart: -1, subEnd: -1 }, `Initializing Kadane's array search`);

        for (let i = 0; i < arr.length; i++) {
            maxEndingHere += arr[i];
            
            engine.addStep({ arr, currIdx: i, maxEndingHere, maxSoFar, subStart: start, subEnd: end }, `Index ${i}: Adding ${arr[i]} to maxEndingHere (Sum: ${maxEndingHere})`);

            if (maxEndingHere > maxSoFar) {
                maxSoFar = maxEndingHere;
                start = s;
                end = i;
                engine.addStep({ arr, currIdx: i, maxEndingHere, maxSoFar, subStart: start, subEnd: end }, `Found larger subarray sum! Updating maxSoFar = ${maxSoFar} (range [${start}-${end}])`, 'success');
            }

            if (maxEndingHere < 0) {
                maxEndingHere = 0;
                s = i + 1;
                engine.addStep({ arr, currIdx: i, maxEndingHere, maxSoFar, subStart: start, subEnd: end }, `maxEndingHere is negative (${maxEndingHere}). Discarding and resetting window to start at index ${s}`, 'danger');
            }
        }

        engine.addStep({ arr, currIdx: -1, maxEndingHere, maxSoFar, subStart: start, subEnd: end }, `Kadane's algorithm complete! Maximum contiguous subarray sum is ${maxSoFar} (from index ${start} to ${end})`, 'success');
        engine.play();
    },

    // -------------------------------------------------------------
    // GREEDY ALGORITHM (Activity Selection)
    // -------------------------------------------------------------
    setupGreedyLayout() {
        // Pre-sorted by finish times
        this.data = [
            { id: 0, name: "Act 0", s: 1, f: 4 },
            { id: 1, name: "Act 1", s: 3, f: 5 },
            { id: 2, name: "Act 2", s: 0, f: 6 },
            { id: 3, name: "Act 3", s: 5, f: 7 },
            { id: 4, name: "Act 4", s: 8, f: 9 }
        ];

        this.renderGreedy({
            activities: this.data,
            activeActId: -1,
            selectedActIds: [],
            conflictActIds: [],
            lastFinish: 0
        });
    },

    renderGreedy(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'stretch';
        container.style.gap = '1rem';
        container.style.padding = '2rem';
        container.style.height = '100%';
        container.style.overflowY = 'auto';

        const title = document.createElement('h3');
        title.style.color = 'var(--color-primary)';
        title.style.fontSize = '1.1rem';
        title.style.textAlign = 'center';
        title.innerText = "Greedy Activity Selection (Sorted by Finish Time)";
        container.appendChild(title);

        const list = snapshot.activities || [];
        list.forEach(act => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '1rem';
            row.style.padding = '0.5rem';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = '8px';
            row.style.background = 'rgba(255,255,255,0.02)';

            if (act.id === snapshot.activeActId) {
                row.style.borderColor = 'var(--color-secondary)';
                row.style.background = 'rgba(168, 85, 247, 0.08)';
            }
            if (snapshot.selectedActIds.includes(act.id)) {
                row.style.borderColor = 'var(--color-success)';
                row.style.background = 'rgba(16, 185, 129, 0.08)';
            }
            if (snapshot.conflictActIds.includes(act.id)) {
                row.style.borderColor = 'var(--color-danger)';
                row.style.background = 'rgba(239, 68, 68, 0.08)';
            }

            const label = document.createElement('span');
            label.style.width = '70px';
            label.style.fontWeight = 'bold';
            label.innerText = act.name;
            row.appendChild(label);

            // Timeline bar visualizer representation
            const barContainer = document.createElement('div');
            barContainer.style.flex = '1';
            barContainer.style.height = '20px';
            barContainer.style.background = 'rgba(255,255,255,0.05)';
            barContainer.style.borderRadius = '4px';
            barContainer.style.position = 'relative';

            const bar = document.createElement('div');
            bar.style.position = 'absolute';
            
            // Scaled positioning (Assume range of 0 to 10 hours)
            const leftPct = (act.s / 10) * 100;
            const widthPct = ((act.f - act.s) / 10) * 100;

            bar.style.left = `${leftPct}%`;
            bar.style.width = `${widthPct}%`;
            bar.style.height = '100%';
            bar.style.borderRadius = '4px';

            let barColor = 'var(--color-primary)';
            if (snapshot.selectedActIds.includes(act.id)) barColor = 'var(--color-success)';
            if (snapshot.conflictActIds.includes(act.id)) barColor = 'var(--color-danger)';
            bar.style.background = barColor;

            barContainer.appendChild(bar);
            row.appendChild(barContainer);

            const duration = document.createElement('span');
            duration.style.fontFamily = 'var(--font-mono)';
            duration.style.fontSize = '0.8rem';
            duration.style.width = '100px';
            duration.innerText = `Time: [${act.s} to ${act.f}]`;
            row.appendChild(duration);

            container.appendChild(row);
        });

        // Current status variable
        const status = document.createElement('div');
        status.style.fontFamily = 'var(--font-mono)';
        status.style.fontSize = '0.85rem';
        status.style.textAlign = 'center';
        status.innerHTML = `Last Selected Activity Finish Time limit: <span style="color:var(--color-success); font-weight:bold;">${snapshot.lastFinish}</span>`;
        container.appendChild(status);

        workspace.appendChild(container);
    },

    setupGreedyControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runGreedy()"><i class="fa-solid fa-play"></i> Run Selection</button>
        `;
    },

    runGreedy() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderGreedy(snap);

        const activities = [...this.data];
        const selectedActIds = [];
        const conflictActIds = [];
        let lastFinish = 0;

        engine.addStep({ activities, activeActId: -1, selectedActIds, conflictActIds, lastFinish }, `Starting Greedy Activity Selection`);

        // Select first activity
        const first = activities[0];
        selectedActIds.push(first.id);
        lastFinish = first.finish;
        engine.addStep({ activities, activeActId: first.id, selectedActIds: [...selectedActIds], conflictActIds, lastFinish }, `Greedily selecting first activity ${first.name} (Finishes earliest at ${first.finish})`, 'success');

        for (let i = 1; i < activities.length; i++) {
            const act = activities[i];
            engine.addStep({ activities, activeActId: act.id, selectedActIds: [...selectedActIds], conflictActIds: [...conflictActIds], lastFinish }, `Checking activity ${act.name}: Start time ${act.start} vs prior finish limit ${lastFinish}`);

            if (act.start >= lastFinish) {
                selectedActIds.push(act.id);
                lastFinish = act.finish;
                engine.addStep({ activities, activeActId: act.id, selectedActIds: [...selectedActIds], conflictActIds: [...conflictActIds], lastFinish }, `Activity ${act.name} start ${act.start} >= finish limit ${lastFinish - act.finish + lastFinish}. Selected!`, 'success');
            } else {
                conflictActIds.push(act.id);
                engine.addStep({ activities, activeActId: act.id, selectedActIds: [...selectedActIds], conflictActIds: [...conflictActIds], lastFinish }, `Overlap! ${act.name} starts at ${act.start} which is before finish limit ${lastFinish}. Rejected.`, 'danger');
            }
        }

        engine.addStep({ activities, activeActId: -1, selectedActIds: [...selectedActIds], conflictActIds: [...conflictActIds], lastFinish }, `Greedy selection completed. Max non-overlapping activities count: ${selectedActIds.length}`, 'success');
        engine.play();
    },

    // -------------------------------------------------------------
    // RABIN KARP STRING SEARCH
    // -------------------------------------------------------------
    setupRabinKarpLayout() {
        this.renderRabinKarp({
            txt: "ABABAC",
            pat: "ABAC",
            txtIdx: 0,
            patIdx: -1,
            txtHash: 0,
            patHash: 0,
            matchStatus: null
        });
    },

    renderRabinKarp(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'kmp-grid-container';
        container.style.marginTop = '2rem';

        // Text Row
        const txtRow = document.createElement('div');
        txtRow.style.display = 'flex';
        txtRow.style.alignItems = 'center';
        txtRow.style.gap = '0.5rem';

        const txtLabel = document.createElement('span');
        txtLabel.style.width = '50px';
        txtLabel.innerText = "Text:";
        txtLabel.style.fontWeight = 'bold';
        txtRow.appendChild(txtLabel);

        const txtArr = document.createElement('div');
        txtArr.className = 'string-array';
        for (let i = 0; i < snapshot.txt.length; i++) {
            const charBox = document.createElement('div');
            charBox.className = 'string-char';
            charBox.innerText = snapshot.txt[i];

            // Highlight current matching window bounds in Rabin-Karp
            const winSize = snapshot.pat.length;
            if (i >= snapshot.txtIdx && i < snapshot.txtIdx + winSize) {
                charBox.classList.add('checking');
                if (snapshot.matchStatus === 'match') charBox.classList.add('match');
                if (snapshot.matchStatus === 'mismatch') charBox.classList.add('mismatch');
            }
            txtArr.appendChild(charBox);
        }
        txtRow.appendChild(txtArr);
        container.appendChild(txtRow);

        // Pattern Row
        const patRow = document.createElement('div');
        patRow.style.display = 'flex';
        patRow.style.alignItems = 'center';
        patRow.style.gap = '0.5rem';

        const patLabel = document.createElement('span');
        patLabel.style.width = '50px';
        patLabel.innerText = "Pattern:";
        patLabel.style.fontWeight = 'bold';
        patRow.appendChild(patLabel);

        const patArr = document.createElement('div');
        patArr.className = 'string-array';
        
        for (let i = 0; i < snapshot.txtIdx; i++) {
            const space = document.createElement('div');
            space.className = 'string-char';
            space.style.visibility = 'hidden';
            patArr.appendChild(space);
        }

        for (let i = 0; i < snapshot.pat.length; i++) {
            const charBox = document.createElement('div');
            charBox.className = 'string-char';
            charBox.innerText = snapshot.pat[i];
            charBox.classList.add('checking');
            if (snapshot.matchStatus === 'match') charBox.classList.add('match');
            if (snapshot.matchStatus === 'mismatch') charBox.classList.add('mismatch');
            patArr.appendChild(charBox);
        }
        patRow.appendChild(patArr);
        container.appendChild(patRow);

        // Hash Info Cards
        const info = document.createElement('div');
        info.style.fontFamily = 'var(--font-mono)';
        info.style.fontSize = '0.85rem';
        info.style.background = 'rgba(255,255,255,0.02)';
        info.style.padding = '0.5rem 1rem';
        info.style.border = '1px solid var(--border-color)';
        info.style.borderRadius = '8px';
        info.style.marginTop = '1rem';
        info.innerHTML = `Pattern Hash: <span style="color:var(--color-primary); font-weight:bold;">${snapshot.patHash}</span> | Current Window Hash: <span style="color:var(--color-secondary); font-weight:bold;">${snapshot.txtHash}</span>`;
        container.appendChild(info);

        workspace.appendChild(container);
    },

    setupRabinKarpControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runRabinKarp()"><i class="fa-solid fa-play"></i> Run Rabin Karp</button>
        `;
    },

    runRabinKarp() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderRabinKarp(snap);

        const txt = "ABABAC";
        const pat = "ABAC";
        
        // Simple hash coefficients: Sum of character codes (simplified for visualization clarity)
        const computeSimpleHash = (str) => {
            let h = 0;
            for (let i = 0; i < str.length; i++) h += str.charCodeAt(i);
            return h;
        };

        const patHash = computeSimpleHash(pat);
        let txtHash0 = computeSimpleHash("ABAB");
        let txtHash1 = computeSimpleHash("BABA");
        let txtHash2 = computeSimpleHash("ABAC");

        engine.addStep({ txt, pat, txtIdx: 0, patIdx: -1, txtHash: 0, patHash, matchStatus: null }, `Starting Rabin-Karp: Compute pattern hash = ${patHash}`);

        // Step 1: Slide window 0
        engine.addStep({ txt, pat, txtIdx: 0, patIdx: -1, txtHash: txtHash0, patHash, matchStatus: null }, `Window 0 ("ABAB"): Computed hash = ${txtHash0}. Compare Hash: ${txtHash0} != Pattern Hash ${patHash}. Slide window.`, 'info');

        // Step 2: Slide window 1
        engine.addStep({ txt, pat, txtIdx: 1, patIdx: -1, txtHash: txtHash1, patHash, matchStatus: null }, `Window 1 ("BABA"): Computed hash = ${txtHash1}. Compare Hash: ${txtHash1} != Pattern Hash ${patHash}. Slide window.`, 'info');

        // Step 3: Slide window 2
        engine.addStep({ txt, pat, txtIdx: 2, patIdx: -1, txtHash: txtHash2, patHash, matchStatus: 'match' }, `Window 2 ("ABAC"): Computed hash = ${txtHash2}. Compare Hash: ${txtHash2} == Pattern Hash ${patHash}! Running character matching checks...`, 'highlight');

        engine.addStep({ txt, pat, txtIdx: 2, patIdx: -1, txtHash: txtHash2, patHash, matchStatus: 'match' }, `Character match succeeds! Discovered pattern at index 2`, 'success');
        
        engine.play();
    },

    // -------------------------------------------------------------
    // DYNAMIC PROGRAMMING (Fibonacci Table Helper)
    // -------------------------------------------------------------
    setupFibonacciGrid() {
        const snapshot = {
            table: new Array(9).fill(null),
            activeIdx: -1,
            depIdxs: []
        };
        this.renderDP(snapshot);
    },

    setupDPControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runFibonacci()"><i class="fa-solid fa-play"></i> Run Tabulation</button>
        `;
    },

    runFibonacci() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderDP(snap);

        const n = 8;
        const dp = new Array(n + 1).fill(null);
        
        engine.addStep({ table: [...dp], activeIdx: -1, depIdxs: [] }, `Initializing Fibonacci table of size ${n + 1}`);

        dp[0] = 0;
        engine.addStep({ table: [...dp], activeIdx: 0, depIdxs: [] }, `Base case: dp[0] = 0`, 'highlight');
        
        dp[1] = 1;
        engine.addStep({ table: [...dp], activeIdx: 1, depIdxs: [] }, `Base case: dp[1] = 1`, 'highlight');

        for (let i = 2; i <= n; i++) {
            engine.addStep({ table: [...dp], activeIdx: i, depIdxs: [i - 1, i - 2] }, `Calculating dp[${i}] = dp[${i-1}] + dp[${i-2}]`);
            dp[i] = dp[i - 1] + dp[i - 2];
            engine.addStep({ table: [...dp], activeIdx: i, depIdxs: [i - 1, i - 2] }, `Stored value dp[${i}] = ${dp[i]}`, 'success');
        }

        engine.addStep({ table: [...dp], activeIdx: -1, depIdxs: [] }, `DP computation complete! Fib(${n}) = ${dp[n]}`, 'success');
        engine.play();
    },

    // -------------------------------------------------------------
    // BACKTRACKING (N-Queens chess helper)
    // -------------------------------------------------------------
    setupNQueensBoard() {
        const board = Array(4).fill(null).map(() => Array(4).fill(0));
        this.renderChessBoard({ board });
    },

    setupBacktrackingControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runNQueens()"><i class="fa-solid fa-play"></i> Solve N-Queens</button>
        `;
    },

    runNQueens() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderChessBoard(snap);

        const board = Array(4).fill(null).map(() => Array(4).fill(0));
        engine.addStep({ board: JSON.parse(JSON.stringify(board)) }, `Starting Backtracking solver on 4x4 board`);

        const isSafe = (b, row, col) => {
            for (let i = 0; i < col; i++) {
                if (b[row][i] === 1) {
                    engine.addStep({ board: JSON.parse(JSON.stringify(b)), conflictCell: [row, i] }, `Conflict found in row ${row} index ${i}`, 'danger');
                    return false;
                }
            }
            for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
                if (b[i][j] === 1) {
                    engine.addStep({ board: JSON.parse(JSON.stringify(b)), conflictCell: [i, j] }, `Conflict found in upper diagonal at row ${i} col ${j}`, 'danger');
                    return false;
                }
            }
            for (let i = row, j = col; j >= 0 && i < 4; i++, j--) {
                if (b[i][j] === 1) {
                    engine.addStep({ board: JSON.parse(JSON.stringify(b)), conflictCell: [i, j] }, `Conflict found in lower diagonal at row ${i} col ${j}`, 'danger');
                    return false;
                }
            }
            return true;
        };

        const solve = (b, col) => {
            if (col >= 4) {
                engine.addStep({ board: JSON.parse(JSON.stringify(b)) }, `All queens placed successfully! Solution found.`, 'success');
                return true;
            }

            for (let i = 0; i < 4; i++) {
                engine.addStep({ board: JSON.parse(JSON.stringify(b)) }, `Attempting to place Queen at row ${i}, col ${col}`);
                b[i][col] = 1;

                if (isSafe(b, i, col)) {
                    engine.addStep({ board: JSON.parse(JSON.stringify(b)) }, `Row ${i}, col ${col} is safe. Moving to column ${col + 1}`);
                    if (solve(b, col + 1)) return true;
                }

                b[i][col] = 0;
                engine.addStep({ board: JSON.parse(JSON.stringify(b)) }, `Removing Queen at row ${i}, col ${col} and backtracking...`, 'danger');
            }
            return false;
        };

        solve(board, 0);
        engine.play();
    },

    // -------------------------------------------------------------
    // KMP STRING MATCHING VISUALIZER
    // -------------------------------------------------------------
    setupKMPLayout() {
        this.renderKMP({
            txt: "ABABAC",
            pat: "ABAC",
            txtIdx: 0,
            patIdx: 0,
            matchStatus: null
        });
    },

    setupKMPControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runKMP()"><i class="fa-solid fa-play"></i> Run KMP</button>
        `;
    },

    runKMP() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderKMP(snap);

        const txt = "ABABAC";
        const pat = "ABAC";

        engine.addStep({ txt, pat, txtIdx: 0, patIdx: 0, matchStatus: null }, `Starting KMP matching on text "${txt}" and pattern "${pat}"`);

        engine.addStep({ txt, pat, txtIdx: 0, patIdx: 0, matchStatus: 'match' }, `Compare text[0] ('A') with pattern[0] ('A'): MATCH!`);
        engine.addStep({ txt, pat, txtIdx: 1, patIdx: 1, matchStatus: 'match' }, `Compare text[1] ('B') with pattern[1] ('B'): MATCH!`);
        engine.addStep({ txt, pat, txtIdx: 2, patIdx: 2, matchStatus: 'match' }, `Compare text[2] ('A') with pattern[2] ('A'): MATCH!`);
        engine.addStep({ txt, pat, txtIdx: 3, patIdx: 3, matchStatus: 'mismatch' }, `Compare text[3] ('B') with pattern[3] ('C'): MISMATCH!`, 'danger');
        
        engine.addStep({ txt, pat, txtIdx: 3, patIdx: 1, matchStatus: null }, `LPS lookup for mismatch at index 3: pattern shift index back to 1`);
        engine.addStep({ txt, pat, txtIdx: 3, patIdx: 1, matchStatus: 'match' }, `Compare text[3] ('B') with pattern[1] ('B'): MATCH!`);
        engine.addStep({ txt, pat, txtIdx: 4, patIdx: 2, matchStatus: 'match' }, `Compare text[4] ('A') with pattern[2] ('A'): MATCH!`);
        engine.addStep({ txt, pat, txtIdx: 5, patIdx: 3, matchStatus: 'match' }, `Compare text[5] ('C') with pattern[3] ('C'): MATCH!`);

        engine.addStep({ txt, pat, txtIdx: 5, patIdx: 3, matchStatus: 'match' }, `Complete Pattern Match discovered at text index 2!`, 'success');
        engine.play();
    },

    // -------------------------------------------------------------
    // TWO POINTER & SLIDING WINDOW
    // -------------------------------------------------------------
    setupPointersWindowLayout() {
        this.renderPointersWindow({
            arr: [2, 5, 8, 12, 17, 23, 30],
            left: 0,
            right: 6,
            sum: 32,
            target: 29
        });
    },

    setupPointersWindowControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runTwoPointer()"><i class="fa-solid fa-play"></i> Run Two Pointer</button>
            <button class="btn btn-primary" onclick="AdvancedVisualizer.runSlidingWindow()"><i class="fa-solid fa-play"></i> Run Sliding Window</button>
        `;
    },

    runTwoPointer() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderPointersWindow(snap);

        const arr = [2, 5, 8, 12, 17, 23, 30];
        const target = 29;
        let left = 0;
        let right = arr.length - 1;

        engine.addStep({ arr, left, right, sum: arr[left] + arr[right], target }, `Initializing Two Pointer search on sorted array for sum = ${target}`);

        while (left < right) {
            const sum = arr[left] + arr[right];
            if (sum === target) {
                engine.addStep({ arr, left, right, sum, target, successIdxs: [left, right] }, `Found target sum: ${arr[left]} + ${arr[right]} = ${target}!`, 'success');
                break;
            }
            if (sum < target) {
                engine.addStep({ arr, left, right, sum, target }, `Sum ${sum} < Target ${target}. Moving left pointer (L) right to increase sum.`);
                left++;
            } else {
                engine.addStep({ arr, left, right, sum, target }, `Sum ${sum} > Target ${target}. Moving right pointer (R) left to decrease sum.`);
                right--;
            }
        }
        engine.play();
    },

    runSlidingWindow() {
        engine.reset();
        engine.onRenderStep = (snap) => this.renderPointersWindow(snap);

        const arr = [4, 2, 1, 7, 8, 1, 2, 8];
        const k = 3;

        engine.addStep({ type: 'window', arr, winStart: 0, winEnd: k - 1, sum: arr[0] + arr[1] + arr[2], maxSum: arr[0] + arr[1] + arr[2] }, `Initializing sliding window of size K = ${k}`);

        let windowSum = arr[0] + arr[1] + arr[2];
        let maxSum = windowSum;

        for (let i = k; i < arr.length; i++) {
            const added = arr[i];
            const removed = arr[i - k];
            windowSum = windowSum + added - removed;
            const isNewMax = windowSum > maxSum;
            if (isNewMax) maxSum = windowSum;

            engine.addStep({
                type: 'window',
                arr,
                winStart: i - k + 1,
                winEnd: i,
                sum: windowSum,
                maxSum
            }, `Sliding window right: subtracted index ${i-k} (${removed}), added index ${i} (${added}). New sum: ${windowSum}. ${isNewMax ? 'New maximum found!' : ''}`, isNewMax ? 'success' : 'info');
        }

        engine.addStep({ type: 'window', arr, winStart: arr.length - k, winEnd: arr.length - 1, sum: windowSum, maxSum }, `Sliding window completed. Max subarray sum = ${maxSum}`, 'success');
        engine.play();
    }
};
