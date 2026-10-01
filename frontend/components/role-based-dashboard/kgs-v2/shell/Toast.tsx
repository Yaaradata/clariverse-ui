"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { X } from "lucide-react";
import { K, withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

type ToastMsg = { id: number; title: string; body?: string };

const ToastContext = createContext<{
  show: (title: string, body?: string) => void;
} | null>(null);

export function useToast2() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast2 must be used inside ToastProvider2");
  return ctx;
}

export function ToastProvider2({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const show = useCallback((title: string, body?: string) => {
    setToast({ id: Date.now(), title, body });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <output
          key={toast.id}
          aria-live="polite"
          style={{
            position: "fixed",
            top: 132,
            right: 24,
            zIndex: 80,
            minWidth: 280,
            maxWidth: 380,
            background: K.elevated,
            border: `1px solid ${withAlpha(K.green, 0.5)}`,
            borderRadius: K.radius.tile,
            padding: "12px 14px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            color: K.text,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{toast.title}</div>
            {toast.body ? (
              <div
                style={{
                  fontSize: 13,
                  color: K.body,
                  marginTop: 4,
                  lineHeight: 1.45,
                }}
              >
                {toast.body}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setToast(null)}
            style={{
              background: "none",
              border: "none",
              color: K.textMut,
              cursor: "pointer",
              padding: 2,
            }}
          >
            <X size={16} />
          </button>
        </output>
      ) : null}
    </ToastContext.Provider>
  );
}
