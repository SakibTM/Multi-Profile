# MultiProfile.org API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Profile Management](#profile-management)
4. [Browser Automation](#browser-automation)
5. [Automation Scripts](#automation-scripts)
6. [Execution Results](#execution-results)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Introduction

Welcome to the MultiProfile.org API documentation! This guide will help you understand how to use our API to control your browser profiles, automate tasks, and manage your automation workflows.

### What You Can Do With Our API

- **Create and manage browser profiles** with custom settings
- **Automate browser tasks** using Selenium WebDriver or Puppeteer
- **Execute automation scripts** on specific profiles
- **Monitor execution results** and performance
- **Integrate with your existing tools** and workflows

### Getting Started

1. **Create an account** on MultiProfile.org
2. **Get your API token** from the dashboard
3. **Choose your preferred automation framework** (Selenium or Puppeteer)
4. **Install required dependencies** (see Python setup below)
5. **Start automating!**

### Python Setup

To use the Python examples in this documentation, you'll need to install the required packages:

```bash
# Install required Python packages
pip install requests selenium

# Optional: For enhanced functionality
pip install beautifulsoup4 pandas
```

Create a Python client file to get started:

```python
# multiprofile_client.py
import requests
import json

class MultiProfileClient:
    def __init__(self, api_token, base_url="https://multiprofile.org/api"):
        self.api_token = api_token
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
    
    def get_profiles(self):
        """Get all browser profiles"""
        response = requests.get(f"{self.base_url}/profiles", headers=self.headers)
        response.raise_for_status()
        return response.json()['profiles']
    
    def execute_automation(self, profile_id, script, automation_type="selenium", **kwargs):
        """Execute automation script on a profile"""
        data = {
            "automationType": automation_type,
            "script": script,
            **kwargs
        }
        response = requests.post(f"{self.base_url}/profiles/{profile_id}/automation",
                               headers=self.headers, json=data)
        response.raise_for_status()
        return response.json()

# Usage
if __name__ == "__main__":
    # Replace with your actual API token
    client = MultiProfileClient("YOUR_JWT_TOKEN")
    
    # Test the connection
    try:
        profiles = client.get_profiles()
        print(f"Successfully connected! Found {len(profiles)} profiles")
    except Exception as e:
        print(f"Connection failed: {e}")
```

### JavaScript Setup

For browser-based automation, you can use the fetch API:

```javascript
// JavaScript client example
class MultiProfileJS {
    constructor(apiToken, baseUrl = 'https://multiprofile.org/api') {
        this.apiToken = apiToken;
        this.baseUrl = baseUrl;
        this.headers = {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        };
    }
    
    async getProfiles() {
        const response = await fetch(`${this.baseUrl}/profiles`, {
            headers: this.headers
        });
        return response.json();
    }
    
    async executeAutomation(profileId, script, options = {}) {
        const data = {
            automationType: 'puppeteer',
            script: script,
            ...options
        };
        
        const response = await fetch(`${this.baseUrl}/profiles/${profileId}/automation`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        
        return response.json();
    }
}

// Usage
const client = new MultiProfileJS('YOUR_JWT_TOKEN');
client.getProfiles().then(data => console.log(data));
```

## Authentication

All API requests require authentication using a JWT token. You can find your token in your account settings.

### How to Authenticate

Include your token in the Authorization header:

```bash
curl -X GET "https://multiprofile.org/api/profiles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Getting Your Token

1. Log in to your MultiProfile.org account
2. Go to Settings → API Tokens
3. Generate a new token or copy an existing one

### Token Security

- Keep your token secure and never share it publicly
- Use environment variables to store tokens in your applications
- Regenerate tokens if you suspect they've been compromised

## Profile Management

### Get All Profiles

Retrieve all your browser profiles with their settings and configurations.

```bash
curl -X GET "https://multiprofile.org/api/profiles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "profiles": [
    {
      "id": "profile_123",
      "name": "Work Profile",
      "description": "Profile for work-related tasks",
      "browserType": "CHROME",
      "isHeadless": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "group": {
        "id": "group_456",
        "name": "Work",
        "color": "#3B82F6"
      }
    }
  ]
}
```

### Create a New Profile

Create a new browser profile with custom settings.

```bash
curl -X POST "https://multiprofile.org/api/profiles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Automation Profile",
    "description": "Profile for automated tasks",
    "browserType": "CHROME",
    "isHeadless": true,
    "groupId": "group_456"
  }'
```

### Get Profile Details

Retrieve detailed information about a specific profile, including its settings.

```bash
curl -X GET "https://multiprofile.org/api/profiles/profile_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "profile": {
    "id": "profile_123",
    "name": "Work Profile",
    "settings": {
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "language": "en-US",
      "timezone": "America/New_York",
      "screenResolution": "1920x1080",
      "proxyHost": "proxy.example.com",
      "proxyPort": 8080
    }
  }
}
```

### Update Profile Settings

Modify profile settings like user agent, proxy, or screen resolution.

```bash
curl -X PUT "https://multiprofile.org/api/profiles/profile_123/settings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "language": "en-GB",
    "timezone": "Europe/London",
    "screenResolution": "2560x1440"
  }'
```

## Browser Automation

### Execute Automation Script

Run an automation script on a specific browser profile. This is the core endpoint for browser automation.

```bash
curl -X POST "https://multiprofile.org/api/profiles/profile_123/automation" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "automationType": "puppeteer",
    "script": "await page.goto(\"https://example.com\"); result = await page.title();",
    "url": "https://example.com",
    "headless": false,
    "timeout": 30000
  }'
```

**Parameters:**
- `automationType` (required): `"selenium"` or `"puppeteer"`
- `script` (required): JavaScript code to execute
- `url` (optional): Starting URL for the browser
- `headless` (optional): Run in headless mode (default: false)
- `timeout` (optional): Execution timeout in milliseconds (default: 30000)

**Response:**
```json
{
  "success": true,
  "result": {
    "type": "puppeteer",
    "url": "https://example.com",
    "title": "Example Domain",
    "result": "Example Domain",
    "cookies": [
      {
        "name": "_ga",
        "value": "GA1.1.123456789.1234567890",
        "domain": ".example.com"
      }
    ]
  },
  "automationType": "puppeteer",
  "profileId": "profile_123",
  "executedAt": "2024-01-01T00:00:00.000Z"
}
```

### Launch Browser Profile

Start a browser profile for manual use or debugging.

```bash
curl -X POST "https://multiprofile.org/api/profiles/profile_123/launch" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Automation Scripts

### Get All Scripts for a Profile

Retrieve all automation scripts associated with a specific profile.

```bash
curl -X GET "https://multiprofile.org/api/profiles/profile_123/automation/scripts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "scripts": [
    {
      "id": "script_789",
      "name": "Login Automation",
      "description": "Automated login process",
      "script": "await page.type(\"#username\", \"user\"); await page.type(\"#password\", \"pass\"); await page.click(\"#submit\");",
      "automationType": "PUPPETEER",
      "tags": ["login", "automation"],
      "isPublic": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create a New Automation Script

Create and save an automation script for future use.

```bash
curl -X POST "https://multiprofile.org/api/profiles/profile_123/automation/scripts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Data Scraper",
    "description": "Scrape product data from e-commerce site",
    "script": "// Your scraping code here",
    "automationType": "PUPPETEER",
    "tags": ["scraping", "products"],
    "isPublic": false
  }'
```

### Execute a Saved Script

Run a previously saved automation script.

```bash
# First, get the script ID
curl -X GET "https://multiprofile.org/api/profiles/profile_123/automation/scripts"

# Then execute it using the automation endpoint
curl -X POST "https://multiprofile.org/api/profiles/profile_123/automation" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "automationType": "puppeteer",
    "script": "await page.type(\"#username\", \"user\"); await page.type(\"#password\", \"pass\"); await page.click(\"#submit\");",
    "url": "https://example.com/login"
  }'
```

## Execution Results

### Understanding Execution Results

When you execute an automation script, you receive detailed results:

```json
{
  "success": true,
  "result": {
    "type": "puppeteer",
    "url": "https://example.com",
    "title": "Page Title",
    "result": "Your script output",
    "screenshots": [],
    "cookies": [...]
  },
  "executedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Handling

If something goes wrong, you'll get detailed error information:

```json
{
  "success": false,
  "error": "Element not found: #submit-button",
  "details": "The element with selector '#submit-button' was not found within the timeout period"
}
```

## Code Examples

### Example 1: Web Scraping with Puppeteer

```javascript
// Script to scrape product information
await page.goto('https://example-shop.com/products');
await page.waitForSelector('.product-card');

const products = await page.evaluate(() => {
  const cards = document.querySelectorAll('.product-card');
  return Array.from(cards).map(card => ({
    name: card.querySelector('.product-name')?.textContent,
    price: card.querySelector('.product-price')?.textContent,
    url: card.querySelector('a')?.href
  }));
});

result = products;
```

**API Call:**
```bash
curl -X POST "https://multiprofile.org/api/profiles/profile_123/automation" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "automationType": "puppeteer",
    "script": "await page.goto('\''https://example-shop.com/products'\''); await page.waitForSelector('\'.product-card'\''); const products = await page.evaluate(() => { const cards = document.querySelectorAll('\'.product-card'\''); return Array.from(cards).map(card => ({ name: card.querySelector('\'.product-name'\'')?.textContent, price: card.querySelector('\'.product-price'\'')?.textContent, url: card.querySelector('\''a'\'')?.href })); }); result = products;",
    "timeout": 60000
  }'
```

### Example 2: Form Automation with Selenium

```javascript
// Automated login and data extraction
await driver.get('https://example.com/login');
await driver.findElement(By.css('#username')).sendKeys('your_username');
await driver.findElement(By.css('#password')).sendKeys('your_password');
await driver.findElement(By.css('#login-button')).click();

// Wait for dashboard to load
await driver.wait(until.titleContains('Dashboard'), 10000);

// Extract user data
const userData = await driver.executeScript(() => {
  return {
    name: document.querySelector('.user-name')?.textContent,
    email: document.querySelector('.user-email')?.textContent,
    balance: document.querySelector('.account-balance')?.textContent
  };
});

result = userData;
```

### Example 3: Python Selenium Integration

**Python Script to Control Browser Profiles:**

```python
import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class MultiProfileAutomation:
    def __init__(self, api_token, base_url="https://multiprofile.org/api"):
        self.api_token = api_token
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
    
    def get_profiles(self):
        """Get all browser profiles"""
        response = requests.get(f"{self.base_url}/profiles", headers=self.headers)
        return response.json()['profiles']
    
    def create_profile(self, name, description="", browser_type="CHROME", headless=False):
        """Create a new browser profile"""
        data = {
            "name": name,
            "description": description,
            "browserType": browser_type,
            "isHeadless": headless
        }
        response = requests.post(f"{self.base_url}/profiles", 
                               headers=self.headers, 
                               json=data)
        return response.json()
    
    def execute_automation(self, profile_id, script, automation_type="selenium", 
                          url="", headless=False, timeout=30000):
        """Execute automation script on a profile"""
        data = {
            "automationType": automation_type,
            "script": script,
            "url": url,
            "headless": headless,
            "timeout": timeout
        }
        response = requests.post(f"{self.base_url}/profiles/{profile_id}/automation",
                               headers=self.headers,
                               json=data)
        return response.json()
    
    def save_script(self, profile_id, name, script, description="", 
                   automation_type="selenium", tags=None):
        """Save an automation script"""
        if tags is None:
            tags = []
        
        data = {
            "name": name,
            "description": description,
            "script": script,
            "automationType": automation_type,
            "tags": tags,
            "isPublic": False
        }
        response = requests.post(f"{self.base_url}/profiles/{profile_id}/automation/scripts",
                               headers=self.headers,
                               json=data)
        return response.json()

# Usage Example
if __name__ == "__main__":
    # Initialize the client
    client = MultiProfileAutomation("YOUR_JWT_TOKEN")
    
    # Get all profiles
    profiles = client.get_profiles()
    print(f"Found {len(profiles)} profiles")
    
    # Create a new profile
    new_profile = client.create_profile(
        name="Python Automation Profile",
        description="Profile for Python Selenium automation",
        headless=True
    )
    profile_id = new_profile['profile']['id']
    print(f"Created profile: {profile_id}")
    
    # Execute a simple automation script
    login_script = """
    // Navigate to login page
    await driver.get('https://example.com/login');
    
    // Fill login form
    await driver.findElement(By.css('#username')).sendKeys('test_user');
    await driver.findElement(By.css('#password')).sendKeys('test_password');
    await driver.findElement(By.css('#login-button')).click();
    
    // Wait for login to complete
    await driver.wait(until.titleContains('Dashboard'), 10000);
    
    // Extract user information
    const userInfo = await driver.executeScript(() => {
        return {
            title: document.title,
            username: document.querySelector('.user-name')?.textContent,
            email: document.querySelector('.user-email')?.textContent
        };
    });
    
    result = userInfo;
    """
    
    result = client.execute_automation(
        profile_id=profile_id,
        script=login_script,
        automation_type="selenium",
        url="https://example.com/login",
        headless=True
    )
    
    print("Automation result:")
    print(json.dumps(result, indent=2))
    
    # Save the script for future use
    saved_script = client.save_script(
        profile_id=profile_id,
        name="Login Automation",
        script=login_script,
        description="Automated login with user data extraction",
        automation_type="SELENIUM",
        tags=["login", "automation", "python"]
    )
    
    print(f"Saved script with ID: {saved_script['script']['id']}")
```

### Example 4: Python Web Scraping with MultiProfile

```python
import requests
import json
import time
from datetime import datetime

class EcommerceScraper:
    def __init__(self, api_token):
        self.client = MultiProfileAutomation(api_token)
        self.results = []
    
    def scrape_products(self, profile_id, base_url, max_pages=5):
        """Scrape product data from e-commerce site"""
        
        for page in range(1, max_pages + 1):
            print(f"Scraping page {page}...")
            
            # Create scraping script for current page
            scrape_script = f"""
            // Navigate to the page
            await driver.get('{base_url}?page={page}');
            
            // Wait for products to load
            await driver.wait(until.elementLocated(By.css('.product-item')), 10000);
            
            // Extract product data
            const products = await driver.findElements(By.css('.product-item'));
            const productData = await Promise.all(products.map(async (product) => {{
                try {{
                    const name = await product.findElement(By.css('.product-name')).getText();
                    const price = await product.findElement(By.css('.product-price')).getText();
                    const url = await product.findElement(By.css('a')).getAttribute('href');
                    const image = await product.findElement(By.css('.product-image')).getAttribute('src');
                    
                    return {{
                        name: name,
                        price: price,
                        url: url,
                        image: image,
                        scraped_at: new Date().toISOString()
                    }};
                }} catch (error) {{
                    return {{
                        error: error.message,
                        element: 'product extraction failed'
                    }};
                }}
            }}));
            
            result = {{
                page: {page},
                total_products: productData.length,
                products: productData
            }};
            """
            
            # Execute the scraping script
            result = self.client.execute_automation(
                profile_id=profile_id,
                script=scrape_script,
                automation_type="selenium",
                timeout=45000
            )
            
            if result.get('success'):
                page_results = result['result']['result']
                self.results.extend(page_results['products'])
                print(f"Scraped {len(page_results['products'])} products from page {page}")
            else:
                print(f"Error scraping page {page}: {result.get('error')}")
            
            # Be respectful with delays
            time.sleep(2)
        
        return self.results
    
    def save_to_json(self, filename):
        """Save scraped data to JSON file"""
        with open(filename, 'w') as f:
            json.dump({
                'scraped_at': datetime.now().isoformat(),
                'total_products': len(self.results),
                'products': self.results
            }, f, indent=2)
        print(f"Data saved to {filename}")

# Usage
if __name__ == "__main__":
    # Initialize scraper
    scraper = EcommerceScraper("YOUR_JWT_TOKEN")
    
    # Get profiles and use the first one
    profiles = scraper.client.get_profiles()
    if profiles:
        profile_id = profiles[0]['id']
        
        # Scrape products
        products = scraper.scrape_products(
            profile_id=profile_id,
            base_url="https://example-shop.com/products",
            max_pages=3
        )
        
        # Save results
        scraper.save_to_json("scraped_products.json")
        
        print(f"Total products scraped: {len(products)}")
    else:
        print("No profiles found")
```

### Example 5: Python Form Automation with Error Handling

```python
import requests
import json
from typing import Dict, Any, Optional

class FormAutomation:
    def __init__(self, api_token):
        self.client = MultiProfileAutomation(api_token)
    
    def automated_form_submission(self, profile_id, form_data: Dict[str, Any], 
                                 login_url: str, target_url: str) -> Optional[Dict[str, Any]]:
        """
        Automated form submission with comprehensive error handling
        """
        
        automation_script = f"""
        try {{
            // Step 1: Navigate to login page
            await driver.get('{login_url}');
            console.log('Navigated to login page');
            
            // Step 2: Wait for form to load
            await driver.wait(until.elementLocated(By.css('#login-form')), 15000);
            console.log('Login form loaded');
            
            // Step 3: Fill in form fields
            const usernameField = await driver.findElement(By.css('#username'));
            const passwordField = await driver.findElement(By.css('#password'));
            
            await usernameField.sendKeys('{form_data.get('username', '')}');
            await passwordField.sendKeys('{form_data.get('password', '')}');
            console.log('Form fields filled');
            
            // Step 4: Submit form
            const submitButton = await driver.findElement(By.css('#submit-button'));
            await submitButton.click();
            console.log('Form submitted');
            
            // Step 5: Wait for navigation
            await driver.wait(until.titleContains('Dashboard'), 10000);
            console.log('Navigation completed');
            
            // Step 6: Navigate to target page
            await driver.get('{target_url}');
            await driver.wait(until.elementLocated(By.css('.content-area')), 10000);
            console.log('Target page loaded');
            
            // Step 7: Extract page data
            const pageData = await driver.executeScript(() => {{
                return {{
                    title: document.title,
                    url: window.location.href,
                    content: document.querySelector('.content-area')?.textContent?.substring(0, 500),
                    timestamp: new Date().toISOString()
                }};
            }});
            
            result = {{
                success: true,
                message: 'Form submission completed successfully',
                data: pageData
            }};
            
        }} catch (error) {{
            console.error('Automation failed:', error.message);
            result = {{
                success: false,
                error: error.message,
                step: 'automation_failed'
            }};
        }}
        """
        
        try:
            result = self.client.execute_automation(
                profile_id=profile_id,
                script=automation_script,
                automation_type="selenium",
                timeout=60000
            )
            
            return result
            
        except Exception as e:
            print(f"API request failed: {e}")
            return None
    
    def batch_form_submission(self, profile_id, form_data_list: list, 
                            login_url: str, target_url: str) -> list:
        """
        Submit multiple forms in batch
        """
        results = []
        
        for i, form_data in enumerate(form_data_list):
            print(f"Processing form {i+1}/{len(form_data_list)}...")
            
            result = self.automated_form_submission(
                profile_id=profile_id,
                form_data=form_data,
                login_url=login_url,
                target_url=target_url
            )
            
            results.append({
                'form_index': i,
                'form_data': form_data,
                'result': result
            })
            
            # Delay between submissions
            time.sleep(3)
        
        return results

# Usage Example
if __name__ == "__main__":
    # Initialize form automation
    form_bot = FormAutomation("YOUR_JWT_TOKEN")
    
    # Prepare form data
    form_data_list = [
        {'username': 'user1', 'password': 'pass1'},
        {'username': 'user2', 'password': 'pass2'},
        {'username': 'user3', 'password': 'pass3'}
    ]
    
    # Get profiles
    profiles = form_bot.client.get_profiles()
    if profiles:
        profile_id = profiles[0]['id']
        
        # Execute batch form submission
        results = form_bot.batch_form_submission(
            profile_id=profile_id,
            form_data_list=form_data_list,
            login_url="https://example.com/login",
            target_url="https://example.com/dashboard"
        )
        
        # Save results
        with open("form_submission_results.json", "w") as f:
            json.dump(results, f, indent=2)
        
        print(f"Batch submission completed. Results saved to form_submission_results.json")
        
        # Print summary
        successful = sum(1 for r in results if r['result'] and r['result'].get('success'))
        print(f"Successful submissions: {successful}/{len(results)}")
    else:
        print("No profiles found")
```

### Example 6: Screenshot Capture

```javascript
// Take a screenshot and capture page information
await page.goto('https://example.com');
await page.waitForSelector('main');

const screenshot = await page.screenshot({ 
  encoding: 'base64',
  fullPage: true 
});

const pageInfo = {
  title: await page.title(),
  url: await page.url(),
  timestamp: new Date().toISOString(),
  screenshot: screenshot.substring(0, 100) + '...' // Preview
};

result = pageInfo;
```

### Example 7: Python Screenshot and Monitoring

```python
import requests
import json
import base64
import os
from datetime import datetime
from typing import List, Dict, Any

class ScreenshotMonitor:
    def __init__(self, api_token):
        self.client = MultiProfileAutomation(api_token)
        self.screenshots_dir = "screenshots"
        
        # Create screenshots directory if it doesn't exist
        os.makedirs(self.screenshots_dir, exist_ok=True)
    
    def capture_screenshot(self, profile_id, url, filename=None, full_page=True):
        """Capture screenshot of a webpage"""
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"screenshot_{timestamp}.png"
        
        screenshot_script = f"""
        try {{
            // Navigate to the URL
            await driver.get('{url}');
            
            // Wait for page to load
            await driver.wait(until.elementLocated(By.css('body')), 10000);
            
            // Capture screenshot using JavaScript
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            // Get page dimensions
            const pageWidth = Math.max(
                document.body.scrollWidth, 
                document.body.offsetWidth, 
                document.documentElement.scrollWidth, 
                document.documentElement.offsetWidth
            );
            const pageHeight = Math.max(
                document.body.scrollHeight, 
                document.body.offsetHeight, 
                document.documentElement.scrollHeight, 
                document.documentElement.offsetHeight
            );
            
            canvas.width = pageWidth;
            canvas.height = pageHeight;
            
            // This is a simplified screenshot approach
            // In practice, you'd use a more sophisticated method
            const screenshotData = {{
                url: window.location.href,
                title: document.title,
                dimensions: {{
                    width: pageWidth,
                    height: pageHeight
                }},
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            }};
            
            result = {{
                success: true,
                screenshot_info: screenshotData,
                message: 'Screenshot metadata captured'
            }};
            
        }} catch (error) {{
            result = {{
                success: false,
                error: error.message
            }};
        }}
        """
        
        try:
            result = self.client.execute_automation(
                profile_id=profile_id,
                script=screenshot_script,
                automation_type="selenium",
                timeout=30000
            )
            
            if result.get('success'):
                # Save screenshot metadata
                metadata = {
                    'filename': filename,
                    'url': url,
                    'captured_at': datetime.now().isoformat(),
                    'profile_id': profile_id,
                    'result': result['result']['result']
                }
                
                with open(os.path.join(self.screenshots_dir, f"{filename}.json"), "w") as f:
                    json.dump(metadata, f, indent=2)
                
                print(f"Screenshot metadata saved: {filename}.json")
                return metadata
            else:
                print(f"Screenshot failed: {result.get('error')}")
                return None
                
        except Exception as e:
            print(f"Error capturing screenshot: {e}")
            return None
    
    def monitor_website_changes(self, profile_id, url, interval_minutes=60, max_captures=24):
        """Monitor website for changes by taking periodic screenshots"""
        
        captures = []
        
        for i in range(max_captures):
            print(f"Capture {i+1}/{max_captures}...")
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"monitor_{timestamp}"
            
            capture_result = self.capture_screenshot(
                profile_id=profile_id,
                url=url,
                filename=filename
            )
            
            if capture_result:
                captures.append(capture_result)
            
            # Wait for next capture
            if i < max_captures - 1:
                print(f"Waiting {interval_minutes} minutes before next capture...")
                time.sleep(interval_minutes * 60)
        
        # Save monitoring report
        report = {
            'monitoring_session': {
                'start_time': captures[0]['captured_at'] if captures else None,
                'end_time': captures[-1]['captured_at'] if captures else None,
                'total_captures': len(captures),
                'url': url,
                'interval_minutes': interval_minutes
            },
            'captures': captures
        }
        
        with open(os.path.join(self.screenshots_dir, "monitoring_report.json"), "w") as f:
            json.dump(report, f, indent=2)
        
        print(f"Monitoring report saved with {len(captures)} captures")
        return captures

# Usage Example
if __name__ == "__main__":
    # Initialize screenshot monitor
    monitor = ScreenshotMonitor("YOUR_JWT_TOKEN")
    
    # Get profiles
    profiles = monitor.client.get_profiles()
    if profiles:
        profile_id = profiles[0]['id']
        
        # Capture single screenshot
        screenshot = monitor.capture_screenshot(
            profile_id=profile_id,
            url="https://example.com",
            filename="example_homepage"
        )
        
        if screenshot:
            print("Screenshot captured successfully!")
        
        # Monitor website for changes (uncomment to use)
        # captures = monitor.monitor_website_changes(
        #     profile_id=profile_id,
        #     url="https://example.com",
        #     interval_minutes=5,  # Every 5 minutes for testing
        #     max_captures=3        # Only 3 captures for demo
        # )
    else:
        print("No profiles found")
```

### Example 8: Python Multi-step Workflow Automation

```python
import requests
import json
import time
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class WorkflowStep:
    name: str
    script: str
    expected_result: Optional[str] = None
    timeout: int = 30000
    continue_on_failure: bool = False

class WorkflowAutomation:
    def __init__(self, api_token):
        self.client = MultiProfileAutomation(api_token)
        self.workflow_results = []
    
    def execute_workflow(self, profile_id: str, workflow_name: str, steps: List[WorkflowStep]) -> Dict[str, Any]:
        """Execute a multi-step workflow"""
        
        print(f"Starting workflow: {workflow_name}")
        print(f"Total steps: {len(steps)}")
        
        workflow_start = time.time()
        successful_steps = 0
        failed_steps = 0
        
        for i, step in enumerate(steps):
            print(f"\nStep {i+1}/{len(steps)}: {step.name}")
            
            step_start = time.time()
            
            try:
                # Execute the step
                result = self.client.execute_automation(
                    profile_id=profile_id,
                    script=step.script,
                    automation_type="selenium",
                    timeout=step.timeout
                )
                
                step_duration = time.time() - step_start
                
                # Record step result
                step_result = {
                    'step_number': i + 1,
                    'step_name': step.name,
                    'success': result.get('success', False),
                    'duration_seconds': round(step_duration, 2),
                    'result': result,
                    'timestamp': datetime.now().isoformat()
                }
                
                if result.get('success'):
                    successful_steps += 1
                    print(f"✓ Step completed successfully in {step_duration:.2f}s")
                    
                    # Check if result matches expectation
                    if step.expected_result:
                        actual_result = str(result.get('result', {}).get('result', ''))
                        if step.expected_result.lower() in actual_result.lower():
                            print(f"✓ Expected result found: {step.expected_result}")
                        else:
                            print(f"⚠ Expected result not found. Expected: {step.expected_result}")
                else:
                    failed_steps += 1
                    error_msg = result.get('error', 'Unknown error')
                    print(f"✗ Step failed: {error_msg}")
                    
                    if not step.continue_on_failure:
                        print("Workflow stopped due to step failure")
                        break
                
                self.workflow_results.append(step_result)
                
            except Exception as e:
                step_duration = time.time() - step_start
                failed_steps += 1
                
                step_result = {
                    'step_number': i + 1,
                    'step_name': step.name,
                    'success': False,
                    'duration_seconds': round(step_duration, 2),
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }
                
                self.workflow_results.append(step_result)
                print(f"✗ Step failed with exception: {e}")
                
                if not step.continue_on_failure:
                    break
            
            # Small delay between steps
            if i < len(steps) - 1:
                time.sleep(2)
        
        # Calculate workflow summary
        workflow_duration = time.time() - workflow_start
        
        workflow_summary = {
            'workflow_name': workflow_name,
            'total_steps': len(steps),
            'successful_steps': successful_steps,
            'failed_steps': failed_steps,
            'success_rate': f"{(successful_steps/len(steps)*100):.1f}%",
            'total_duration_seconds': round(workflow_duration, 2),
            'started_at': datetime.fromtimestamp(workflow_start).isoformat(),
            'completed_at': datetime.now().isoformat(),
            'steps': self.workflow_results
        }
        
        print(f"\n{'='*50}")
        print(f"WORKFLOW SUMMARY: {workflow_name}")
        print(f"{'='*50}")
        print(f"Total Steps: {len(steps)}")
        print(f"Successful: {successful_steps}")
        print(f"Failed: {failed_steps}")
        print(f"Success Rate: {workflow_summary['success_rate']}")
        print(f"Total Duration: {workflow_duration:.2f}s")
        print(f"{'='*50}")
        
        return workflow_summary
    
    def create_ecommerce_workflow(self) -> List[WorkflowStep]:
        """Create a sample e-commerce workflow"""
        
        return [
            WorkflowStep(
                name="Navigate to Homepage",
                script="""
                await driver.get('https://example-shop.com');
                await driver.wait(until.titleContains('Shop'), 10000);
                result = 'Homepage loaded successfully';
                """,
                expected_result="Homepage loaded",
                timeout=15000
            ),
            
            WorkflowStep(
                name="Search for Product",
                script="""
                const searchBox = await driver.findElement(By.css('#search-input'));
                await searchBox.sendKeys('laptop');
                await searchBox.sendKeys(selenium.Key.RETURN);
                
                await driver.wait(until.elementLocated(By.css('.product-grid')), 10000);
                result = 'Search completed';
                """,
                expected_result="Search completed",
                timeout=15000
            ),
            
            WorkflowStep(
                name="Extract Search Results",
                script="""
                const products = await driver.findElements(By.css('.product-item'));
                const productData = await Promise.all(products.slice(0, 5).map(async (product) => {
                    try {
                        const name = await product.findElement(By.css('.product-name')).getText();
                        const price = await product.findElement(By.css('.product-price')).getText();
                        return { name, price };
                    } catch (e) {
                        return { error: e.message };
                    }
                }));
                
                result = { 
                    total_products: products.length,
                    extracted_products: productData.length,
                    products: productData
                };
                """,
                timeout=10000
            ),
            
            WorkflowStep(
                name="Click First Product",
                script="""
                const firstProduct = await driver.findElement(By.css('.product-item'));
                await firstProduct.click();
                
                await driver.wait(until.elementLocated(By.css('.product-detail')), 10000);
                result = 'Product detail page loaded';
                """,
                expected_result="Product detail page",
                timeout=15000
            ),
            
            WorkflowStep(
                name="Extract Product Details",
                script="""
                const productDetails = await driver.executeScript(() => {
                    return {
                        title: document.title,
                        price: document.querySelector('.price')?.textContent,
                        description: document.querySelector('.description')?.textContent?.substring(0, 200),
                        availability: document.querySelector('.stock-status')?.textContent
                    };
                });
                
                result = productDetails;
                """,
                timeout=10000
            ),
            
            WorkflowStep(
                name="Add to Cart",
                script="""
                const addToCartButton = await driver.findElement(By.css('#add-to-cart'));
                await addToCartButton.click();
                
                // Wait for cart confirmation
                await driver.wait(until.elementLocated(By.css('.cart-confirmation')), 5000);
                result = 'Product added to cart';
                """,
                expected_result="added to cart",
                timeout=10000,
                continue_on_failure=True  # Continue even if add to cart fails
            ),
            
            WorkflowStep(
                name="View Cart",
                script="""
                await driver.get('https://example-shop.com/cart');
                await driver.wait(until.elementLocated(By.css('.cart-items')), 10000);
                
                const cartItems = await driver.findElements(By.css('.cart-item'));
                result = { 
                    cart_items_count: cartItems.length,
                    message: 'Cart viewed successfully'
                };
                """,
                timeout=10000
            )
        ]
    
    def save_workflow_report(self, workflow_summary: Dict[str, Any], filename: str = None):
        """Save workflow execution report"""
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"workflow_report_{timestamp}.json"
        
        with open(filename, "w") as f:
            json.dump(workflow_summary, f, indent=2)
        
        print(f"Workflow report saved: {filename}")
        return filename

# Usage Example
if __name__ == "__main__":
    # Initialize workflow automation
    workflow_bot = WorkflowAutomation("YOUR_JWT_TOKEN")
    
    # Get profiles
    profiles = workflow_bot.client.get_profiles()
    if profiles:
        profile_id = profiles[0]['id']
        
        # Create e-commerce workflow
        workflow_steps = workflow_bot.create_ecommerce_workflow()
        
        # Execute the workflow
        workflow_result = workflow_bot.execute_workflow(
            profile_id=profile_id,
            workflow_name="E-commerce Product Research",
            steps=workflow_steps
        )
        
        # Save the workflow report
        report_filename = workflow_bot.save_workflow_report(workflow_result)
        
        print(f"\nWorkflow completed! Report saved to: {report_filename}")
        
        # Print summary of extracted data
        if workflow_result['successful_steps'] > 0:
            print("\nExtracted Data Summary:")
            for step in workflow_result['steps']:
                if step['success'] and 'result' in step and step['result'].get('success'):
                    step_result = step['result'].get('result', {}).get('result', {})
                    if isinstance(step_result, dict) and 'products' in step_result:
                        print(f"- Found {len(step_result['products'])} products in search")
                    elif isinstance(step_result, dict) and 'title' in step_result:
                        print(f"- Product: {step_result.get('title', 'N/A')}")
                    elif isinstance(step_result, dict) and 'cart_items_count' in step_result:
                        print(f"- Cart items: {step_result['cart_items_count']}")
    else:
        print("No profiles found")
```

### Example 4: Multi-step Workflow

```javascript
// Complex workflow: login -> navigate -> extract data -> logout
try {
  // Step 1: Login
  await page.goto('https://example.com/login');
  await page.type('#username', 'your_username');
  await page.type('#password', 'your_password');
  await page.click('#login-button');
  
  // Step 2: Wait for dashboard
  await page.waitForNavigation();
  
  // Step 3: Navigate to reports
  await page.click('#reports-link');
  await page.waitForSelector('#reports-table');
  
  // Step 4: Extract report data
  const reports = await page.evaluate(() => {
    const rows = document.querySelectorAll('#reports-table tr');
    return Array.from(rows).slice(1).map(row => ({
      id: row.cells[0]?.textContent,
      date: row.cells[1]?.textContent,
      amount: row.cells[2]?.textContent
    }));
  });
  
  // Step 5: Logout
  await page.click('#logout-button');
  
  result = {
    success: true,
    reportsCount: reports.length,
    reports: reports
  };
  
} catch (error) {
  result = {
    success: false,
    error: error.message
  };
}
```

## Best Practices

### 1. Script Organization

- **Use descriptive names** for your automation scripts
- **Add comments** to explain complex logic
- **Break down complex tasks** into smaller, reusable functions
- **Store scripts** in the system for easy reuse

### 2. Error Handling

```javascript
// Always wrap your code in try-catch
try {
  await page.goto('https://example.com');
  await page.waitForSelector('#important-element');
  
  // Your automation logic here
  result = 'Task completed successfully';
  
} catch (error) {
  // Log the error for debugging
  console.error('Automation failed:', error.message);
  
  // Return error information
  result = {
    success: false,
    error: error.message,
    step: 'element-wait'
  };
}
```

### 3. Performance Optimization

- **Use appropriate timeouts** - not too short, not too long
- **Wait for specific elements** rather than fixed delays
- **Reuse browser sessions** when possible
- **Clean up resources** after execution

### 4. Security Considerations

- **Never hardcode credentials** in scripts
- **Use environment variables** for sensitive data
- **Validate input data** before processing
- **Follow the principle of least privilege**

### 5. Rate Limiting

- **Respect rate limits**: 10 executions per minute per profile
- **Use batch operations** when possible
- **Implement retry logic** for failed requests
- **Monitor usage** to avoid hitting limits

## Troubleshooting

### Common Issues and Solutions

#### 1. "Element Not Found" Errors

**Problem:** Script fails because it can't find an element.

**Solution:**
```javascript
// Use explicit waits instead of fixed delays
await page.waitForSelector('#my-element', { timeout: 10000 });

// Check if element exists before interacting
const element = await page.$('#my-element');
if (element) {
  await element.click();
} else {
  result = { error: 'Element not found' };
}
```

#### 2. Timeout Errors

**Problem:** Scripts take too long to execute.

**Solution:**
```javascript
// Increase timeout for slow operations
await page.goto('https://slow-website.com', { 
  waitUntil: 'networkidle2',
  timeout: 60000 
});

// Use specific waits instead of long timeouts
await page.waitForFunction(() => {
  return document.querySelector('.loaded-indicator') !== null;
}, { timeout: 30000 });
```

#### 3. Authentication Issues

**Problem:** API requests return 401 Unauthorized.

**Solution:**
```bash
# Check your token is valid
curl -X GET "https://multiprofile.org/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# If expired, get a new token from your dashboard
```

#### 4. Memory/Resource Issues

**Problem:** Scripts consume too much memory or resources.

**Solution:**
```javascript
// Clean up after execution
await page.close();
await browser.close();

// Process data in chunks for large datasets
const items = await page.evaluate(() => {
  const elements = document.querySelectorAll('.item');
  return Array.from(elements).slice(0, 100).map(el => el.textContent);
});
```

### Debug Mode

Enable verbose logging for debugging:

```javascript
console.log('Starting automation...');
console.log('Current URL:', await page.url());
console.log('Page title:', await page.title());

// Your automation code here

console.log('Automation completed successfully');
result = 'Debug information logged';
```

### Getting Help

If you need additional support:

1. **Check the execution results** for detailed error messages
2. **Review the browser console** for client-side errors
3. **Test scripts in the dashboard** before using the API
4. **Contact support** through the platform's help center
5. **Check the status page** for platform issues

## Next Steps

Now that you understand how to use the MultiProfile.org API, you can:

1. **Create your first automation script** using the examples provided
2. **Integrate with your existing tools** and workflows
3. **Build custom applications** on top of our platform
4. **Explore advanced features** like proxy management and user agent rotation
5. **Join our community** to share tips and best practices

Happy automating! 🚀