"use client";

import "@uploadthing/react/styles.css";

import { UploadButton } from "@uploadthing/react";

import type { UploadRouter } from "@/lib/uploadthing";

type StationMediaUploadButtonProps = {
  endpoint?: keyof UploadRouter;
  onCompleted?: (url: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
};

export function StationMediaUploadButton({
  endpoint = "stationMedia",
  onCompleted,
  onError,
  onProgress,
}: StationMediaUploadButtonProps) {
  return (
    <UploadButton<UploadRouter, keyof UploadRouter>
      endpoint={endpoint}
      appearance={{ button: "bg-primary text-white" }}
      onUploadProgress={(progress) => {
        onProgress?.(progress ?? 0);
      }}
      onClientUploadComplete={(files) => {
        onProgress?.(100);
        const url = files?.[0]?.ufsUrl ?? files?.[0]?.url;
        if (url) {
          onCompleted?.(url);
        }
      }}
      onUploadError={(error) => {
        onProgress?.(0);
        onError?.(error);
      }}
    />
  );
}
