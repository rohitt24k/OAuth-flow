"use client";
// import OAuthClient from "@/lib/OAuthV2";
import { OAuthClient } from "oauth-lib/es6";
import { IUserInfo } from "@/lib/types";
import React, { useEffect, useState } from "react";

const client = new OAuthClient({
  redirectUri: "http://localhost:3000",
  authorizationEndpoint: "https://dev-brau7m1ab2yjx4xr.us.auth0.com/authorize",
  clientId: "H4NPI2JGlJEnRvEhZQIEwxca7fN22mCM",
  tokenEndpoint: "https://dev-brau7m1ab2yjx4xr.us.auth0.com/oauth/token",
  pkce: true,
});

export default function Home() {
  const [user, setUser] = useState<IUserInfo | undefined>();
  const [refreshToken, setRefreshToken] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem("refresh_token")
  );

  const handleLogin = async () => {
    const authUrl = await client.startAuthFlow();

    window.location.href = authUrl;
  };

  useEffect(() => {
    const handleCallback = async () => {
      const params = Object.fromEntries(new URLSearchParams(location.search));
      if (params["code"]) {
        try {
          const data = await client.handleCallback(params);
          if (data.data.refresh_token) setRefreshToken(data.data.refresh_token);
          if (data.userInfo) setUser(data.userInfo);
        } catch (error) {
          console.error("Auth error:", error);
        }
      }
    };

    handleCallback();
  }, []);

  useEffect(() => {
    const handleAync = async () => {
      const data = await client.handleInitialSetup();

      setUser(data);
    };
    handleAync();
  }, []);

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-8 ">
      <div className=" space-x-4">
        <Button
          onClick={() => {
            handleLogin();
          }}
        >
          Login
        </Button>
        <Button
          onClick={async () => {
            const data = await client.handleRefreshToken();
            if (data.refresh_token) setRefreshToken(data.refresh_token);
          }}
        >
          Refresh Token
        </Button>
      </div>

      <div>
        {user && (
          <div>
            <div>name = {user.name}</div>
            <div>email = {user.email}</div>
            <div>refresh_token = {refreshToken}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const Button = ({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}) => {
  return (
    <button
      className=" border py-2 px-4 hover:bg-gray-800 rounded-md "
      {...rest}
    >
      {children}
    </button>
  );
};
