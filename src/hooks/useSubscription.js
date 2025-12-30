import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      if (!userData) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      const config = {
        params: { userId },
      };

      if (authToken) {
        config.headers = {
          Authorization: `Bearer ${authToken}`,
        };
      }

      const response = await axios.get(
        `${API_BASE_URL}/subscription/active-subscription`,
        config
      );

      if (response.data.success && response.data.data) {
        setSubscription(response.data.data);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError(err.message);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    fetchSubscription();
  };

  return {
    subscription,
    loading,
    error,
    refreshSubscription,
  };
};

