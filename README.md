---

# OAuth Authorization Flow Library

This library simplifies the **OAuth Authorization flow** for different client providers, making it easy to integrate OAuth in both **browser** and **server environments**.

### 📁 Project Structure:

- **browser-test**: Contains a demo for browser-based environments.
- **server-test**: Contains a demo for server-side environments.
- **library**: The core code of the OAuth library.

---

## 🚀 Quick Start Guide

1. Navigate to the **lib** directory:
   ```bash
   npm install
   npm link
   ```
   `npm link` is done to link our local libary to the global node modules

### 💻 Browser Demo (Client-side)

1. Navigate to the **browser_test** directory:
   ```bash
   cd browser_test
   npm link oauth-lib
   npm run dev
   ```
2. Open your browser and go to:
   ```
   http://localhost:3000
   ```

3. You’ll see a **Login** button. Click it to initiate the OAuth login process. Once logged in, your **name** and **email** will be displayed on the page.

4. Want to refresh the token? Simply click the **Refresh Token** button!

---

### 🌐 Server Demo (Server-side)

1. Navigate to the **server_test** directory:
   ```bash
   cd server_test
   npm link oauth-lib
   npm run dev
   ```
   
2. Open your browser and go to:
   ```
   http://localhost:3000/homepage
   ```

   If you are **not logged in**, your **name** and **email** will display as **undefined**. To log in:

3. Go to the URL:
   ```
   http://localhost:3000/authorise
   ```

   After you log in, you'll be redirected back to `/homepage`, where your **name** and **email** from the logged-in state will be displayed.

4. Post-login, the **access_token** and **id_token** are stored in browser **cookies**.

---

## 🔄 Use Your Own OAuth Provider

For testing purposes, the **Auth0 credentials** are already provided in the code. If you want to use your own credentials, follow these steps:

### 👨‍💻 Steps:

1. Go to your OAuth provider and create an application:
   - For **client-side testing** (browser), choose **"Single Page Application"**.
   - For **server-side testing**, select **"Server Application"**.

2. Get the following information from your provider:
   - **Authorization Domain**
   - **Client ID**
   - **Client Secret** (required only for server-side applications)
   
3. For the **Redirect URI** or **Callback URLs**, use:
   ```
   http://localhost:3000
   ```

4. Get the **Authorization URL** and **Token URL** from the OAuth provider’s documentation:
   
   - For **Auth0**, go to your application’s settings, scroll down, and click on **Additional Settings** to find the endpoints.
   
   - For **Kinde**, the **Authorization Endpoint** is:
     ```
     {domain}/oauth2/auth
     ```
     and the **Token Endpoint** is:
     ```
     {domain}/oauth2/token
     ```

5. Update the Code

- **For Browser-based applications**: 
  - Navigate to `/src/app/page.tsx`.
  - Update the **options** when creating the `OAuthClient` instance (e.g., using your provider’s credentials or scopes).

- **For Server-based applications**: 
  - Navigate to `/src/server.ts`.
  - Update the **options object** for the `OAuthClient` in the server-side code with your specific configuration.

---

## 🌐 How the OAuth Library Works

Here’s a step-by-step breakdown of how the OAuth authorization flow works in this library:

1. **User clicks the "Login" button**:
   - The user is redirected to the **OAuth provider’s login page** (e.g., Auth0, Google, etc.).
   
2. **User logs in**:
   - The user enters their credentials (username/password) on the provider’s login page.
   
3. **Redirection back to your app**:
   - After successful login, the user is redirected back to your app (usually to `http://localhost:3000`).
   - The URL will contain some query parameters, including an **authorization code** (or an error if something went wrong).
   
4. **Authorization code is exchanged for tokens**:
   - Your app takes the authorization code from the URL and exchanges it with the OAuth provider for **tokens** (including the **access token** and **ID token**).
   - These tokens are returned along with some basic **user information**.

5. **Token storage**:
   - In **browser applications**: The token is stored in the browser’s **local storage**.
   - In **server applications**: The token is stored in **cookies** for secure access across requests.

6. **Using the tokens**:
   - The **access token** can now be used to make further API calls to the OAuth provider or other services that require authentication.

---

### 📝 Example Workflow:

1. **Login flow (browser)**:
   - User clicks **Login**.
   - Redirects to OAuth provider (e.g., Auth0) -> User logs in.
   - Redirects back to `http://localhost:3000?code=AUTHORIZATION_CODE`.
   - Authorization code is exchanged for tokens.
   - **Access token** is stored in **local storage** and displayed for future use.

2. **Login flow (server)**:
   - User initiates login.
   - Redirects to OAuth provider -> User logs in.
   - Redirects back to `http://localhost:3000/?code=AUTHORIZATION_CODE`.
   - Authorization code is exchanged for tokens and the user is redirected to `http://localhost:3000`.
   - **Access token** is stored in **cookies** for secure use in subsequent API calls.

---

### 🔄 Token Management:

- The **access token** and **ID token** allow you to make authenticated requests to APIs.
- In **browser-based** applications, the tokens are stored in **local storage** to maintain user sessions.
- In **server-based** applications, tokens are stored in **cookies** for server-side authentication and API requests.






---

## ⚠️ Common Errors and Solutions

### 🔄 Redirect Token Error:
- If you encounter errors related to the **redirect_token**, this might be due to the **offline_access** scope not being enabled in your provider’s application.
- Either you can change the setting of the application or just use the scope 
    ```bash
   scope: "openid profile email"
   ```
   while creating the OAuth client
   
---

Feel free to replace the Auth0 details in the demo with your own OAuth provider’s credentials and test the library as needed. We hope this documentation helps make the OAuth integration process easier for you! 😊

--- 
