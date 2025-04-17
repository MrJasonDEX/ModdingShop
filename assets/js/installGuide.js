class InstallGuide {
    constructor(mod) {
        this.mod = mod;
        this.currentStep = 0;
        this.steps = this.generateSteps();
    }

    generateSteps() {
        return [
            {
                title: 'Preparation',
                tasks: [
                    'Backup game files',
                    'Close game if running',
                    'Disable antivirus temporarily'
                ],
                verification: async () => this.checkGameClosed()
            },
            {
                title: 'Installation',
                tasks: [
                    'Extract mod files',
                    'Copy to game directory',
                    'Replace existing files'
                ],
                verification: async () => this.verifyFiles()
            },
            {
                title: 'Configuration',
                tasks: [
                    'Run configuration tool',
                    'Set recommended settings',
                    'Test mod functionality'
                ],
                verification: async () => this.checkModFunction()
            }
        ];
    }

    async proceedToNextStep() {
        if (await this.verifyCurrentStep()) {
            this.currentStep++;
            this.renderCurrentStep();
            return true;
        }
        return false;
    }
}
