"use client";

import { useSyncExternalStore } from "react";

let currentHash = "";

function subscribe(onChange: () => void) {
  currentHash = window.location.hash;
  const update = () => {
    currentHash = window.location.hash;
    onChange();
  };
  window.addEventListener("hashchange", update);
  window.addEventListener("popstate", update);
  return () => {
    window.removeEventListener("hashchange", update);
    window.removeEventListener("popstate", update);
  };
}

const getSnapshot = () => currentHash;
const getServerSnapshot = () => "";

// The empty server snapshot keeps the initial hydration consistent. A changed
// fragment starts a fresh editor; replaceState used by Share keeps edits intact.
export function useLocationHash() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
