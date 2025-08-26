// import {
//   Dialog,
//   DialogTitle,
//   DialogTrigger,
//   DialogContent,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import type { ReactNode } from "react";
// import { Loader2, Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, FormProvider } from "react-hook-form";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState, useCallback, useEffect } from "react";
// import { SubmitButton } from "@/components/forms/submit-button";

// interface FormDialogProps {
//   title: string;
//   state: any;
//   submitText?: string;
//   schema: any;
//   loading?: boolean;
//   description?: string;
//   children: ReactNode;
//   buttonElement?: ReactNode;
//   action: (data: any) => Promise<any>;
// }

// export function FormDialog({
//   title,
//   submitText = "top up",
//   state,
//   schema,
//   action,
//   children,
//   description = "Submit button will activate when you make changes.",
//   loading = false,
//   buttonElement = (
//     <Button size="icon" type="button">
//       <Pencil className="w-4 h-4" />
//     </Button>
//   ),
// }: FormDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showConfirmation, setShowConfirmation] = useState(false);

//   const methods = useForm({
//     defaultValues: state,
//     resolver: zodResolver(schema),
//     mode: "onChange",
//   });

//   const { formState, reset, handleSubmit } = methods;

//   const closeDialog = useCallback(() => {
//     reset();
//     setIsOpen(false);
//   }, [reset]);

//   const handleCancel = useCallback(() => {
//     if (formState.isDirty) {
//       setShowConfirmation(true);
//     } else {
//       closeDialog();
//     }
//   }, [formState.isDirty, closeDialog]);

//   const handleConfirmation = useCallback(
//     (confirmed: boolean) => {
//       setShowConfirmation(false);
//       if (confirmed) closeDialog();
//     },
//     [closeDialog]
//   );

//   const handleSave = useCallback(
//     async (data: any) => {
//       const result = await action(data);
//       if (result.success) {
//         closeDialog();
//       }
//       setError(result.error);
//     },
//     [action]
//   );

//   // Sync form state with prop changes
//   useEffect(() => {
//     if (state) reset(state);
//   }, [state, reset]);

//   return (
//     <>
//       {/* Main Dialog */}
//       <Dialog
//         open={isOpen}
//         onOpenChange={(open) => (!open ? handleCancel() : setIsOpen(open))}
//       >
//         <DialogTrigger asChild>{buttonElement}</DialogTrigger>

//         <DialogContent className="sm:max-w-lg overflow-hidden rounded-md p-0">
//           {loading ? (
//             <div className="flex items-center justify-center h-full py-6">
//               <div className="text-center">
//                 <Loader2 className=" mx-auto animate-spin mb-2" size={40} />
//                 <p className="text-muted-foreground">Loading...</p>
//               </div>
//             </div>
//           ) : (
//             <FormProvider {...methods}>
//               <form
//                 onSubmit={handleSubmit(handleSave)}
//                 className="flex flex-col max-h-[70vh]"
//               >
//                 {/* Header */}
//                 <div className="border-b border-border p-4">
//                   <DialogTitle className="text-lg font-semibold text-center text-foreground">
//                     {title}
//                   </DialogTitle>
//                   <DialogDescription className="text-sm text-muted-foreground text-center">
//                     {description}
//                   </DialogDescription>
//                   {error && (
//                     <div className="border rounded-md mt-2 h-14 flex items-center justify-center bg-red-100">
//                       <p className="text-red-500 text-sm text-center">
//                         {error || "An unknown error occurred"}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Form Content */}
//                 <ScrollArea className="flex-1">
//                   <div className="space-y-4 p-4">{children}</div>
//                 </ScrollArea>

//                 {/* Footer */}
//                 <div className="border-t p-4 flex justify-end">
//                   <SubmitButton
//                     text={submitText}
//                     isLoading={loading}
//                     disabled={!formState.isValid || !formState.isDirty}
//                   />
//                 </div>
//               </form>
//             </FormProvider>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Dialog */}
//       <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
//         <DialogContent className="sm:max-w-md rounded-xl">
//           <div className="text-center">
//             <DialogTitle className="text-xl font-semibold">
//               Unsaved Changes
//             </DialogTitle>
//             <p className="mt-2 text-sm text-muted-foreground">
//               You have made changes. Are you sure you want to discard them?
//             </p>
//           </div>

//           <div className="flex justify-center gap-4">
//             <Button
//               variant="outline"
//               className="w-32"
//               onClick={() => handleConfirmation(false)}
//             >
//               Keep Editing
//             </Button>
//             <Button
//               variant="destructive"
//               className="w-32"
//               onClick={() => handleConfirmation(true)}
//             >
//               Discard
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
