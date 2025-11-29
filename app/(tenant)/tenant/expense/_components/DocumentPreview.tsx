"use client";

import { Component, type ReactNode, useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import type { IDocument } from "react-doc-viewer";

interface DocumentPreviewProps {
  url: string;
  fileName?: string;
}

class DocumentPreviewErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  public state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Document preview failed", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function DocumentPreview({ url, fileName }: DocumentPreviewProps) {
  const documents = useMemo<IDocument[]>(
    () => [
      {
        uri: url,
        fileName,
      },
    ],
    [url, fileName],
  );

  const fallback = (
    <div className="flex h-[420px] w-full flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 px-4 text-center text-sm text-muted-foreground">
      <p className="mb-2 font-medium">Unable to render document preview.</p>
      <p>
        Please download or open the file in a new tab using the buttons above.
      </p>
    </div>
  );

  return (
    <DocumentPreviewErrorBoundary key={url} fallback={fallback}>
      <DocViewer
        documents={documents}
        pluginRenderers={DocViewerRenderers}
        style={{ height: 420, width: "100%" }}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: false,
          },
        }}
      />
    </DocumentPreviewErrorBoundary>
  );
}
