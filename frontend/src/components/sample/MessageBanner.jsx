/**
 * ============================================================
 *  MessageBanner — Reusable Feedback Banner Component
 * ============================================================
 *
 *  Props:
 *    message — string to display (empty string hides the banner)
 *    type    — "success" | "error" (defaults to "success")
 *
 *  Auto-hides after 4 seconds.
 * ============================================================
 */

import { useEffect, useState } from "react";

export default function MessageBanner({ message, type = "success" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [message]);

  if (!visible || !message) return null;

  const styles =
    type === "error"
      ? "text-red-400 border-red-800"
      : "text-green-400 border-green-800";

  return (
    <div className={`mb-4 px-4 py-2 rounded bg-gray-800 border ${styles}`}>
      {message}
    </div>
  );
}
