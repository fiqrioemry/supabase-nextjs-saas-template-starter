import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { FileUpload } from "@/components/form-fields/file-upload";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import { uploadDocuments } from "@/lib/actions/embeddings";
import z from "zod";
import { useAutoSave } from "@/hooks/use-debounce";

export const UploadedFileSchema = z.object({
  url: z.string().url("URL file tidak valid"),
  name: z.string().min(1, "Nama file wajib ada"),
  size: z.number().positive("Ukuran file tidak valid"),
  type: z.string().min(1, "Tipe file wajib ada"),
});

export const FileUploadSchema = z.object({
  documents: z.array(UploadedFileSchema).min(1, "Upload at least one document"),
});

type FileUploadForm = z.infer<typeof FileUploadSchema>;

export default function KnowledgeBaseForm({ agent }: { agent: any }) {
  const { uploadMultiple } = useEdgeStoreUpload();

  const form = useFormSchema({
    schema: FileUploadSchema,
    action: handleUploadFile,
    mode: "onChange",
    state: { documents: [] },
  });

  async function handleUploadFile(data: FileUploadForm) {
    await uploadDocuments({
      user_id: agent.user_id,
      agent_id: agent.id,
      documents: data.documents,
    });
    // if (result.success) {
    //   toast.success(result.message);
    // } else {
    //   toast.error(result.error);
    //   console.error("Upload documents error:", result.error);
    // }
  }

  useAutoSave<FileUploadForm>({
    form: form.methods,
    onSave: handleUploadFile,
    delay: 100,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Documents</CardTitle>
          <CardDescription>
            Upload documents to train your chat agent. Supported formats: PDF,
            DOCX, TXT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-center  gap-2">
              <FormProvider {...form.methods}>
                <form onSubmit={form.handleSubmit} className="w-full">
                  <FileUpload
                    name="documents"
                    mode="direct"
                    fileType="documents"
                    multiple={true}
                    maxFiles={5}
                    maxSize={1 * 1024 * 1024}
                  />
                </form>
              </FormProvider>
            </div>

            {agent.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Documents</h4>
                {agent.documents.map(
                  (doc: {
                    id: string;
                    name: string;
                    file_size: string;
                    created_at: string;
                    processing_status: string;
                  }) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.file_size} • Uploaded {doc.created_at}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {doc.processing_status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("delete", doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
