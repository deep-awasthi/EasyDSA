// EasyDSA Visualizer Engine
class VisualizerEngine {
    constructor() {
        this.steps = [];             // Animation snapshots
        this.currentStepIndex = -1;  // Pointer in snapshots
        this.isPlaying = false;      // Playback state
        this.delay = 1000;           // Timer gap in ms
        this.timer = null;           // Timeout handle
        this.activeTopic = null;     // Current active topic key
        this.onRenderStep = null;    // Callback when rendering a step
        this.onFinished = null;      // Callback when animation finishes
    }

    // Initialize/Reset the engine state
    reset() {
        this.stop();
        this.steps = [];
        this.currentStepIndex = -1;
        this.isPlaying = false;
        this.updateControlButtons();
        this.clearLogs();
    }

    // Set playback speed in milliseconds
    setSpeed(speedVal) {
        this.delay = speedVal;
    }

    // Add a step to the queue
    addStep(snapshot, description, logType = 'info') {
        this.steps.push({
            snapshot: JSON.parse(JSON.stringify(snapshot)), // Deep copy of structure elements
            description: description,
            logType: logType
        });
    }

    // Clear step list without clearing DOM
    clearSteps() {
        this.steps = [];
        this.currentStepIndex = -1;
        this.updateControlButtons();
    }

    // Start playing forward from current step
    play() {
        if (this.steps.length === 0) return;
        this.isPlaying = true;
        this.updateControlButtons();
        this.runNextFrame();
    }

    // Pause playback
    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.updateControlButtons();
    }

    // Stop and return to start
    stop() {
        this.pause();
        this.currentStepIndex = -1;
        this.updateControlButtons();
    }

    // Step forward one frame
    stepForward() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.renderCurrentStep();
            this.updateControlButtons();
        } else {
            this.pause();
            if (this.onFinished) this.onFinished();
        }
    }

    // Step backward one frame
    stepBackward() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.renderCurrentStep();
            this.updateControlButtons();
        } else if (this.currentStepIndex === 0) {
            this.currentStepIndex = -1;
            // Clear visualization to initial state if needed
            if (this.onRenderStep) this.onRenderStep(null, "Initial state");
            this.updateControlButtons();
        }
    }

    // Process frame loop
    runNextFrame() {
        if (!this.isPlaying) return;
        if (this.currentStepIndex < this.steps.length - 1) {
            this.stepForward();
            this.timer = setTimeout(() => this.runNextFrame(), this.delay);
        } else {
            this.pause();
            this.addLog("Animation completed.", "success");
            if (this.onFinished) this.onFinished();
        }
    }

    // Render step at current pointer
    renderCurrentStep() {
        if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
            const step = this.steps[this.currentStepIndex];
            if (this.onRenderStep) {
                this.onRenderStep(step.snapshot, step.description);
            }
            this.addLog(step.description, step.logType);
        }
    }

    // Add logging message to tab panel
    addLog(message, type = 'info') {
        const logList = document.getElementById('vis-log-list');
        if (!logList) return;

        // Prevent identical logging entries spamming in same frame
        if (logList.lastElementChild && logList.lastElementChild.textContent.includes(message)) {
            return;
        }

        const li = document.createElement('li');
        li.className = `log-item ${type}`;
        
        // Time badge
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        li.innerHTML = `<span style="color: var(--text-muted); font-size: 0.75rem; margin-right: 0.5rem;">[${timeStr}]</span> ${message}`;
        logList.appendChild(li);
        
        // Auto scroll to bottom
        logList.parentElement.scrollTop = logList.parentElement.scrollHeight;
    }

    clearLogs() {
        const logList = document.getElementById('vis-log-list');
        if (logList) {
            logList.innerHTML = `<li class="log-item info">Visualizer initialized. Select an action to view execution logs.</li>`;
        }
    }

    // Enable/disable UI control button states
    updateControlButtons() {
        const playPauseBtn = document.getElementById('btn-play-pause');
        const stepBackBtn = document.getElementById('btn-step-backward');
        const stepForwardBtn = document.getElementById('btn-step-forward');

        if (!playPauseBtn) return;

        // Toggle Play/Pause icon
        if (this.isPlaying) {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playPauseBtn.title = "Pause";
        } else {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playPauseBtn.title = "Play";
        }

        // Stepper disabling/enabling rules
        const hasSteps = this.steps.length > 0;
        stepBackBtn.disabled = !hasSteps || this.currentStepIndex < 0 || this.isPlaying;
        stepForwardBtn.disabled = !hasSteps || this.currentStepIndex >= this.steps.length - 1 || this.isPlaying;
    }
}

// Global visualizer engine instance
const engine = new VisualizerEngine();
window.engine = engine;
