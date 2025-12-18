import React, { useEffect, useState } from "react";

const OAuthCallback = () => {
  const [googleCode, setGoogleCode] = useState(null);
  const [facebookAccessToken, setFacebookAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);

  useEffect(() => {
    // Check for errors in query string
    const params = new URLSearchParams(window.location.search);
    const errorFromURL = params.get("error");
    const errorDescFromURL = params.get("error_description");

    // Check for Facebook auth in URL hash (comes first in OAuth flow)
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const hashParams = new URLSearchParams(hash);
    const facebookAccessTokenFromURL = hashParams.get("access_token");

    // Check for Google auth code in query string
    const codeFromURL = params.get("code");

    if (errorFromURL) {
      // Handle OAuth error - redirect to app with error
      setError(errorFromURL);
      setErrorDescription(errorDescFromURL);
      const errorLink = `lcm://authredirect?error=${encodeURIComponent(errorFromURL)}&error_description=${encodeURIComponent(errorDescFromURL || '')}`;
      window.location.href = errorLink;
      return;
    }

    if (facebookAccessTokenFromURL) {
      // Facebook OAuth flow - prioritize Facebook token
      setFacebookAccessToken(facebookAccessTokenFromURL);

      // Auto redirect to app with Facebook access_token
      // This will navigate to authredirect screen which will save token and go to MetaWorker
      const appLink = `lcm://authredirect?access_token=${encodeURIComponent(facebookAccessTokenFromURL)}`;
      window.location.href = appLink;
    } else if (codeFromURL) {
      // Google OAuth flow
      setGoogleCode(codeFromURL);

      // Auto redirect to app with Google code as token
      const appLink = `lcm://authredirect?token=${encodeURIComponent(codeFromURL)}`;
      window.location.href = appLink;
    }
  }, []);

  const getManualLink = () => {
    if (error) {
      return `lcm://authredirect?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`;
    } else if (facebookAccessToken) {
      return `lcm://authredirect?access_token=${encodeURIComponent(facebookAccessToken)}`;
    } else if (googleCode) {
      return `lcm://authredirect?token=${encodeURIComponent(googleCode)}`;
    }
    return "lcm://authredirect";
  };

  const manualLink = getManualLink();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FF8C00, #4CAF50)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          width: "400px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: "50px",
            height: "50px",
            margin: "0 auto 20px",
            border: "6px solid #eee",
            borderTop: "6px solid #FF8C00",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />

        <h2 style={{ color: "#333", marginBottom: "10px" }}>
          {error ? (
            "OAuth Error"
          ) : (
            <>
              Redirecting to <span style={{ color: "#FF8C00" }}>LCM</span> App...
            </>
          )}
        </h2>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          {error
            ? errorDescription || "An error occurred during authentication."
            : "If nothing happens, click below to open the app manually."}
        </p>

        <a
          href={manualLink}
          style={{
            display: "inline-block",
            background: "#4CAF50",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#43a047")}
          onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
        >
          Open App Manually
        </a>
      </div>

      {/* CSS animation keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default OAuthCallback;

