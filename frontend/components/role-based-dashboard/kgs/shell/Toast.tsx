"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type ToastData = {
  title: string;
  body: string;
  id: string;
};

let toastQueue: ToastData[] = [];
let toastListeners: Array<(toasts: ToastData[]) => void> = [];

export function showToast({ title, body }: { title: string; body: string }) {
  const id = `toast-${Date.now()}-${Math.random()}`;
  const toast: ToastData = { title, body, id };
  toastQueue = [...toastQueue, toast];
  toastListeners.forEach((fn) => fn(toastQueue));

  // Auto-dismiss after 4s
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(toastQueue));
  }, 4000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 72,
        right: 24,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: "#0d0d0d",
            border: "1px solid #1f1f1f",
            borderRadius: 12,
            padding: "14px 16px",
            minWidth: 280,
            maxWidth: 360,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            pointerEvents: "auto",
            animation: "slideInRight 0.2s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: toast.body ? 4 : 0 }}>
                {toast.title}
              </div>
              {toast.body ? (
                <div style={{ fontSize: 13, color: "#a3a3a3", lineHeight: 1.5 }}>
                  {toast.body}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                toastQueue = toastQueue.filter((t) => t.id !== toast.id);
                toastListeners.forEach((fn) => fn(toastQueue));
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#939394",
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
