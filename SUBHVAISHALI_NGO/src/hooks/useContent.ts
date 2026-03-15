import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useContent(key: string, defaultValue: any = "") {
  const [content, setContent] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/content");
        if (res.data && res.data[key]) {
          setContent(res.data[key]);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [key]);

  return { content, loading };
}
