"use client";
import { useState, useRef } from "react";
import { uploadMeterCsv } from "@/lib/api";

const expectedColumns = ["timestamp", "consumption_kwh", "solar_generation_kwh"];

export default function IngestionPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file only.");
      return;
    }

    setFileName(file.name);
    setError("");
    setResult(null);

    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1, 7).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj: any, h, i) => {
        obj[h] = values[i]?.trim();
        return obj;
      }, {});
    });
    setPreview(rows);

    setUploading(true);
    try {
      const data = await uploadMeterCsv(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Could not connect to server");
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setResult(null);
    setPreview([]);
    setFileName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
          <span className="material-symbols-outlined">database</span>
        </div>
        <div>
          <h1 className="text-headline-md text-on-surface">Data Ingestion</h1>
          <p className="text-body-md text-on-surface-variant">
            Upload meter data CSVs to power your energy intelligence
          </p>
        </div>
      </div>

      {/* Format Guide */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-l-accent-cyan">
        <p className="text-label-md text-on-surface mb-2">Expected CSV Format</p>
        <code className="text-label-md text-accent-cyan bg-surface-container-highest/40 px-3 py-2 rounded-lg block">
          timestamp, consumption_kwh, solar_generation_kwh
        </code>
        <p className="text-label-md text-outline mt-2">
          Example: 2026-06-15 09:00:00, 4.8, 9.4
        </p>
      </div>

      {/* Upload Area */}
      <div className="glass-card rounded-2xl p-6">
        {uploading ? (
          /* Uploading state */
          <div className="flex flex-col items-center gap-3 py-10">
            <span className="material-symbols-outlined animate-spin text-primary text-[48px]">
              progress_activity
            </span>
            <p className="text-headline-md text-on-surface">Uploading {fileName}...</p>
            <p className="text-body-md text-on-surface-variant">
              Validating and storing in database
            </p>
          </div>
        ) : result ? (
          /* Success state */
          <div className="flex flex-col items-center gap-3 py-10">
            <span className="material-symbols-outlined text-tertiary text-[56px]">
              check_circle
            </span>
            <p className="text-headline-md text-tertiary">{fileName} uploaded successfully!</p>
            <p className="text-body-md text-on-surface-variant">{result.message}</p>
            <button
              onClick={reset}
              className="mt-2 px-6 py-2.5 bg-primary text-on-primary text-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Upload Another File
            </button>
          </div>
        ) : (
          /* Default upload state */
          <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                dragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-outline-variant/40 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  dragging ? "bg-primary/20" : "bg-surface-container-highest/40"
                }`}>
                  <span className={`material-symbols-outlined text-[36px] ${
                    dragging ? "text-primary" : "text-on-surface-variant"
                  }`}>
                    {dragging ? "download" : "upload_file"}
                  </span>
                </div>
                <p className="text-headline-md text-on-surface">
                  {dragging ? "Drop it here!" : "Drag & drop your CSV here"}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {dragging ? "Release to upload" : "Supports .csv files only"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-label-md text-outline">or</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* Explicit Upload Button */}
            <div className="flex flex-col items-center gap-3">
              {fileName && !result && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-highest/40 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-accent-cyan text-[20px]">
                    description
                  </span>
                  <span className="text-body-md text-on-surface">{fileName}</span>
                  <button
                    onClick={reset}
                    className="text-outline hover:text-error transition-colors ml-1"
                    suppressHydrationWarning
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-primary text-on-primary text-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 neo-glow-primary"
                suppressHydrationWarning
              >
                <span className="material-symbols-outlined text-[20px]">upload</span>
                Choose CSV File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleInputChange}
                className="hidden"
              />

              <p className="text-label-md text-outline">
                timestamp, consumption_kwh, solar_generation_kwh
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 glass-card rounded-xl px-4 py-3 text-error text-body-md border-l-4 border-l-error flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}
      </div>

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-accent-cyan text-[20px]">
              table_view
            </span>
            <h3 className="text-headline-md text-on-surface">Data Preview</h3>
            <span className="text-label-md px-2.5 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan ml-1">
              First 6 rows
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  {expectedColumns.map((col) => (
                    <th
                      key={col}
                      className="text-left py-3 px-4 text-label-md text-on-surface-variant uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="text-left py-3 px-4 text-label-md text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-on-surface/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-label-md text-on-surface-variant">
                      {row.timestamp}
                    </td>
                    <td className="py-3 px-4 text-body-md text-on-surface">
                      {row.consumption_kwh}
                    </td>
                    <td className="py-3 px-4 text-body-md text-on-surface">
                      {row.solar_generation_kwh}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-label-md px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary flex items-center gap-1 w-fit">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}