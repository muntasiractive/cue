// ===================================
// TEMPLATE SYSTEM MODULE
// JavaScript by muntasiractive
// ===================================

// ===================================
// TEMPLATE STATE
// ===================================
const templateState = {
    templates: [],
    communityTemplates: [],
    currentCategory: 'all',
    featuredTemplate: null
};

// ===================================
// TEMPLATE INITIALIZATION
// ===================================
async function initTemplates() {
    await loadPrebuiltTemplates();
    await loadCommunityTemplates();
    setupTemplateEventListeners();
    renderTemplates();
}

// ===================================
// LOAD TEMPLATES
// ===================================
async function loadPrebuiltTemplates() {
    const templateFiles = [
        'marketing-email.json',
        'marketing-social.json',
        'code-review.json',
        'code-documentation.json',
        'analysis-data.json',
        'analysis-competitor.json',
        'creative-story.json',
        'creative-brainstorm.json'
    ];

    for (const file of templateFiles) {
        try {
            const response = await fetch(`templates/prebuilt/${file}`);
            if (response.ok) {
                const template = await response.json();
                templateState.templates.push(template);
                
                // Set featured template
                if (template.featured && !templateState.featuredTemplate) {
                    templateState.featuredTemplate = template;
                }
            }
        } catch (error) {
            console.error(`Failed to load template ${file}:`, error);
        }
    }
}

async function loadCommunityTemplates() {
    try {
        const stored = localStorage.getItem('communityTemplates');
        if (stored) {
            templateState.communityTemplates = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load community templates:', error);
    }
}

// ===================================
// RENDER TEMPLATES
// ===================================
function renderTemplates() {
    renderFeaturedTemplate();
    renderTemplateGrid();
    renderCommunityTemplates();
}

function renderFeaturedTemplate() {
    const container = document.getElementById('featuredTemplate');
    if (!container || !templateState.featuredTemplate) return;

    const template = templateState.featuredTemplate;
    container.innerHTML = `
        <div class="featured-badge">
            <svg class="icon" viewBox="0 0 24 24" style="width: 18px; height: 18px;">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Template of the Week
        </div>
        <div class="featured-content">
            <div class="featured-info">
                <h3>${template.title}</h3>
                <p>${template.description}</p>
                <div class="template-meta">
                    <div class="template-author">
                        <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        by <a href="${template.author.github}" target="_blank" rel="noopener">${template.author.name}</a>
                    </div>
                    <div class="template-rating">
                        ${renderStars(template.rating)}
                        <span class="rating-value">(${template.rating})</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary" onclick="loadTemplate('${template.id}', 'prebuilt')">
                Use Template
            </button>
        </div>
    `;
}

function renderTemplateGrid() {
    const container = document.getElementById('templatesGrid');
    if (!container) return;

    const filtered = templateState.currentCategory === 'all' 
        ? templateState.templates 
        : templateState.templates.filter(t => t.category === templateState.currentCategory);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                <h4>No templates found</h4>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(template => `
        <div class="template-card ${template.featured ? 'featured' : ''}" onclick="loadTemplate('${template.id}', 'prebuilt')">
            <span class="template-badge ${template.category}">${template.category}</span>
            <div class="template-header">
                <h4 class="template-title">${template.title}</h4>
                <p class="template-description">${template.description}</p>
            </div>
            <div class="template-meta">
                <div class="template-author">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <a href="${template.author.github}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${template.author.name}</a>
                </div>
                <div class="template-rating">
                    ${renderStars(template.rating)}
                    <span class="rating-value">(${template.rating})</span>
                </div>
            </div>
            <div class="template-stats">
                <div class="stat-item">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    ${template.downloads}
                </div>
            </div>
        </div>
    `).join('');
}

function renderCommunityTemplates() {
    const container = document.getElementById('communityGrid');
    if (!container) return;

    const filtered = templateState.currentCategory === 'all' 
        ? templateState.communityTemplates 
        : templateState.communityTemplates.filter(t => t.category === templateState.currentCategory);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <h4>No community templates yet</h4>
                <p>Be the first to submit a template!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(template => `
        <div class="template-card" onclick="loadTemplate('${template.id}', 'community')">
            <span class="template-badge ${template.category}">${template.category}</span>
            <div class="template-header">
                <h4 class="template-title">${template.title}</h4>
                <p class="template-description">${template.description}</p>
            </div>
            <div class="template-meta">
                <div class="template-author">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <a href="${template.author.github}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${template.author.name}</a>
                </div>
                <div class="template-rating">
                    ${renderStars(template.rating)}
                    <span class="rating-value">(${template.rating})</span>
                </div>
            </div>
            <div class="template-stats">
                <div class="stat-item">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    ${template.downloads || 0}
                </div>
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<svg class="star filled" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/></svg>';
    }
    
    if (hasHalfStar) {
        stars += '<svg class="star filled" viewBox="0 0 24 24"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)"/></svg>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<svg class="star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    }
    
    return stars;
}

// ===================================
// LOAD TEMPLATE INTO EDITOR
// ===================================
function loadTemplate(templateId, source) {
    const templates = source === 'community' ? templateState.communityTemplates : templateState.templates;
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
        showMessage('Template not found', 'error');
        return;
    }

    // Clear existing data
    state.sections = [];
    state.rules = [];

    // Load sections
    template.sections.forEach(section => {
        state.sections.push({
            title: section.title,
            content: section.content
        });
    });

    // Load rules
    template.rules.forEach(rule => {
        state.rules.push(rule);
    });

    // Update UI
    updateSectionsList();
    updateRulesList();
    generatePrompt();

    // Increment download count
    template.downloads = (template.downloads || 0) + 1;
    if (source === 'community') {
        saveCommunityTemplates();
    }

    showMessage(`Template "${template.title}" loaded successfully!`, 'success');
    
    // Scroll to composition panel
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
}

// ===================================
// CATEGORY FILTERING
// ===================================
function filterByCategory(category) {
    templateState.currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    renderTemplates();
}

// ===================================
// IMPORT TEMPLATES
// ===================================
function importTemplateFromURL() {
    const url = document.getElementById('templateURLInput').value.trim();
    if (!url) {
        showMessage('Please enter a URL', 'error');
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(template => {
            validateAndImportTemplate(template);
        })
        .catch(error => {
            showMessage('Failed to import template: ' + error.message, 'error');
        });
}

function importTemplateFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const template = JSON.parse(e.target.result);
            validateAndImportTemplate(template);
        } catch (error) {
            showMessage('Invalid JSON file', 'error');
        }
    };
    reader.readAsText(file);
}

function validateAndImportTemplate(template) {
    // Validate template structure
    if (!template.title || !template.category || !template.sections) {
        showMessage('Invalid template structure', 'error');
        return;
    }

    // Add to community templates
    template.id = template.id || `custom-${Date.now()}`;
    template.rating = template.rating || 0;
    template.downloads = template.downloads || 0;
    template.author = template.author || { name: 'Community', github: '#' };

    templateState.communityTemplates.push(template);
    saveCommunityTemplates();
    renderTemplates();

    showMessage(`Template "${template.title}" imported successfully!`, 'success');
}

// ===================================
// SUBMIT COMMUNITY TEMPLATE
// ===================================
function openSubmitModal() {
    document.getElementById('submitModal').classList.add('active');
}

function closeSubmitModal() {
    document.getElementById('submitModal').classList.remove('active');
}

function submitCommunityTemplate() {
    const title = document.getElementById('newTemplateTitle').value.trim();
    const category = document.getElementById('newTemplateCategory').value;
    const description = document.getElementById('newTemplateDescription').value.trim();
    const authorName = document.getElementById('newTemplateAuthor').value.trim();
    const authorGithub = document.getElementById('newTemplateGithub').value.trim();

    if (!title || !category || !description || !authorName) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    // Create template from current prompt
    const template = {
        id: `community-${Date.now()}`,
        title,
        category,
        description,
        author: {
            name: authorName,
            github: authorGithub || '#'
        },
        rating: 0,
        downloads: 0,
        sections: [...state.sections],
        rules: [...state.rules]
    };

    templateState.communityTemplates.push(template);
    saveCommunityTemplates();
    renderTemplates();

    closeSubmitModal();
    showMessage('Template submitted successfully!', 'success');

    // Clear form
    document.getElementById('newTemplateTitle').value = '';
    document.getElementById('newTemplateDescription').value = '';
    document.getElementById('newTemplateAuthor').value = '';
    document.getElementById('newTemplateGithub').value = '';
}

function saveCommunityTemplates() {
    try {
        localStorage.setItem('communityTemplates', JSON.stringify(templateState.communityTemplates));
    } catch (error) {
        console.error('Failed to save community templates:', error);
    }
}

// ===================================
// EVENT LISTENERS
// ===================================
function setupTemplateEventListeners() {
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByCategory(btn.dataset.category);
        });
    });

    // Import buttons
    const urlImportBtn = document.getElementById('importURLBtn');
    if (urlImportBtn) {
        urlImportBtn.addEventListener('click', importTemplateFromURL);
    }

    const fileInput = document.getElementById('templateFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', importTemplateFromFile);
    }

    // Submit template
    const submitBtn = document.getElementById('submitTemplateBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', openSubmitModal);
    }

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSubmitModal);
    }

    const submitFormBtn = document.getElementById('submitTemplateFormBtn');
    if (submitFormBtn) {
        submitFormBtn.addEventListener('click', submitCommunityTemplate);
    }

    // Close modal on overlay click
    const modalOverlay = document.getElementById('submitModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeSubmitModal();
            }
        });
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initTemplates, loadTemplate, filterByCategory };
}
