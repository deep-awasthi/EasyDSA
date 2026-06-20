// EasyDSA Sorting Algorithms Visualizer
window.SortingVisualizer = {
    data: [], // Unsorted data set
    originalData: [],

    init() {
        engine.reset();
        this.generateRandomArray();
        this.setupSortingControls();
    },

    generateRandomArray() {
        engine.reset();
        const size = 15;
        this.data = [];
        for (let i = 0; i < size; i++) {
            this.data.push(Math.floor(Math.random() * 85) + 15); // Random heights between 15% and 100%
        }
        this.originalData = [...this.data];
        this.renderSorting({ data: this.data });
    },

    renderSorting(snapshot) {
        const workspace = document.getElementById('visualizer-workspace');
        workspace.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'sorting-container';

        const arr = snapshot.data || [];
        const maxVal = Math.max(...this.originalData, 100);

        arr.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.className = 'sort-bar';
            
            // Scaled height relative to layout size
            const percentage = (val / maxVal) * 80;
            bar.style.height = `${percentage}%`;

            if (snapshot.compareIdxs && snapshot.compareIdxs.includes(idx)) {
                bar.classList.add('compare');
            }
            if (snapshot.swapIdxs && snapshot.swapIdxs.includes(idx)) {
                bar.classList.add('swap');
            }
            if (snapshot.sortedIdxs && snapshot.sortedIdxs.includes(idx)) {
                bar.classList.add('sorted');
            }

            const valueLabel = document.createElement('span');
            valueLabel.className = 'sort-val';
            valueLabel.innerText = val;
            bar.appendChild(valueLabel);

            container.appendChild(bar);
        });

        workspace.appendChild(container);
    },

    setupSortingControls() {
        const controls = document.getElementById('operation-controls');
        controls.innerHTML = `
            <select id="sort-algo-select" class="control-select">
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
                <option value="heap">Heap Sort</option>
            </select>
            <button class="btn btn-primary" onclick="SortingVisualizer.runSort()"><i class="fa-solid fa-bolt"></i> Sort!</button>
            <button class="btn btn-secondary" onclick="SortingVisualizer.generateRandomArray()"><i class="fa-solid fa-shuffle"></i> Randomize</button>
        `;
    },

    runSort() {
        const select = document.getElementById('sort-algo-select');
        const algo = select.value;

        engine.reset();
        engine.onRenderStep = (snap) => this.renderSorting(snap);

        // Make working copy
        const temp = [...this.data];
        engine.addStep({ data: [...temp] }, `Starting ${algo.toUpperCase()} Sort on array: [${temp.join(', ')}]`);

        if (algo === 'bubble') {
            this.bubbleSort(temp);
        } else if (algo === 'selection') {
            this.selectionSort(temp);
        } else if (algo === 'insertion') {
            this.insertionSort(temp);
        } else if (algo === 'merge') {
            this.mergeSortHelper(temp);
        } else if (algo === 'quick') {
            this.quickSortHelper(temp);
        } else if (algo === 'heap') {
            this.heapSort(temp);
        }

        engine.play();
    },

    // 1. Bubble Sort
    bubbleSort(arr) {
        const n = arr.length;
        const sorted = [];
        
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                engine.addStep({ data: [...arr], compareIdxs: [j, j + 1], sortedIdxs: [...sorted] }, `Comparing elements at index ${j} (${arr[j]}) and ${j+1} (${arr[j+1]})`);
                
                if (arr[j] > arr[j + 1]) {
                    // Swap
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                    engine.addStep({ data: [...arr], swapIdxs: [j, j + 1], sortedIdxs: [...sorted] }, `Swapped elements at index ${j} and ${j+1}`, 'highlight');
                }
            }
            sorted.unshift(n - i - 1);
            if (!swapped) break; // Array is sorted
        }
        
        // Add remaining indexes to sorted
        const allSorted = Array.from({length: n}, (_, i) => i);
        engine.addStep({ data: [...arr], sortedIdxs: allSorted }, `Array sorted successfully!`, 'success');
    },

    // 2. Selection Sort
    selectionSort(arr) {
        const n = arr.length;
        const sorted = [];

        for (let i = 0; i < n; i++) {
            let minIdx = i;
            engine.addStep({ data: [...arr], compareIdxs: [i], sortedIdxs: [...sorted] }, `Setting minimum index to ${i} (value: ${arr[i]})`);
            
            for (let j = i + 1; j < n; j++) {
                engine.addStep({ data: [...arr], compareIdxs: [minIdx, j], sortedIdxs: [...sorted] }, `Comparing current min (${arr[minIdx]}) with element at index ${j} (${arr[j]})`);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    engine.addStep({ data: [...arr], compareIdxs: [minIdx], sortedIdxs: [...sorted] }, `New minimum found at index ${minIdx} (value: ${arr[minIdx]})`);
                }
            }

            if (minIdx !== i) {
                const temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                engine.addStep({ data: [...arr], swapIdxs: [i, minIdx], sortedIdxs: [...sorted] }, `Swapping initial index ${i} with minimum element at index ${minIdx}`, 'highlight');
            }
            sorted.push(i);
        }
        engine.addStep({ data: [...arr], sortedIdxs: [...sorted] }, `Array sorted successfully!`, 'success');
    },

    // 3. Insertion Sort
    insertionSort(arr) {
        const n = arr.length;
        const sorted = [0];

        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            engine.addStep({ data: [...arr], compareIdxs: [i], sortedIdxs: [...sorted] }, `Selecting key element ${key} at index ${i}`);

            while (j >= 0 && arr[j] > key) {
                engine.addStep({ data: [...arr], compareIdxs: [j, j + 1] }, `Comparing index ${j} (${arr[j]}) > key (${key}). Shifting right.`);
                arr[j + 1] = arr[j];
                j = j - 1;
                engine.addStep({ data: [...arr], swapIdxs: [j + 1, j + 2] }, `Shifted element to index ${j+2}`);
            }
            arr[j + 1] = key;
            engine.addStep({ data: [...arr], activeIdxs: [j + 1] }, `Inserted key element ${key} at index ${j + 1}`);
            
            // Dynamically track sorted prefix
            for (let k = 0; k <= i; k++) {
                if (!sorted.includes(k)) sorted.push(k);
            }
        }
        
        const allSorted = Array.from({length: n}, (_, i) => i);
        engine.addStep({ data: [...arr], sortedIdxs: allSorted }, `Array sorted successfully!`, 'success');
    },

    // 4. Merge Sort
    mergeSortHelper(arr) {
        const merge = (low, mid, high) => {
            const tempArr = [];
            let i = low, j = mid + 1;

            engine.addStep({ data: [...arr], compareIdxs: [low, high] }, `Splitting and merging subarrays [${low} to ${mid}] and [${mid+1} to ${high}]`);

            while (i <= mid && j <= high) {
                engine.addStep({ data: [...arr], compareIdxs: [i, j] }, `Comparing left pointer value ${arr[i]} and right pointer value ${arr[j]}`);
                if (arr[i] <= arr[j]) {
                    tempArr.push(arr[i++]);
                } else {
                    tempArr.push(arr[j++]);
                }
            }

            while (i <= mid) tempArr.push(arr[i++]);
            while (j <= high) tempArr.push(arr[j++]);

            // Copy back values to original array and animate
            for (let k = 0; k < tempArr.length; k++) {
                arr[low + k] = tempArr[k];
                engine.addStep({ data: [...arr], swapIdxs: [low + k] }, `Writing sorted element ${tempArr[k]} back to index ${low + k}`);
            }
        };

        const divide = (low, high) => {
            if (low < high) {
                const mid = Math.floor((low + high) / 2);
                divide(low, mid);
                divide(mid + 1, high);
                merge(low, mid, high);
            }
        };

        divide(0, arr.length - 1);
        const allSorted = Array.from({length: arr.length}, (_, i) => i);
        engine.addStep({ data: [...arr], sortedIdxs: allSorted }, `Merge Sort complete!`, 'success');
    },

    // 5. Quick Sort
    quickSortHelper(arr) {
        const partition = (low, high) => {
            const pivot = arr[high];
            engine.addStep({ data: [...arr], compareIdxs: [high] }, `Selecting pivot element ${pivot} at index ${high}`);
            
            let i = low - 1;
            for (let j = low; j < high; j++) {
                engine.addStep({ data: [...arr], compareIdxs: [j, high] }, `Comparing element at index ${j} (${arr[j]}) with pivot (${pivot})`);
                if (arr[j] < pivot) {
                    i++;
                    const temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    engine.addStep({ data: [...arr], swapIdxs: [i, j] }, `Index ${j} < pivot. Swapped index ${i} and ${j}`, 'highlight');
                }
            }
            const temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            engine.addStep({ data: [...arr], swapIdxs: [i + 1, high] }, `Swapped pivot to its final sorted position at index ${i + 1}`);
            return i + 1;
        };

        const quickSort = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                quickSort(low, pi - 1);
                quickSort(pi + 1, high);
            }
        };

        quickSort(0, arr.length - 1);
        const allSorted = Array.from({length: arr.length}, (_, i) => i);
        engine.addStep({ data: [...arr], sortedIdxs: allSorted }, `Quick Sort complete!`, 'success');
    },

    // 6. Heap Sort
    heapSort(arr) {
        const n = arr.length;

        const heapify = (size, idx) => {
            let largest = idx;
            let left = 2 * idx + 1;
            let right = 2 * idx + 2;

            if (left < size && arr[left] > arr[largest]) largest = left;
            if (right < size && arr[right] > arr[largest]) largest = right;

            if (largest !== idx) {
                engine.addStep({ data: [...arr], compareIdxs: [idx, largest] }, `Heapify comparison: parent ${arr[idx]} < child ${arr[largest]}`);
                const temp = arr[idx];
                arr[idx] = arr[largest];
                arr[largest] = temp;
                engine.addStep({ data: [...arr], swapIdxs: [idx, largest] }, `Swapped parent and largest child`, 'highlight');
                
                heapify(size, largest);
            }
        };

        // Build Max Heap
        engine.addStep({ data: [...arr] }, `Building Max Heap structure from unsorted array`);
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(n, i);
        }

        // Extract elements from heap one-by-one
        const sorted = [];
        for (let i = n - 1; i > 0; i--) {
            engine.addStep({ data: [...arr], swapIdxs: [0, i], sortedIdxs: [...sorted] }, `Extracting maximum value (${arr[0]}) and swapping with end index ${i}`);
            const temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            
            sorted.unshift(i);
            
            engine.addStep({ data: [...arr], sortedIdxs: [...sorted] }, `Heapify-Down on reduced heap of size ${i}`);
            heapify(i, 0);
        }
        
        const allSorted = Array.from({length: n}, (_, i) => i);
        engine.addStep({ data: [...arr], sortedIdxs: allSorted }, `Heap Sort complete!`, 'success');
    }
};
