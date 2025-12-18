// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import AdminRoutes from "./Admin/AdminRoutes";
// import NotFoundPage from "./NotFound";
// import LandingPage from "./LandingPage";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/admin/*" element={<AdminRoutes />} />

//         {/* Not Found */}
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./Admin/AdminRoutes";
import UserRoutes from "./User/UserRoutes";
import LandingPage from "./LandingPage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import NotFound from "./NotFound";
import OAuthCallback from "./Pages/OAuthCallback";

export default function App() {
  useEffect(() => {
    // Facebook SDK initialize
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "925493953121496",
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
    };

    // Load Facebook SDK script
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/facebook-callback" element={<OAuthCallback />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// import React from "react";

// const OpenAppPage = () => {
//   const openApp = () => {
//     // 1. Try to open the mobile app via custom scheme
//     window.location.href = "lcm://?access_token=test123";

//     // 2. Optional fallback — if app is not installed, redirect to Play Store after 2 seconds
//     setTimeout(() => {
//       window.location.href =
//         "https://play.google.com/store/apps/details?id=com.lcm.dev"; // Replace with your real Play Store ID
//     }, 2000);
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Launch LCM App</h2>
//       <button onClick={openApp} style={styles.button}>
//         Open My App
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     textAlign: "center",
//     marginTop: "100px",
//     fontFamily: "Arial",
//   },
//   button: {
//     padding: "15px 30px",
//     fontSize: "18px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//   },
// };

// export default OpenAppPage;
