class TutorialManager {
    constructor() {
        this.tutorials = new Map();
        this.currentTutorial = null;
    }

    async loadTutorial(modId) {
        const tutorial = await fetch(`/api/tutorials/${modId}`).then(r => r.json());
        
        return {
            ...tutorial,
            steps: tutorial.steps.map(step => ({
                ...step,
                validate: new Function('return ' + step.validationCode)()
            }))
        };
    }

    validateStepCompletion(step, userAction) {
        const validationRules = {
            fileExists: this.checkFileExists,
            registryKey: this.checkRegistryKey,
            processRunning: this.checkProcess
        };
        
        return Object.entries(step.validation).every(
            ([rule, value]) => validationRules[rule](value)
        );
    }

    async generateTutorialReport(tutorialId, userId) {
        // Implementation
    }
}

document.getElementById('searchTutorials').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const tutorials = document.querySelectorAll('.tutorial-card');
    tutorials.forEach(tutorial => {
        const title = tutorial.querySelector('h3').textContent.toLowerCase();
        tutorial.style.display = title.includes(query) ? 'block' : 'none';
    });
});
