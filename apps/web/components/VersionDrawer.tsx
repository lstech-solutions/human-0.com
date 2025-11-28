"use client";

import React from "react";
import versionData from "../version.json";

interface VersionDrawerProps {
  isOpen: boolean;
  appVersion: string;
  onClose: () => void;
}

function VersionDrawerInner({ isOpen, appVersion, onClose }: VersionDrawerProps) {
  const [isVersionExpanded, setIsVersionExpanded] = React.useState(false);
  const [isReleasesFullMode, setIsReleasesFullMode] = React.useState(false);

  if (!isOpen) return null;

  const current = versionData.changelog?.current;
  const history = versionData.changelog?.history ?? [];

  const currentSummary = current?.changes?.[0]
    || "This release includes improvements and refinements. See changelog for details.";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={() => {
          setIsVersionExpanded(false);
          setIsReleasesFullMode(false);
          onClose();
        }}
      />
      <div
        className={
          isReleasesFullMode
            ? "fixed inset-0 z-50 bg-[#050B10] border-t border-white/10 shadow-2xl"
            : "fixed inset-x-0 bottom-0 z-50 bg-[#050B10] border-t border-white/10 shadow-2xl"
        }
      >
        <div
          className={
            (isReleasesFullMode
              ? "max-w-3xl mx-auto px-4 py-4 lg:px-6 lg:py-6 h-full flex flex-col"
              : "max-w-3xl mx-auto px-4 py-4 lg:px-6 lg:py-5") +
            " text-xs lg:text-sm text-white/80 font-mono"
          }
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] lg:text-xs tracking-[0.2em] text-white/60 uppercase">
                {isReleasesFullMode ? "All Releases" : "Release Info"}
              </div>
              <div className="text-sm lg:text-base text-white font-semibold">
                HUMΛN-Ø v{appVersion}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsVersionExpanded(false);
                setIsReleasesFullMode(false);
                onClose();
              }}
              className="text-white/60 hover:text-white text-xs lg:text-sm"
            >
              CLOSE
            </button>
          </div>

          {!isReleasesFullMode && (
            <>
              <div className="space-y-2 mb-2">
                <p className="text-white/70">
                  {currentSummary}
                </p>
              </div>

              <div
                className={
                  "overflow-y-auto transition-all duration-300 border-t border-white/10 pt-2 mt-2 " +
                  (isVersionExpanded ? "max-h-64" : "max-h-0")
                }
              >
                {isVersionExpanded && current?.changes && (
                  <div className="space-y-2 text-[11px] lg:text-xs text-white/70 pr-1">
                    <div className="font-semibold text-white/80">Details</div>
                    <ul className="list-disc list-inside space-y-1">
                      {current.changes.map((change, idx) => (
                        <li key={idx}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {isReleasesFullMode && (
            <div className="mt-3 flex-1 overflow-y-auto text-[11px] lg:text-xs text-white/70 pr-1">
              <div className="font-semibold text-white/80 mb-2">Release history</div>
              <ul className="space-y-1">
                {history.map((release: any) => {
                  const href = `https://github.com/lstech-solutions/human-0.com/releases/tag/v${release.version}`;
                  const description = (release.changes && release.changes[0]) ||
                    "See GitHub release notes for full details.";

                  return (
                    <li key={release.version}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-300 hover:text-purple-200 underline decoration-dotted underline-offset-2"
                      >
                        v{release.version}
                      </a>
                      <span className="text-white/70"> – {description}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px] lg:text-xs mt-3">
            <a
              href={`https://github.com/lstech-solutions/human-0.com/releases/tag/v${appVersion}`}
              target="_blank"
              rel="noreferrer"
              className="text-purple-300 hover:text-purple-200 underline decoration-dotted underline-offset-2"
            >
              View GitHub release tag v{appVersion}
            </a>
            {!isReleasesFullMode && (
              <button
                type="button"
                onClick={() => {
                  setIsReleasesFullMode(true);
                  setIsVersionExpanded(false);
                }}
                className="text-white/70 hover:text-white/90 underline decoration-dotted underline-offset-2"
              >
                All releases
              </button>
            )}
            {!isReleasesFullMode && (
              <button
                type="button"
                onClick={() => setIsVersionExpanded((prev) => !prev)}
                className="ml-auto text-white/70 hover:text-white/90 underline decoration-dotted underline-offset-2"
              >
                {isVersionExpanded ? "Show less" : "Show more"}
              </button>
            )}
            {isReleasesFullMode && (
              <button
                type="button"
                onClick={() => setIsReleasesFullMode(false)}
                className="ml-auto text-white/70 hover:text-white/90 underline decoration-dotted underline-offset-2"
              >
                Back to release
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function VersionDrawer(props: VersionDrawerProps) {
  return <VersionDrawerInner {...props} />;
}

export { VersionDrawerInner as VersionDrawer };
