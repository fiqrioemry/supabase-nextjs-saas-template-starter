import { useEdgeStore } from "@/providers/edge-store-providers";
import { useCallback } from "react";

export function useEdgeStoreUpload() {
  const { edgestore } = useEdgeStore();

  const uploadSingle = useCallback(
    async (
      file: File,
      bucket: "publicFiles" | "publicImages" = "publicFiles",
      onProgress?: (progress: number) => void
    ): Promise<string> => {
      try {
        const result = await edgestore.publicFiles.upload({
          file,
          onProgressChange: onProgress,
        });
        return result.url;
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error(`Gagal mengupload ${file.name}`);
      }
    },
    [edgestore]
  );

  const uploadMultiple = useCallback(
    async (
      files: File[],
      bucket: "publicFiles" | "publicImages" = "publicFiles",
      onProgress?: (progress: number, fileIndex: number) => void
    ): Promise<string[]> => {
      const urls: string[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = await uploadSingle(file, bucket, (progress) => {
            onProgress?.(progress, i);
          });
          urls.push(url);
        }
        return urls;
      } catch (error) {
        console.error("Upload multiple error:", error);
        throw error;
      }
    },
    [uploadSingle]
  );

  return { uploadSingle, uploadMultiple };
}
