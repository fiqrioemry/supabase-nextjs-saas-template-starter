import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormDeleteProps {
  title: string;
  onDelete: () => void;
  description: string;
  loading?: boolean;
  buttonElement?: React.ReactNode;
}

export const FormDelete = ({
  title,
  onDelete,
  description,
  loading = false,
  buttonElement = (
    <Button variant="destructive" size="icon" type="button">
      <Trash2 className="w-4 h-4" />
    </Button>
  ),
}: FormDeleteProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{buttonElement}</DialogTrigger>

      <DialogContent className="sm:max-w-sm max-w-xs w-full rounded-md">
        {loading ? (
          <div className="flex items-center justify-center h-full py-6">
            <div className="text-center">
              <Loader2 className=" mx-auto animate-spin mb-2" size={40} />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant="destructive" tabIndex={0} onClick={onDelete}>
                  Delete
                </Button>
              </DialogClose>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
