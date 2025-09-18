"use client";

import {
  FileText,
  X,
  Trash2,
  Upload,
  Video,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import React, { useState, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FileType = "image" | "video" | "documents";
type UploadMode = "preview" | "direct";

interface FileWithPreview extends File {
  preview?: string;
  uploadedUrl?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

interface FileUploadProps {
  name: string;
  label?: string;
  helperText?: string;
  mode?: UploadMode;
  fileType?: FileType;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  onUploadComplete?: (urls: string[]) => void;
  onFileChange?: (files: FileWithPreview[]) => void;
}

// ===== DEFAULT CONFIGURATIONS =====
const defaultAcceptConfigs: Record<FileType, Record<string, string[]>> = {
  image: {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
  },
  video: {
    "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  },
  documents: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
};

export function FileUpload({
  name,
  label,
  helperText,
  mode = "preview",
  fileType = "documents",
  maxSize = 5 * 1024 * 1024,
  maxFiles = 1,
  multiple = false,
  accept,
  className,
  disabled = false,
  onUploadComplete,
  onFileChange,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadSingle, uploadMultiple } = useEdgeStoreUpload();
  const { control, formState, clearErrors, setValue } = useFormContext();
  const [validationError, setValidationError] = useState<string | null>(null);

  const acceptConfig = accept || defaultAcceptConfigs[fileType];
  const acceptedExtensions = Object.values(acceptConfig).flat();

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  };

  const validateFiles = (files: File[]) => {
    const errors: string[] = [];
    if (files.length > maxFiles) {
      errors.push(`Maksimal ${maxFiles} file yang diizinkan.`);
    }
    files.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(
          `File ${file.name} terlalu besar. Maksimal ${formatFileSize(
            maxSize
          )}.`
        );
      }
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = acceptedExtensions.some(
        (ext) => ext.toLowerCase() === fileExt
      );
      if (!isValidType) {
        errors.push(
          `File ${
            file.name
          } tidak didukung. Ekstensi yang diizinkan: ${acceptedExtensions.join(
            ", "
          )}`
        );
      }
    });
    return errors;
  };

  const processFiles = async (
    files: File[],
    currentFiles: FileWithPreview[] = []
  ) => {
    const errors = validateFiles(files);
    if (errors.length > 0) {
      setValidationError(errors.join(" "));
      toast.error("Error validasi file", { description: errors.join(" ") });
      return currentFiles;
    }

    setValidationError(null);
    clearErrors(name);

    const newFiles: FileWithPreview[] = files.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      if (fileType === "image" || fileType === "video") {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      fileWithPreview.isUploading = false;
      fileWithPreview.uploadProgress = 0;
      fileWithPreview.error = undefined;
      return fileWithPreview;
    });

    let updatedFiles: FileWithPreview[];
    if (multiple) {
      const totalFiles = currentFiles.length + newFiles.length;
      if (totalFiles > maxFiles) {
        const allowedCount = maxFiles - currentFiles.length;
        updatedFiles = [...currentFiles, ...newFiles.slice(0, allowedCount)];
        setValidationError(
          `Hanya dapat menambahkan ${allowedCount} file lagi (maksimal ${maxFiles} file)`
        );
      } else {
        updatedFiles = [...currentFiles, ...newFiles];
      }
    } else {
      updatedFiles = [newFiles[0]];
    }

    if (mode === "preview") {
      setValue(name, updatedFiles, { shouldValidate: true, shouldDirty: true });
    } else if (mode === "direct") {
      try {
        const filesToUpload = updatedFiles.filter((f) => !f.uploadedUrl);

        if (filesToUpload.length > 0) {
          filesToUpload.forEach((f) => {
            f.isUploading = true;
            f.uploadProgress = 0;
          });
          onFileChange?.(updatedFiles);
          setValue(name, updatedFiles, {
            shouldValidate: true,
            shouldDirty: true,
          });

          if (multiple) {
            const { files } = await uploadMultiple(
              filesToUpload,
              (progress, i) => {
                filesToUpload[i].uploadProgress = progress;
                setValue(name, [...updatedFiles], { shouldValidate: true });
                onFileChange?.([...updatedFiles]);
              }
            );

            filesToUpload.forEach((f, idx) => {
              f.uploadedUrl = files[idx].url;
              f.isUploading = false;
              f.uploadProgress = 100;
            });
          } else {
            const result = await uploadSingle(filesToUpload[0], (progress) => {
              filesToUpload[0].uploadProgress = progress;
              setValue(name, [...updatedFiles], { shouldValidate: true });
              onFileChange?.([...updatedFiles]);
            });

            result.url = result.url;
            filesToUpload[0].isUploading = false;
            filesToUpload[0].uploadProgress = 100;
          }

          // simpan url + original file meta
          const finalValue = updatedFiles
            .filter((f) => f.uploadedUrl)
            .map((f) => ({
              url: f.uploadedUrl!,
              name: f.name,
              size: f.size,
              type: f.type,
            }));

          setValue(name, finalValue, {
            shouldValidate: true,
            shouldDirty: true,
          });
          onUploadComplete?.(finalValue.map((f) => f.url));
        }
      } catch {
        updatedFiles.forEach((f) => {
          if (f.isUploading) {
            f.error = "Gagal upload";
            f.isUploading = false;
          }
        });
        setValue(name, updatedFiles, { shouldValidate: true });
        toast.error("Gagal mengupload file");
      }
    }

    onFileChange?.(updatedFiles);
    return updatedFiles;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const currentFiles: FileWithPreview[] = Array.isArray(field.value)
          ? field.value
          : field.value
          ? [field.value]
          : [];

        const handleDrop = useCallback(
          async (acceptedFiles: File[]) => {
            setIsDragging(false);
            if (acceptedFiles.length > 0) {
              await processFiles(acceptedFiles, currentFiles);
            }
          },
          [currentFiles]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          accept: acceptConfig,
          multiple: multiple && maxFiles > 1,
          disabled,
          onDragEnter: () => setIsDragging(true),
          onDragLeave: () => setIsDragging(false),
        });

        const removeFile = (index: number) => {
          const fileToRemove = currentFiles[index];
          if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
          const newFiles = currentFiles.filter((_, i) => i !== index);
          setValue(name, newFiles, { shouldValidate: true, shouldDirty: true });
          onFileChange?.(newFiles);
          setValidationError(null);
        };

        return (
          <div className={cn("space-y-3", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}

            {validationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                isDragActive || isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25 hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed",
                currentFiles.length > 0 && "border-solid bg-muted/20"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm">
                  {isDragActive
                    ? "Lepaskan file di sini"
                    : "Drag & drop atau klik"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {acceptedExtensions.join(", ")} • Max{" "}
                  {formatFileSize(maxSize)}
                  {multiple && ` • Max ${maxFiles} files`}
                </p>
              </div>
            </div>

            {currentFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  File Terpilih ({currentFiles.length}
                  {multiple ? `/${maxFiles}` : ""})
                </p>
                <div
                  className={cn(
                    fileType === "image" || fileType === "video"
                      ? "grid grid-cols-2 md:grid-cols-3 gap-3"
                      : "space-y-2"
                  )}
                >
                  {currentFiles.map((file, index) => (
                    <FilePreview
                      key={index}
                      file={file}
                      fileType={fileType}
                      onRemove={() => removeFile(index)}
                      formatFileSize={formatFileSize}
                    />
                  ))}
                </div>
              </div>
            )}

            {helperText && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            {formState.errors[name] && (
              <p className="text-xs text-destructive">
                {formState.errors[name]?.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

// ===== FILE PREVIEW COMPONENT =====
interface FilePreviewProps {
  file: FileWithPreview;
  fileType: FileType;
  onRemove: () => void;
  formatFileSize: (bytes: number) => string;
}

function FilePreview({
  file,
  fileType,
  onRemove,
  formatFileSize,
}: FilePreviewProps) {
  if (fileType === "image" || fileType === "video") {
    return (
      <div className="relative group aspect-square">
        <div className="w-full h-full border rounded-lg overflow-hidden bg-muted">
          {fileType === "image" && file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : fileType === "video" && file.preview ? (
            <video src={file.preview} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {fileType === "image" ? (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Video className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {file.isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">{file.uploadProgress}%</p>
            </div>
          </div>
        )}

        {file.uploadedUrl && (
          <div className="absolute top-2 left-2">
            <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
          </div>
        )}

        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
          <p className="truncate">{file.name}</p>
          <p>{formatFileSize(file.size)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
          {file.isUploading && (
            <div className="mt-2">
              <Progress value={file.uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading... {file.uploadProgress}%
              </p>
            </div>
          )}
          {file.uploadedUrl && (
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <p className="text-xs text-green-600">Uploaded</p>
            </div>
          )}
          {file.error && (
            <p className="text-xs text-destructive mt-1">{file.error}</p>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
