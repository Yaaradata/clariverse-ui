"use client";

import meta from "@kgs2/data/meta.json";
import recurring from "@kgs2/data/recurring.json";
import { useDemo2, useLabel2, useV2K } from "@kgs2/lib/demoState";
import type { PeriodId, V2View } from "@kgs2/types";
import { Moon, Sun } from "lucide-react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { VIEW_PAGE_LABEL, VIEW_TITLE } from "../nav";
import { DATE_RANGE_OPTIONS } from "../shared/themeTokens";

export function DrillHeader({ view }: { view: V2View }) {
  const L = useLabel2();
  const K = useV2K();
  const { state, setPeriod, toggleTheme } = useDemo2();
  const themeCard =
    view === "recurringTheme"
      ? recurring.backAfterFixWall.find((c) => c.id === state.recurringThemeId)
      : undefined;
  const title = themeCard?.title ?? VIEW_TITLE[view];
  const crumb = `${meta.breadcrumbRoot} · ${state.role} · ${VIEW_PAGE_LABEL[view]}`;
  const isLight = state.theme === "light";

  return (
    <header
      style={{
        padding: "14px 24px 12px",
        borderBottom: `1px solid ${K.borderLight}`,
        background: K.elevated,
        // Stays pinned while the page scrolls.
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 240px" }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: K.text,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {L(title)}
          </h1>
          <div
            style={{
              fontSize: 14,
              color: K.textSec,
              marginTop: 4,
              lineHeight: 1.45,
            }}
          >
            {L(crumb)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <fieldset
            style={{
              display: "inline-flex",
              borderRadius: 8,
              border: `1px solid ${K.borderLight}`,
              background: isLight ? K.card : withAlpha(K.text, 0.04),
              padding: 3,
              gap: 2,
              margin: 0,
            }}
          >
            <legend
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              Date range
            </legend>
            {DATE_RANGE_OPTIONS.map((opt) => {
              const active = state.period === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className="kgs2-focus"
                  aria-pressed={active}
                  onClick={() => setPeriod(opt.id as PeriodId)}
                  style={{
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    background: active
                      ? withAlpha(K.brand, isLight ? 0.14 : 0.18)
                      : "transparent",
                    color: active
                      ? isLight
                        ? K.brand
                        : K.brandSoft
                      : K.textSec,
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </fieldset>

          <button
            type="button"
            className="kgs2-focus"
            onClick={toggleTheme}
            aria-label={
              isLight ? "Switch to dark mode" : "Switch to light mode"
            }
            title={isLight ? "Dark mode" : "Light mode"}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${K.borderLight}`,
              background: isLight ? K.card : withAlpha(K.text, 0.04),
              color: K.textSec,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
