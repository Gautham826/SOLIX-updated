"use client";
import { useEffect } from "react";
import { warmupBackend } from "@/lib/api";

export default function BackendWarmup() {
  useEffect(() => {
    warmupBackend();
  }, []);
  return null;
}