# Template System Documentation

## Overview

The Cue Template System allows you to browse, import, and share pre-built prompt templates across multiple categories. Templates help you get started quickly with proven prompt structures for various use cases.

## Features

### 🌟 Featured Template of the Week
- Highlighted template chosen for exceptional quality
- Rotates weekly to showcase different use cases
- Easy one-click loading

### 📚 Template Categories

**Marketing** - Promotional and content marketing templates
- Email Marketing Campaign
- Social Media Content Calendar

**Code** - Development and documentation templates
- Code Review Assistant
- Documentation Generator

**Analysis** - Data and research templates
- Data Analysis Report
- Competitor Analysis

**Creative** - Writing and ideation templates
- Creative Story Writer
- Creative Brainstorming Session

### ⭐ Rating System
- 1-5 star ratings for each template
- Visual star display
- Helps identify high-quality templates

### 📊 Download Tracking
- Track template popularity
- See which templates are most used
- Auto-increments on template load

### 👥 Community Templates
- Submit your own templates
- Include author attribution with GitHub profile
- Stored locally in browser

## Using Templates

### Loading a Template

1. Browse the templates grid
2. Click on any template card
3. Template automatically loads into the composition panel
4. Customize as needed

### Filtering Templates

Click category buttons to filter:
- **All**: Show all templates
- **Marketing**: Marketing-focused templates
- **Code**: Development templates
- **Analysis**: Data analysis templates
- **Creative**: Creative writing templates

## Importing Templates

### From URL

1. Navigate to the "Import Template" section
2. Paste a JSON template URL in the "From URL" field
3. Click "Import from URL"
4. Template is added to community templates

### From File

1. Navigate to the "Import Template" section
2. Click "Choose JSON File"
3. Select your template JSON file
4. Template is imported automatically

### Template JSON Format

```json
{
  "id": "unique-template-id",
  "title": "Template Title",
  "category": "marketing|code|analysis|creative",
  "description": "Brief description of the template",
  "author": {
    "name": "Author Name",
    "github": "https://github.com/username"
  },
  "rating": 4.5,
  "downloads": 0,
  "featured": false,
  "sections": [
    {
      "title": "Section Title",
      "content": "Section content goes here"
    }
  ],
  "rules": [
    "Rule 1",
    "Rule 2",
    "Rule 3"
  ]
}
```

### Field Descriptions

- **id** (required): Unique identifier (e.g., "marketing-email-campaign")
- **title** (required): Template display name
- **category** (required): One of: marketing, code, analysis, creative
- **description** (required): Short description shown on card
- **author** (required): Object with name and github URL
- **rating** (optional): Number between 0-5 (defaults to 0)
- **downloads** (optional): Download count (defaults to 0)
- **featured** (optional): Boolean for featured status (defaults to false)
- **sections** (required): Array of section objects
- **rules** (required): Array of rule strings

## Submitting Templates

### How to Submit

1. Build your prompt in the Composition panel
2. Click "Submit Template" button
3. Fill out the submission form:
   - Template Title *
   - Category *
   - Description *
   - Your Name *
   - GitHub Profile (optional)
4. Click "Submit Template"
5. Your template appears in Community Templates

### Submission Guidelines

- Use clear, descriptive titles
- Write concise descriptions (1-2 sentences)
- Choose the most appropriate category
- Include your GitHub profile for attribution
- Ensure your prompt structure is complete
- Test your template before submitting

## Template Storage

### Pre-built Templates
- Located in: `templates/prebuilt/`
- Loaded automatically on page load
- 8 professional templates included
- Cannot be modified or deleted

### Community Templates
- Stored in browser LocalStorage
- Persist across sessions
- Can be deleted by user
- Shared only on your device

## Best Practices

### Creating Templates

1. **Be Specific**: Clear role and task definitions
2. **Include Context**: Provide necessary background
3. **Add Rules**: Define constraints and requirements
4. **Test First**: Verify template works before sharing
5. **Document Well**: Write clear descriptions

### Using Templates

1. **Customize**: Edit loaded templates to fit your needs
2. **Save Variants**: Save modified versions to your library
3. **Rate Fairly**: Help others find quality templates
4. **Share Good Ones**: Submit useful templates to community

## Template Examples

### Marketing Email Template
```json
{
  "id": "marketing-email",
  "title": "Email Marketing Campaign",
  "category": "marketing",
  "description": "Professional email marketing with persuasive copy",
  "sections": [
    {
      "title": "Role",
      "content": "You are an expert email marketing copywriter..."
    },
    {
      "title": "Task",
      "content": "Create a compelling email campaign..."
    }
  ],
  "rules": [
    "Keep subject lines under 50 characters",
    "Use action-oriented language"
  ]
}
```

### Code Review Template
```json
{
  "id": "code-review",
  "title": "Code Review Assistant",
  "category": "code",
  "description": "Comprehensive code review focusing on best practices",
  "sections": [
    {
      "title": "Role",
      "content": "You are a senior software engineer..."
    }
  ],
  "rules": [
    "Check for security vulnerabilities",
    "Identify code smells"
  ]
}
```

## Troubleshooting

### Template Won't Load
- Check JSON format validity
- Ensure all required fields are present
- Verify category is valid (marketing, code, analysis, creative)

### Import Failed
- Check URL is accessible
- Verify JSON is properly formatted
- Ensure file is valid JSON

### Template Not Appearing
- Check category filter
- Refresh the page
- Clear browser cache

## Future Enhancements

Planned features:
- Template sharing via URL
- Export templates to file
- Template versioning
- User voting system
- Template collections
- Advanced search and filtering
- Template tags

---

**Need Help?** Visit [GitHub Issues](https://github.com/muntasiractive/cue/issues) or contact [@muntasiractive](https://github.com/muntasiractive)
