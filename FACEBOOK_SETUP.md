# Facebook Login Setup for Localhost

## Issue
Facebook requires HTTPS for login, but localhost should work for development.

## Solutions

### Option 1: Configure Facebook App (Recommended)
1. Go to https://developers.facebook.com/apps/
2. Select your app (ID: 925493953121496)
3. Go to Settings > Basic
4. Add `http://localhost:5173` to "App Domains"
5. Go to Settings > Advanced
6. Under "Security", make sure "Require App Secret" is enabled
7. Add `http://localhost:5173` to "Valid OAuth Redirect URIs"

### Option 2: Use HTTPS for Localhost
1. Install mkcert: `npm install -g mkcert` or download from https://github.com/FiloSottile/mkcert
2. Run: `mkcert -install`
3. Run: `mkcert localhost 127.0.0.1`
4. This creates `localhost.pem` and `localhost-key.pem`
5. Update `vite.config.js` to use these certificates

### Option 3: Use ngrok or similar
Use a service like ngrok to create an HTTPS tunnel to your localhost.

