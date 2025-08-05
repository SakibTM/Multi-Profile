# MultiProfile Support System Configuration

This document explains how to configure and manage the customer support system for MultiProfile.org.

## Overview

The support system provides three main channels for customer support:
1. **Live Chat** - Real-time messaging with support agents
2. **Telegram** - Instant support through Telegram bot
3. **Email Support** - Formal ticket submission system

## Environment Variables Configuration

All support system configurations are managed through environment variables in the `.env` file.

### Required Environment Variables

```bash
# Live Chat Configuration
NEXT_PUBLIC_LIVE_CHAT_ENABLED=true
NEXT_PUBLIC_SUPPORT_HOURS="24/7"
NEXT_PUBLIC_RESPONSE_TIME="5 minutes"

# Telegram Support Configuration
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="MultiProfileSupportBot"
NEXT_PUBLIC_TELEGRAM_SUPPORT_URL="https://t.me/MultiProfileSupport"

# Email Support Configuration
NEXT_PUBLIC_SUPPORT_EMAIL="support@multiprofile.org"
NEXT_PUBLIC_PHONE_SUPPORT="+1 (555) 123-4567"
```

### Variable Descriptions

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_LIVE_CHAT_ENABLED` | Enable/disable live chat functionality | `true` | `true` |
| `NEXT_PUBLIC_SUPPORT_HOURS` | Support availability hours | `"24/7"` | `"9 AM - 6 PM EST"` |
| `NEXT_PUBLIC_RESPONSE_TIME` | Average response time | `"5 minutes"` | `"15 minutes"` |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Telegram bot username | `"MultiProfileSupportBot"` | `"YourSupportBot"` |
| `NEXT_PUBLIC_TELEGRAM_SUPPORT_URL` | Telegram support link | `"https://t.me/MultiProfileSupport"` | `"https://t.me/YourSupportBot"` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support email address | `"support@multiprofile.org"` | `"support@yourcompany.com"` |
| `NEXT_PUBLIC_PHONE_SUPPORT` | Phone support number | `"+1 (555) 123-4567"` | `"+1 (800) 555-0123"` |

## Setup Instructions

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual support configuration:
   ```bash
   # Live Chat Configuration
   NEXT_PUBLIC_LIVE_CHAT_ENABLED=true
   NEXT_PUBLIC_SUPPORT_HOURS="24/7"
   NEXT_PUBLIC_RESPONSE_TIME="5 minutes"

   # Telegram Support Configuration
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="YourSupportBot"
   NEXT_PUBLIC_TELEGRAM_SUPPORT_URL="https://t.me/YourSupportBot"

   # Email Support Configuration
   NEXT_PUBLIC_SUPPORT_EMAIL="support@yourcompany.com"
   NEXT_PUBLIC_PHONE_SUPPORT="+1 (800) 555-0123"
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

### 2. Telegram Bot Setup

To set up the Telegram support bot:

1. **Create a Telegram Bot**:
   - Open Telegram and search for "@BotFather"
   - Use the `/newbot` command to create a new bot
   - Follow the prompts to set up bot name and username
   - Save the bot token for future reference

2. **Configure Bot Commands** (optional):
   ```
   /start - Welcome message and help
   /support - Contact human support
   /faq - Frequently asked questions
   /status - Check system status
   ```

3. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="YourBotUsername"
   NEXT_PUBLIC_TELEGRAM_SUPPORT_URL="https://t.me/YourBotUsername"
   ```

### 3. Email Support Setup

To set up email support:

1. **Configure Email Server** (for production):
   - Set up an email server (SMTP) or use a service like SendGrid, Mailgun, or AWS SES
   - Configure email routing to your support team
   - Set up auto-responders and ticket management

2. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_SUPPORT_EMAIL="support@yourcompany.com"
   NEXT_PUBLIC_PHONE_SUPPORT="+1 (800) 555-0123"
   ```

### 4. Live Chat Setup

The live chat system is built into the application and requires minimal setup:

1. **Enable/Disable Live Chat**:
   ```bash
   NEXT_PUBLIC_LIVE_CHAT_ENABLED=true  # or false
   ```

2. **Configure Support Hours**:
   ```bash
   NEXT_PUBLIC_SUPPORT_HOURS="9 AM - 6 PM EST"  # or "24/7"
   ```

3. **Set Response Time**:
   ```bash
   NEXT_PUBLIC_RESPONSE_TIME="15 minutes"  # or any appropriate time
   ```

## Features Overview

### Live Chat Features

- **Real-time messaging** with support agents
- **Connection status indicators** (Online/Offline/Connecting)
- **Message status tracking** (Sent/Delivered/Read)
- **Common topics quick selection**
- **Support information sidebar**
- **Auto-scrolling message history**
- **Responsive design** for mobile and desktop

### Telegram Support Features

- **Bot username display** with copy functionality
- **Direct Telegram link** for instant access
- **Benefits overview** (24/7 availability, community support, etc.)
- **What to expect** section
- **Rich media support** capabilities
- **Multilingual support** ready

### Email Support Features

- **Comprehensive ticket form** with validation
- **Priority levels** (Low, Medium, High, Urgent)
- **Category selection** (Technical, Billing, Account, etc.)
- **Response time expectations** based on priority
- **Ticket status tracking**
- **Success/error handling**
- **Contact information display**

## Customization Options

### Styling and Branding

The support page uses the existing design system:
- **Colors**: Follows the established color palette
- **Typography**: Consistent with the rest of the application
- **Components**: Uses shadcn/ui components for consistency
- **Responsive**: Mobile-first design approach

### Content Customization

You can customize the support page content by modifying:

1. **Welcome Messages**: Edit the live chat welcome message in `support/page.tsx`
2. **FAQ Section**: Update the frequently asked questions array
3. **Support Categories**: Modify the email form category options
4. **Response Templates**: Customize automated responses in the live chat

### Feature Toggles

You can enable/disable specific features:

```bash
# Disable live chat
NEXT_PUBLIC_LIVE_CHAT_ENABLED=false

# Change support hours
NEXT_PUBLIC_SUPPORT_HOURS="9 AM - 5 PM PST"

# Update response time
NEXT_PUBLIC_RESPONSE_TIME="30 minutes"
```

## Testing the Support System

### 1. Live Chat Testing

1. Navigate to `/support` in your browser
2. Click on the "Live Chat" tab
3. Wait for the connection to establish (shows "Online")
4. Type a message and send it
5. Verify the automated response appears
6. Test the common topics buttons

### 2. Telegram Support Testing

1. Navigate to `/support` in your browser
2. Click on the "Telegram" tab
3. Verify the bot username and URL are correct
4. Test the copy functionality for both fields
5. Click the "Open in Telegram" button (should open in new tab)

### 3. Email Support Testing

1. Navigate to `/support` in your browser
2. Click on the "Email Support" tab
3. Fill out all required fields in the form
4. Submit the form
5. Verify the success message appears
6. Test form validation with empty fields

## Production Considerations

### Security

- **Environment Variables**: Ensure sensitive information is in `.env` files and not committed to version control
- **CSRF Protection**: The form includes built-in CSRF protection
- **Input Validation**: All user inputs are validated on both client and server
- **Rate Limiting**: Consider implementing rate limiting for form submissions

### Performance

- **Lazy Loading**: The support page loads only when accessed
- **Optimized Images**: Use optimized images for icons and illustrations
- **Caching**: Implement appropriate caching strategies for static assets
- **CDN**: Use a CDN for faster content delivery

### Monitoring

- **Error Tracking**: Implement error tracking for support interactions
- **Analytics**: Track support channel usage and response times
- **Performance Monitoring**: Monitor page load times and interaction metrics
- **User Feedback**: Collect feedback on support quality

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Ensure `.env` file is in the project root
   - Restart the development server after making changes
   - Verify variable names are correct

2. **Live Chat Not Connecting**:
   - Check if `NEXT_PUBLIC_LIVE_CHAT_ENABLED` is set to `true`
   - Verify the development server is running
   - Check browser console for errors

3. **Telegram Links Not Working**:
   - Verify `NEXT_PUBLIC_TELEGRAM_SUPPORT_URL` is correct
   - Test the URL directly in a browser
   - Ensure the bot is active on Telegram

4. **Email Form Not Submitting**:
   - Check all required fields are filled
   - Verify email format is valid
   - Check browser console for validation errors

### Debug Mode

For debugging, you can enable additional logging:

```javascript
// In support/page.tsx, add console logging
console.log('Support Config:', config)
console.log('Connection Status:', isConnected)
console.log('Messages:', messages)
```

## Future Enhancements

### Planned Features

1. **Real Agent Integration**: Connect to actual support agents via WebSocket
2. **File Attachments**: Allow users to upload screenshots and logs
3. **Knowledge Base**: Integrate with documentation and FAQ system
4. **Chat History**: Save and retrieve chat history for users
5. **Multilingual Support**: Add support for multiple languages
6. **Mobile App Integration**: Extend support to mobile applications
7. **AI Chatbot**: Implement AI-powered automated responses
8. **Video Chat**: Add video call support for complex issues

### Integration Opportunities

1. **CRM Integration**: Connect with customer relationship management systems
2. **Help Desk Software**: Integrate with Zendesk, Freshdesk, or similar
3. **Analytics**: Integrate with Google Analytics or Mixpanel
4. **Notification System**: Add email/SMS notifications for support responses
5. **Payment Integration**: Add support for billing-related inquiries

## Support

For questions about the support system configuration:

1. **Documentation**: Refer to this guide and the main documentation
2. **Code Review**: Review the implementation in `/src/app/support/page.tsx`
3. **Environment Variables**: Check `.env.example` for all available options
4. **Testing**: Use the provided testing procedures to verify functionality

---

This support system is designed to be flexible, scalable, and easy to configure. All aspects are controlled through environment variables, making it simple to adapt to different support workflows and business requirements.