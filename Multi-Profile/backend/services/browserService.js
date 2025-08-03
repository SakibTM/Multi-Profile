// backend/services/browserService.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

class BrowserService {
  constructor() {
    this.activeBrowsers = new Map();
  }

  async launchProfile(profile) {
    try {
      const profileId = uuidv4();
      const browserType = profile.browserType;
      const headless = profile.headless;
      
      // Prepare browser launch options
      const launchOptions = {
        headless,
        userDataDir: profile.storagePath,
        args: profile.launchArgs || []
      };

      // Add proxy if enabled
      if (profile.proxy.enabled) {
        launchOptions.args.push(`--proxy-server=${profile.proxy.type}://${profile.proxy.host}:${profile.proxy.port}`);
      }

      // Add fingerprint spoofing
      if (profile.fingerprint) {
        // Add WebRTC configuration
        if (profile.fingerprint.webRTC.mode === 'disabled') {
          launchOptions.args.push('--disable-webrtc');
        } else if (profile.fingerprint.webRTC.mode === 'custom' && profile.fingerprint.webRTC.publicIP) {
          // In a real implementation, you would use a plugin to override WebRTC IPs
        }

        // Add user agent if specified
        if (profile.fingerprint.userAgent) {
          launchOptions.args.push(`--user-agent=${profile.fingerprint.userAgent}`);
        }

        // Add language if specified
        if (profile.fingerprint.language) {
          launchOptions.args.push(`--lang=${profile.fingerprint.language}`);
        }

        // Add timezone if specified
        if (profile.fingerprint.timezone) {
          launchOptions.args.push(`--timezone=${profile.fingerprint.timezone}`);
        }

        // Add screen resolution if specified
        if (profile.fingerprint.screenResolution) {
          const [width, height] = profile.fingerprint.screenResolution.split('x');
          launchOptions.args.push(`--window-size=${width},${height}`);
          launchOptions.args.push(`--window-position=${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 100)}`);
        }
      }

      // In a real implementation, you would spawn a separate process to handle the browser
      // For now, we'll just simulate the process
      
      const browserProcess = spawn('node', [
        path.join(__dirname, '../scripts/launchBrowser.js'),
        JSON.stringify({
          profileId,
          browserType,
          launchOptions
        })
      ]);

      // Store the process reference
      this.activeBrowsers.set(profileId, {
        process: browserProcess,
        profile
      });

      // Handle process events
      browserProcess.on('exit', (code) => {
        this.activeBrowsers.delete(profileId);
        console.log(`Browser process ${profileId} exited with code ${code}`);
      });

      browserProcess.on('error', (err) => {
        this.activeBrowsers.delete(profileId);
        console.error(`Browser process ${profileId} error:`, err);
      });

      return {
        success: true,
        profileId,
        message: 'Browser launched successfully'
      };
    } catch (error) {
      console.error('Error launching browser:', error);
      return {
        success: false,
        message: 'Failed to launch browser',
        error: error.message
      };
    }
  }

  async closeProfile(profileId) {
    try {
      const browserData = this.activeBrowsers.get(profileId);
      
      if (!browserData) {
        return {
          success: false,
          message: 'Browser not found'
        };
      }

      // Kill the browser process
      browserData.process.kill();
      
      // Remove from active browsers
      this.activeBrowsers.delete(profileId);

      return {
        success: true,
        message: 'Browser closed successfully'
      };
    } catch (error) {
      console.error('Error closing browser:', error);
      return {
        success: false,
        message: 'Failed to close browser',
        error: error.message
      };
    }
  }

  getActiveBrowsers() {
    return Array.from(this.activeBrowsers.entries()).map(([id, data]) => ({
      id,
      profile: data.profile,
      pid: data.process.pid
    }));
  }
}

module.exports = new BrowserService();