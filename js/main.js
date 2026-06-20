// EasyDSA Main Orchestrator
document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Core Layout Bindings & State
    // -------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const speedSlider = document.getElementById('speed-slider');
    const playPauseBtn = document.getElementById('btn-play-pause');
    const stepForwardBtn = document.getElementById('btn-step-forward');
    const stepBackwardBtn = document.getElementById('btn-step-backward');
    const resetBtn = document.getElementById('btn-reset');
    const copyCodeBtn = document.getElementById('copy-code-btn');

    let currentTopic = 'arrays';

    // Mobile Navigation Drawer Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // Close mobile sidebar on click outside
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });

    // Speed Slider Action
    if (speedSlider) {
        const updateSpeed = () => {
            const val = parseInt(speedSlider.value);
            const delay = 2100 - val; // Invert so fast = shorter delay
            engine.setSpeed(delay);
        };
        speedSlider.addEventListener('input', updateSpeed);
        updateSpeed(); // Initialize speed
    }

    // Playback Button Bindings
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (engine.isPlaying) {
                engine.pause();
            } else {
                engine.play();
            }
        });
    }

    if (stepForwardBtn) {
        stepForwardBtn.addEventListener('click', () => engine.stepForward());
    }

    if (stepBackwardBtn) {
        stepBackwardBtn.addEventListener('click', () => engine.stepBackward());
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            loadTopic(currentTopic);
        });
    }

    // Copy Code Snippet Action
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const rawSnippet = DSACodeSnippets[currentTopic]?.javaCode || '';
            navigator.clipboard.writeText(rawSnippet).then(() => {
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                copyCodeBtn.style.background = 'var(--color-success)';
                copyCodeBtn.style.color = '#000';
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                    copyCodeBtn.style.background = '';
                    copyCodeBtn.style.color = '';
                }, 2000);
            });
        });
    }

    // -------------------------------------------------------------
    // Tab Panel Switcher (Supports 3 tabs: Definition, Java Snippet, Animation Logs)
    // -------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById('tab-vis-def').classList.remove('active');
            document.getElementById('tab-java-code').classList.remove('active');
            document.getElementById('tab-vis-logs').classList.remove('active');
            
            if (targetTab === 'vis-def') {
                document.getElementById('tab-vis-def').classList.add('active');
            } else if (targetTab === 'java-code') {
                document.getElementById('tab-java-code').classList.add('active');
            } else {
                document.getElementById('tab-vis-logs').classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // Java Code Tokenizer Syntax Highlighter
    // -------------------------------------------------------------
    function highlightJavaCode(code) {
        if (!code) return '';
        // Escape HTML tags to protect markup injection
        let escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Tokenizer regex matching comments, strings, keywords, classes/types, numbers, and functions
        const tokenRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*")|(\b(?:public|private|protected|class|interface|static|final|void|return|new|this|extends|implements|import|package|if|else|for|while|do|break|continue)\b)|(\b(?:int|double|float|boolean|char|long|short|byte|String|Node|Queue|Stack|TrieNode|LinkedList|MaxHeap|MinHeap|SegmentTree|Activity|ActivitySelection|Graph|BinaryHeap|MaxHeap|MinHeap|BinaryTree|BST|Trie|RabinKarp|Kadane|Sorting|Searching|DynamicProgramming|RecursionExample|NQueens|KMPMatch|PointersAndWindow)\b)|(\b\d+\b)|(\b\w+(?=\s*\())/g;

        return escaped.replace(tokenRegex, (match, comment, string, keyword, type, number, functionName) => {
            if (comment) return `<span class="syn-com">${match}</span>`;
            if (string) return `<span class="syn-str">${match}</span>`;
            if (keyword) return `<span class="syn-kw">${match}</span>`;
            if (type) return `<span class="syn-type">${match}</span>`;
            if (number) return `<span class="syn-num">${match}</span>`;
            if (functionName) return `<span class="syn-fn">${match}</span>`;
            return match;
        });
    }

    // -------------------------------------------------------------
    // Topic Router & Initializer
    // -------------------------------------------------------------
    function loadTopic(topicKey) {
        currentTopic = topicKey;
        
        // Update Sidebar visual active state
        navItems.forEach(item => {
            if (item.getAttribute('data-topic') === topicKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Retrieve topic data from Snippet database
        const topicData = DSACodeSnippets[topicKey];
        if (!topicData) return;

        // Update top header and badges
        document.getElementById('topic-title').innerText = topicData.title;
        
        const badge = document.getElementById('difficulty-badge');
        badge.innerText = topicData.difficulty;
        badge.className = 'difficulty-badge'; // Reset classes
        if (topicData.difficulty === 'Easy') badge.classList.add('difficulty-easy');
        else if (topicData.difficulty === 'Medium') badge.classList.add('difficulty-medium');
        else badge.classList.add('difficulty-hard');

        // Update complexities stats
        const timeComplexityVal = topicData.timeComplexity.split('|')[0] || topicData.timeComplexity;
        document.getElementById('time-complexity').innerText = timeComplexityVal.replace('Access:', '').replace('Enqueue:', '').trim();
        document.getElementById('space-complexity').innerText = topicData.spaceComplexity;

        // Render Definition Tab Content
        const defContent = document.getElementById('definition-content');
        defContent.innerHTML = `
            <h3 style="margin-bottom: 0.75rem; color: var(--color-primary); font-size: 1.1rem; font-weight: 700;">${topicData.title} Overview</h3>
            <p style="margin-bottom: 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${topicData.description}</p>
            
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; margin-bottom: 1rem;">
                <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Complexity Profiles</h4>
                <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem;">
                    <div>Time Complexity: <span style="color: var(--color-primary); font-weight: 600;">${topicData.timeComplexity}</span></div>
                    <div>Space Complexity: <span style="color: var(--color-secondary); font-weight: 600;">${topicData.spaceComplexity}</span></div>
                </div>
            </div>

            <div style="background: rgba(6, 182, 212, 0.05); border-left: 3px solid var(--color-primary); border-radius: 4px; padding: 0.6rem 0.8rem;">
                <h4 style="font-size: 0.8rem; color: var(--color-primary); margin-bottom: 0.25rem; font-weight: 600;">Visualizer Quick Start</h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">Adjust values in the operation panel below and trigger actions (e.g. Insert, Delete, Sort) to run the step-by-step visual animation.</p>
            </div>
        `;

        // Render Java Code Snippet with beautiful token-based syntax highlighting
        const codeBlock = document.getElementById('code-block-content');
        codeBlock.innerHTML = highlightJavaCode(topicData.javaCode);

        // Reset visualizer engine and mount the correct workspace
        engine.reset();
        
        // Switch view back to Definition tab as default when switching topics
        tabBtns[0].click();

        // Route topic setup to respective linear/tree/graph/algorithm files
        const linearTopics = ['arrays', 'stack', 'queue', 'deque', 'linkedlist', 'doublylinkedlist', 'circularlinkedlist'];
        const treeTopics = ['binarytree', 'bst', 'heaps', 'trie', 'segmenttree', 'tree-bfs'];
        const advancedTopics = ['dp', 'backtracking', 'kmp', 'pointers-window', 'kadane', 'greedy', 'rabin-karp'];
        
        if (linearTopics.includes(topicKey)) {
            LinearVisualizer.init(topicKey);
        } else if (treeTopics.includes(topicKey)) {
            TreesVisualizer.init(topicKey);
        } else if (topicKey === 'graph') {
            GraphVisualizer.init();
        } else if (topicKey === 'strings') {
            LinearVisualizer.data = ['E', 'a', 's', 'y', 'D', 'S', 'A'];
            LinearVisualizer.renderArray({ data: LinearVisualizer.data });
            const controls = document.getElementById('operation-controls');
            controls.innerHTML = `
                <button class="btn btn-primary" onclick="LinearVisualizer.runArraySearch()"><i class="fa-solid fa-play"></i> Character Search</button>
            `;
        } else if (topicKey === 'sorting') {
            SortingVisualizer.init();
        } else if (topicKey === 'searching') {
            SearchingVisualizer.init();
        } else if (advancedTopics.includes(topicKey)) {
            AdvancedVisualizer.init(topicKey);
        } else if (topicKey === 'recursion') {
            RecursionVisualizer.init();
        }

        // Close sidebar drawer if on mobile viewports
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    // Bind sidebar clicks to topic loaders
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const topic = item.getAttribute('data-topic');
            loadTopic(topic);
        });
    });

    // Load initial default topic (Arrays)
    loadTopic('arrays');
});
