import { confirmable, createConfirmation, type ConfirmDialogProps } from 'react-confirm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface Alert {
  message: string;
  title: string;
  button: {
    confirm?: string;
    cancel?: string;
  };
}

export const ConfirmationComponent = ({ message, title, button, show, proceed }: ConfirmDialogProps<Alert, boolean>) => {
  const handleOpenChange = (open: boolean) => { if (!open) proceed(false) };
  const handleProceedFalse = () => proceed(false);
  const handleProceedTrue = () => proceed(true);

  return (
    <AlertDialog
      open={show}
      onOpenChange={handleOpenChange} // si l'utilisateur ferme le dialog sans cliquer sur un bouton, on considère que c'est une annulation
      key={"cancel-confirmation"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {message && message}
        </AlertDialogDescription>
        {button && <AlertDialogFooter >
          {button.cancel && <AlertDialogCancel onClick={handleProceedFalse}>
            {button.cancel}
          </AlertDialogCancel>}
          {button.confirm && <AlertDialogAction onClick={handleProceedTrue}>
            {button.confirm}
          </AlertDialogAction>}
        </AlertDialogFooter>}
      </AlertDialogContent>
    </AlertDialog>
  )
};


const alerts_Confirmation = createConfirmation(confirmable(ConfirmationComponent), 0, document.getElementById("alert-root")!);


export const alertsConfirmation = (options: Alert) => {
  if (!document.getElementById("alert-root")) {
    console.warn("Element with id 'alert-root' not found. Creating one.");
    const alertRoot = document.createElement("div");
    alertRoot.id = "alert-root";
    document.body.appendChild(alertRoot);
  }
  const alertRoot = document.getElementById("alert-root");
  if (alertRoot && alertRoot.childElementCount > 0) {
    console.warn("An alert is already being displayed. Please wait for it to be resolved before showing another one.");
    return Promise.resolve(false); // ou true, selon ce qui a le plus de sens dans votre contexte
  }
  return alerts_Confirmation(options);
};