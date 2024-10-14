import express, { Request, Response } from "express";
import { OAuthClient } from "oauth-lib/es5";
// import OAuthClient from "../lib/OAuthV2";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const options = {
  redirectUri: "http://localhost:3000",
  authorizationEndpoint: "https://rohitt24k.kinde.com/oauth2/auth",
  clientId: "6989aba7ebc84d3fb036ca43dfe90f7b",
  tokenEndpoint: "https://rohitt24k.kinde.com/oauth2/token",
  clientSecret: "np2SpCAfR3lf8NwBbW4cpON4fYnNl6aTDDiSc8A10RjW7VnNXypa",
  scope: "openid profile email",
};

app.get("/", async (req: Request, res: Response) => {
  const client = new OAuthClient(options);

  const query = req.query;

  if (query["code"]) {
    const params = { code: query["code"], error: query["error"] };
    const data = await client.handleCallback(
      params as Record<string, string>,
      res
    );

    console.log(data);
    return res.redirect("/homepage");
  }

  res.json({ data: "Hello, TypeScript with Express!", query });
});

app.get("/authorise", async (req: Request, res: Response) => {
  const client = new OAuthClient(options);

  const authUrl = await client.startAuthFlow();

  res.redirect(authUrl);
});

app.get("/homepage", (req: Request, res: Response) => {
  const client = new OAuthClient(options);

  const cookies = req.cookies;
  if (cookies["id_token"]) {
    client.decodeUserInfo(cookies["id_token"]);
  }

  const user = { name: client.userInfo?.name, email: client.userInfo?.email };
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Homepage</title>
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #f0f0f0;
            }
            .container {
                display: flex;
                gap: 2rem;
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .button {
                border: 1px solid #ccc;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                background-color: #ffffff;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #333;
                color: white;
            }
            .user-info {
                display: flex;
                flex-direction: column;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <button class="button">Login</button>
            <button class="button">Refresh Token</button>
            <div class="user-info">
                <div>name = ${user.name}</div>
                <div>email = ${user.email}</div>
            </div>
        </div>
    </body>
    </html>
    `;
  res.send(htmlContent);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
