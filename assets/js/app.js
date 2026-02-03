// ===================================
// CUE - STRUCTURED PROMPT BUILDER
// JavaScript by muntasiractive
// ===================================

// ===================================
// STATE MANAGEMENT
// ===================================
const state = {
    sections: [],
    rules: [],
    models: [],
    selectedModel: '',
    apiKey: localStorage.getItem('openrouter_api_key') || ''
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    loadLibrary();
    loadApiKey();
    fetchModels();
    
    // Event Listeners
    document.getElementById('addSectionBtn').addEventListener('click', addSection);
    document.getElementById('addRuleBtn').addEventListener('click', addRule);
    document.getElementById('generateBtn').addEventListener('click', generatePrompt);
    document.getElementById('copyBtn').addEventListener('click', copyPrompt);
    document.getElementById('saveBtn').addEventListener('click', savePrompt);
    document.getElementById('testBtn').addEventListener('click', testPrompt);
    document.getElementById('saveApiKeyBtn').addEventListener('click', saveApiKey);
    
    // Share button handlers
    const shareBtn = document.getElementById('shareBtn');
    const shareMenu = document.getElementById('shareMenu');
    
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        shareMenu.classList.remove('active');
    });
    
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Initial tab
    switchTab('json');
}

// ===================================
// SECTION MANAGEMENT
// ===================================
function addSection() {
    const title = document.getElementById('sectionTitle').value.trim();
    const content = document.getElementById('sectionContent').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }
    
    state.sections.push({ title, content });
    updateSectionsList();
    
    document.getElementById('sectionTitle').value = '';
    document.getElementById('sectionContent').value = '';
    generatePrompt();
}

function updateSectionsList() {
    const list = document.getElementById('sectionsList');
    list.innerHTML = state.sections.map((section, index) => `
        <div class="library-item">
            <div class="library-item-title">${section.title}</div>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">${section.content.substring(0, 100)}...</p>
            <button class="icon-btn" onclick="removeSection(${index})">
                <svg class="icon" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

function removeSection(index) {
    state.sections.splice(index, 1);
    updateSectionsList();
    generatePrompt();
}

// ===================================
// RULE MANAGEMENT
// ===================================
function addRule() {
    const rule = document.getElementById('ruleInput').value.trim();
    
    if (!rule) {
        alert('Please enter a rule');
        return;
    }
    
    state.rules.push(rule);
    updateRulesList();
    
    document.getElementById('ruleInput').value = '';
    generatePrompt();
}

function updateRulesList() {
    const list = document.getElementById('rulesList');
    list.innerHTML = state.rules.map((rule, index) => `
        <div class="list-item">
            <input type="text" class="input" value="${rule}" readonly>
            <button class="icon-btn" onclick="removeRule(${index})">
                <svg class="icon" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

function removeRule(index) {
    state.rules.splice(index, 1);
    updateRulesList();
    generatePrompt();
}

// ===================================
// TAB SWITCHING
// ===================================
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.editor').forEach(e => e.classList.add('hidden'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Output`).classList.remove('hidden');
}

// ===================================
// PROMPT GENERATION
// ===================================
function generatePrompt() {
    const prompt = {
        sections: state.sections,
        rules: state.rules
    };
    
    // JSON Output
    document.getElementById('jsonOutput').textContent = JSON.stringify(prompt, null, 2);
    
    // Markdown Output
    let markdown = '';
    state.sections.forEach(section => {
        markdown += `## ${section.title}\n\n${section.content}\n\n`;
    });
    if (state.rules.length > 0) {
        markdown += '## Rules\n\n';
        state.rules.forEach((rule, i) => {
            markdown += `${i + 1}. ${rule}\n`;
        });
    }
    document.getElementById('markdownOutput').textContent = markdown;
    
    // Plain Text Output
    let plain = '';
    state.sections.forEach(section => {
        plain += `${section.title}\n${'='.repeat(section.title.length)}\n\n${section.content}\n\n`;
    });
    if (state.rules.length > 0) {
        plain += 'RULES\n=====\n\n';
        state.rules.forEach((rule, i) => {
            plain += `${i + 1}. ${rule}\n`;
        });
    }
    document.getElementById('plainOutput').textContent = plain;
}

// ===================================
// COPY FUNCTIONALITY
// ===================================
function copyPrompt() {
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    const output = document.getElementById(`${activeTab}Output`).textContent;
    
    navigator.clipboard.writeText(output).then(() => {
        showMessage('Copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Failed to copy', 'error');
    });
}

// ===================================
// LIBRARY MANAGEMENT
// ===================================
function savePrompt() {
    const name = prompt('Enter a name for this prompt:');
    if (!name) return;
    
    const library = JSON.parse(localStorage.getItem('promptLibrary') || '[]');
    library.push({
        name,
        sections: state.sections,
        rules: state.rules,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('promptLibrary', JSON.stringify(library));
    loadLibrary();
    showMessage('Prompt saved to library!', 'success');
}

function loadLibrary() {
    const library = JSON.parse(localStorage.getItem('promptLibrary') || '[]');
    const list = document.getElementById('libraryList');
    
    if (library.length === 0) {
        list.innerHTML = '<p style="color: var(--text-tertiary); text-align: center;">No saved prompts yet</p>';
        return;
    }
    
    list.innerHTML = library.map((item, index) => `
        <div class="library-item">
            <div class="library-item-title">${item.name}</div>
            <div class="library-item-meta">${new Date(item.date).toLocaleDateString()}</div>
            <div class="btn-group">
                <button class="btn btn-secondary" onclick="loadPrompt(${index})">
                    <svg class="icon" viewBox="0 0 24 24">
                        <polyline points="3 17 3 21 7 21"></polyline>
                        <polyline points="21 7 21 3 17 3"></polyline>
                        <path d="M3 21L21 3"></path>
                    </svg>
                    Load
                </button>
                <button class="icon-btn" onclick="deletePrompt(${index})">
                    <svg class="icon" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function loadPrompt(index) {
    const library = JSON.parse(localStorage.getItem('promptLibrary') || '[]');
    const item = library[index];
    
    state.sections = item.sections;
    state.rules = item.rules;
    
    updateSectionsList();
    updateRulesList();
    generatePrompt();
    
    showMessage('Prompt loaded!', 'success');
}

function deletePrompt(index) {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    const library = JSON.parse(localStorage.getItem('promptLibrary') || '[]');
    library.splice(index, 1);
    localStorage.setItem('promptLibrary', JSON.stringify(library));
    
    loadLibrary();
    showMessage('Prompt deleted', 'success');
}

// ===================================
// API INTEGRATION
// ===================================
function loadApiKey() {
    const key = localStorage.getItem('openrouter_api_key');
    if (key) {
        document.getElementById('apiKeyInput').value = key;
        state.apiKey = key;
    }
}

function saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
        showMessage('Please enter an API key', 'error');
        return;
    }
    
    localStorage.setItem('openrouter_api_key', key);
    state.apiKey = key;
    showMessage('API key saved!', 'success');
    fetchModels();
}

async function fetchModels() {
    if (!state.apiKey) return;
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${state.apiKey}`
            }
        });
        
        const data = await response.json();
        state.models = data.data || [];
        
        const select = document.getElementById('modelSelect');
        select.innerHTML = '<option value="">Select a model</option>' + 
            state.models.map(model => `<option value="${model.id}">${model.id}</option>`).join('');
            
    } catch (error) {
        console.error('Failed to fetch models:', error);
    }
}

async function testPrompt() {
    if (!state.apiKey) {
        showMessage('Please set your OpenRouter API key first', 'error');
        return;
    }
    
    const model = document.getElementById('modelSelect').value;
    if (!model) {
        showMessage('Please select a model', 'error');
        return;
    }
    
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    const prompt = document.getElementById(`${activeTab}Output`).textContent;
    
    const testBtn = document.getElementById('testBtn');
    const originalText = testBtn.innerHTML;
    testBtn.innerHTML = '<div class="loading"></div> Testing...';
    testBtn.disabled = true;
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        
        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            document.getElementById('testResult').textContent = data.choices[0].message.content;
            showMessage('Test completed successfully!', 'success');
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        showMessage('Test failed: ' + error.message, 'error');
        document.getElementById('testResult').textContent = 'Error: ' + error.message;
    } finally {
        testBtn.innerHTML = originalText;
        testBtn.disabled = false;
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function showMessage(message, type) {
    const container = document.getElementById('messageContainer');
    const div = document.createElement('div');
    div.className = type;
    div.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}
