import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { ReactNode } from "react";

interface FormSheetProps {
  title: string;
  state: any;
  schema: any;
  action: (data: any) => Promise<any>;
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  loading?: boolean;
}

export function FormSheet({
  title,
  state,
  schema,
  action,
  children,
  open,
  setOpen,
  loading = false,
}: FormSheetProps) {
  const methods = useForm({
    defaultValues: state,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { formState, reset, handleSubmit } = methods;

  const closeSheet = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset, setOpen]);

  const handleSave = useCallback(
    async (data: any) => {
      await action(data);
      setOpen(false);
    },
    [action, setOpen]
  );

  // Sync form state with prop changes
  useEffect(() => {
    if (state) reset(state);
  }, [state, reset]);

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => (!val ? closeSheet() : setOpen(val))}
    >
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {loading ? (
          <div>Loading ....</div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleSave)}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="border-b p-4">
                <SheetHeader>
                  <SheetTitle className="text-lg font-semibold">
                    {title}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Submit button will activate when you make changes.
                  </SheetDescription>
                </SheetHeader>
              </div>

              {/* Form Content */}
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4 px-4">{children}</div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t p-4 flex justify-end">
                <SubmitButton
                  text="Save Changes"
                  isLoading={loading}
                  disabled={!formState.isValid || !formState.isDirty}
                />
              </div>
            </form>
          </FormProvider>
        )}
      </SheetContent>
    </Sheet>
  );
}
