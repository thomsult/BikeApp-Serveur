

// import { useEffect, useState } from "react";
import { alertsConfirmation } from '@/components/alerts';



export class Alert {
  static alert(
    title: string,
    message?: string,
    button?: {
      confirm?: string;
      cancel?: string;
    },
  ) {
    return alertsConfirmation({
      title,
      message: message || '',
      button: {
        cancel: button?.cancel || "Annuler",
        confirm: button?.confirm || "Confirmer",
      }
    });
  }
}
