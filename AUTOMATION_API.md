# Browser Profile Automation API

This document describes the API endpoints for automating browser profiles using Selenium and Puppeteer.

## Overview

The MultiProfile.org platform provides comprehensive automation capabilities for browser profiles through RESTful API endpoints. Users can create, manage, and execute automation scripts using either Selenium WebDriver or Puppeteer.

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
https://your-domain.com/api
```

## Endpoints

### 1. Execute Automation Script

Execute an automation script on a specific browser profile.

**Endpoint:** `POST /api/profiles/{id}/automation`

**Parameters:**
- `id` (path): Profile ID

**Request Body:**
```json
{
  "automationType": "selenium|puppeteer",
  "script": "JavaScript code to execute",
  "url": "https://example.com (optional)",
  "headless": false,
  "timeout": 30000
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "type": "selenium|puppeteer",
    "url": "https://example.com",
    "title": "Page Title",
    "result": "Execution result",
    "screenshots": [],
    "cookies": []
  },
  "automationType": "selenium",
  "profileId": "profile-id",
  "executedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get Automation Scripts

Retrieve all automation scripts for a specific profile.

**Endpoint:** `GET /api/profiles/{id}/automation/scripts`

**Parameters:**
- `id` (path): Profile ID

**Response:**
```json
{
  "scripts": [
    {
      "id": "script-id",
      "name": "Script Name",
      "description": "Script description",
      "script": "JavaScript code",
      "automationType": "SELENIUM|PUPPETEER",
      "tags": ["tag1", "tag2"],
      "isPublic": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Create Automation Script

Create a new automation script for a specific profile.

**Endpoint:** `POST /api/profiles/{id}/automation/scripts`

**Parameters:**
- `id` (path): Profile ID

**Request Body:**
```json
{
  "name": "Script Name",
  "description": "Script description",
  "script": "JavaScript code",
  "automationType": "SELENIUM|PUPPETEER",
  "tags": ["tag1", "tag2"],
  "isPublic": false
}
```

**Response:**
```json
{
  "script": {
    "id": "script-id",
    "name": "Script Name",
    "description": "Script description",
    "script": "JavaScript code",
    "automationType": "SELENIUM|PUPPETEER",
    "tags": ["tag1", "tag2"],
    "isPublic": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Automation script created successfully"
}
```

## Script Examples

### Selenium WebDriver Examples

#### Basic Navigation
```javascript
// Navigate to a website and get the title
await driver.get('https://example.com');
const title = await driver.getTitle();
result = title;
```

#### Form Interaction
```javascript
// Fill and submit a form
await driver.get('https://example.com/login');
await driver.findElement(By.css('#username')).sendKeys('testuser');
await driver.findElement(By.css('#password')).sendKeys('password123');
await driver.findElement(By.css('#submit')).click();

// Wait for navigation
await driver.wait(until.titleContains('Dashboard'), 5000);
result = 'Login successful';
```

#### Data Extraction
```javascript
// Extract all links from a page
await driver.get('https://example.com');
const links = await driver.findElements(By.css('a'));
const linkTexts = await Promise.all(links.map(link => link.getText()));
result = linkTexts;
```

### Puppeteer Examples

#### Basic Navigation
```javascript
// Navigate to a website and get the title
await page.goto('https://example.com');
const title = await page.title();
result = title;
```

#### Form Interaction
```javascript
// Fill and submit a form
await page.goto('https://example.com/login');
await page.type('#username', 'testuser');
await page.type('#password', 'password123');
await page.click('#submit');

// Wait for navigation
await page.waitForNavigation();
result = 'Login successful';
```

#### Screenshot and Data Extraction
```javascript
// Take screenshot and extract data
await page.goto('https://example.com');
const screenshot = await page.screenshot({ encoding: 'base64' });
const title = await page.title();
result = { title, screenshot: screenshot.substring(0, 100) + '...' };
```

## Available Methods

### Selenium WebDriver

In your scripts, you have access to the following methods:

- `driver.getCurrentUrl()` - Get current URL
- `driver.getTitle()` - Get page title
- `driver.findElement(By.css('selector'))` - Find element
- `driver.findElements(By.css('selector'))` - Find multiple elements
- `driver.executeScript(script, ...args)` - Execute JavaScript
- `driver.navigate().to(url)` - Navigate to URL
- `driver.wait(condition, timeout)` - Wait for condition
- `driver.manage().timeouts().implicitlyWait(time)` - Set implicit wait

### Puppeteer

In your scripts, you have access to the following methods:

- `page.url()` - Get current URL
- `page.title()` - Get page title
- `page.content()` - Get page HTML content
- `page.evaluate(fn, ...args)` - Execute JavaScript in page context
- `page.click(selector)` - Click element
- `page.type(selector, text)` - Type text
- `page.waitForSelector(selector, options)` - Wait for element
- `page.waitForNavigation(options)` - Wait for navigation
- `page.screenshot(options)` - Take screenshot
- `page.cookies()` - Get cookies
- `page.setCookie(...cookies)` - Set cookies
- `page.deleteCookie(...cookieNames)` - Delete cookies

## Error Handling

Scripts should handle errors gracefully:

```javascript
try {
  // Your automation code here
  result = 'Operation completed successfully';
} catch (error) {
  result = { error: error.message };
}
```

## Best Practices

1. **Use Waits**: Always wait for elements to be available before interacting with them
2. **Handle Timeouts**: Set appropriate timeouts for operations
3. **Clean Up**: Ensure proper cleanup of resources
4. **Error Handling**: Implement proper error handling in your scripts
5. **Logging**: Use console.log for debugging (logs will be available in execution results)

## Rate Limits

- Execution requests: 10 per minute per profile
- Script creation: 5 per minute per user
- API requests: 100 per minute per user

## Security Considerations

1. **Script Validation**: All scripts are executed in a sandboxed environment
2. **Resource Limits**: Execution time and memory are limited
3. **Profile Isolation**: Scripts cannot access other profiles or system resources
4. **Input Sanitization**: All inputs are sanitized before execution

## Troubleshooting

### Common Issues

1. **Element Not Found**: Use proper waits and selectors
2. **Timeout Errors**: Increase timeout values or optimize script performance
3. **Authentication Issues**: Ensure valid JWT token is provided
4. **Permission Errors**: Verify profile ownership and permissions

### Debug Mode

For debugging, you can enable verbose logging:

```javascript
console.log('Starting automation...');
// Your code here
console.log('Automation completed');
```

## Support

For support and questions:
- Check the execution results for detailed error messages
- Review the browser console for client-side errors
- Contact support through the platform's help center