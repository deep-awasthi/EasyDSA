// EasyDSA Searching Algorithms Visualizer
window.SearchingVisualizer = {
    data: [], // Sorted search data

    init() {
        engine.reset();
        // Generate pre-sorted dataset
        this.data = [10, 15, 22, 35, 40, 48, 55, 62, 70, 78, 83, 89, 92, 95, 99];
        this.renderArray({ data: this.data });
        this.setupSearchingControls();
    },

    renderArray(snapshot) {
        // Re-use standard linear array rendering
        LinearVisualizer.renderArray(snapshot);
    },

    setupSearchingControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <input type="number" id="search-target" class="control-input" placeholder="Target (e.g. 55)">
            <button class="btn btn-primary" onclick="SearchingVisualizer.runLinearSearch()"><i class="fa-solid fa-play"></i> Linear Search</button>
            <button class="btn btn-primary" onclick="SearchingVisualizer.runBinarySearch()"><i class="fa-solid fa-play"></i> Binary Search</button>
        `;
    },

    runLinearSearch() {
        const input = document.getElementById('search-target');
        if (!input.value) return;
        const target = parseInt(input.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderArray(snap);

        engine.addStep({ data: this.data }, `Starting Linear Search for target: ${target}`);

        let found = false;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === target) {
                found = true;
                engine.addStep({ data: this.data, successIndex: i }, `Target ${target} found at index ${i}!`, 'success');
                break;
            } else {
                engine.addStep({ data: this.data, dangerIndex: i }, `Index ${i}: ${this.data[i]} != ${target}. Checking next.`, 'info');
            }
        }

        if (!found) {
            engine.addStep({ data: this.data }, `Linear Search completed. Target ${target} not found in array.`, 'danger');
        }
        engine.play();
    },

    runBinarySearch() {
        const input = document.getElementById('search-target');
        if (!input.value) return;
        const target = parseInt(input.value);

        engine.reset();
        engine.onRenderStep = (snap) => this.renderArray(snap);

        engine.addStep({ data: this.data }, `Starting Binary Search for target: ${target}`);

        let low = 0;
        let high = this.data.length - 1;
        let found = false;

        while (low <= high) {
            const mid = Math.floor(low + (high - low) / 2);
            
            // Mark the current search boundaries visually
            // We can highlight range from low to high in Cyan, and Mid in Purple
            const snapshot = {
                data: this.data,
                activeIndex: mid,
                highlightIndex: -1 // Custom display rules
            };

            // Custom logs with step boundaries
            engine.addStep(snapshot, `Search range is index [${low} to ${high}]. Midpoint is index ${mid} (value: ${this.data[mid]})`);

            if (this.data[mid] === target) {
                found = true;
                engine.addStep({ data: this.data, successIndex: mid }, `Target ${target} matches midpoint index ${mid}!`, 'success');
                break;
            }

            if (this.data[mid] < target) {
                engine.addStep({ data: this.data, dangerIndex: mid }, `Midpoint value ${this.data[mid]} < target ${target}. Target must be in right half. Setting low = ${mid + 1}.`);
                low = mid + 1;
            } else {
                engine.addStep({ data: this.data, dangerIndex: mid }, `Midpoint value ${this.data[mid]} > target ${target}. Target must be in left half. Setting high = ${mid - 1}.`);
                high = mid - 1;
            }
        }

        if (!found) {
            engine.addStep({ data: this.data }, `Binary Search completed. Target ${target} is not in the array.`, 'danger');
        }
        engine.play();
    }
};
