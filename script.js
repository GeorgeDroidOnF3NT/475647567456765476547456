class HWIDResetSystem {
    constructor() {
        this.cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.init();
    }

    init() {
        document.getElementById('resetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time username matching validation
        document.getElementById('confirmUsername').addEventListener('input', () => {
            this.validateUsernameMatch();
        });

        document.getElementById('username').addEventListener('input', () => {
            this.validateUsernameMatch();
        });
    }

    validateUsernameMatch() {
        const username = document.getElementById('username').value;
        const confirmUsername = document.getElementById('confirmUsername').value;
        const confirmInput = document.getElementById('confirmUsername');

        if (confirmUsername && username !== confirmUsername) {
            confirmInput.style.borderColor = '#e74c3c';
        } else if (confirmUsername && username === confirmUsername) {
            confirmInput.style.borderColor = '#2ecc71';
        } else {
            confirmInput.style.borderColor = '#e1e8ed';
        }
    }

    async handleSubmit() {
        const license = document.getElementById('license').value.trim();
        const username = document.getElementById('username').value.trim();
        const confirmUsername = document.getElementById('confirmUsername').value.trim();

        // Validation
        if (!license || !username || !confirmUsername) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (username !== confirmUsername) {
            this.showMessage('Usernames do not match', 'error');
            return;
        }

        if (username.length < 3) {
            this.showMessage('Username must be at least 3 characters long', 'error');
            return;
        }

        this.setLoading(true);

        try {
            // Simulate API call - replace with your actual backend logic
            const result = await this.processHWIDReset(license, username);
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                this.resetForm();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('An error occurred. Please try again later.', 'error');
            console.error('HWID Reset Error:', error);
        } finally {
            this.setLoading(false);
        }
    }

    async processHWIDReset(license, username) {
        // This is where you would integrate with your actual backend
        // For now, I'll simulate the process
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock validation logic - replace with real validation
        const validLicenses = await this.getValidLicenses();
        const userData = validLicenses[license];

        if (!userData) {
            return { success: false, message: 'Invalid license key' };
        }

        if (userData.status !== 'active') {
            return { success: false, message: 'License is not active' };
        }

        // Check cooldown period
        const lastReset = userData.lastReset ? new Date(userData.lastReset) : null;
        const now = new Date();

        if (lastReset && (now - lastReset) < this.cooldownPeriod) {
            const hoursLeft = Math.ceil((this.cooldownPeriod - (now - lastReset)) / (60 * 60 * 1000));
            return { 
                success: false, 
                message: `Reset cooldown active. Please wait ${hoursLeft} hours before trying again.` 
            };
        }

        // Update HWID reset - in real implementation, this would update your database
        const newHWID = this.generateNewHWID();
        
        // Simulate successful reset
        return { 
            success: true, 
            message: `Hardware ID reset successful! New HWID: ${newHWID}. You can now use your license on this device.` 
        };
    }

    async getValidLicenses() {
        // In a real implementation, this would fetch from your keys.json or database
        // For demo purposes, returning mock data
        return {
            "LICENSE-ABC-123": {
                "status": "active",
                "username": "user1",
                "lastReset": null,
                "hwid": "old-hwid-123"
            },
            "LICENSE-DEF-456": {
                "status": "active", 
                "username": "user2",
                "lastReset": "2024-01-15T10:30:00Z",
                "hwid": "old-hwid-456"
            },
            "LICENSE-BANNED-789": {
                "status": "banned",
                "username": "user3", 
                "lastReset": null,
                "hwid": "old-hwid-789"
            }
        };
    }

    generateNewHWID() {
        // Generate a mock HWID - in real implementation, this would be generated by your C++ app
        return 'HWID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    setLoading(loading) {
        const button = document.getElementById('submitBtn');
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.textContent = 'Processing...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.textContent = 'Submit';
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }

    resetForm() {
        document.getElementById('resetForm').reset();
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e8ed';
        });
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HWIDResetSystem();
});
