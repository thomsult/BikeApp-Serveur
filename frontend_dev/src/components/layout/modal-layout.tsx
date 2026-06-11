import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useMediaQuery } from 'usehooks-ts'


import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { alertsConfirmation } from "../alerts";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Portal } from "radix-ui";
import { X } from "lucide-react";
import { Card } from "../ui/card";


export const useModalLayout = () => {
  const { t } = useTranslation();
  return {
    handleCancel: () => alertsConfirmation({ message: t("common.alerts.cancelConfirmation"), title: t("common.alerts.cancelConfirmationTitle"), button: { confirm: t("common.actions.confirm"), cancel: t("common.actions.cancel") } }), // <-- par défaut, pas de confirmation pour l'annulation
    handleDelete: () => alertsConfirmation({ message: t("common.alerts.deleteConfirmation"), title: t("common.alerts.deleteConfirmationTitle"), button: { confirm: t("common.actions.confirm"), cancel: t("common.actions.cancel") } }), // <-- par défaut, pas de confirmation pour la suppression
    handleClose: async () => true,
  }
};
type ModalLayoutProps = {
  presentationMode?: "modal" | "drawer";
  backdropVisibility?: "visible" | "hidden";
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode | ((snap: string | number, setSnap: React.Dispatch<React.SetStateAction<string | number>>, snapPoints: (number | string)[]) => React.ReactNode);
  hideModal: () => Promise<boolean>;
  showModal?: boolean;
  onModalUnmount?: () => void;
  footer?: {
    handleSubmit: () => void;
    isDirty: boolean;
    isValid?: boolean;
    handleDelete?: () => void;
  };
  snapPoints?: (number | string)[];
  defaultSnap?: number | string;
  handleChangeSnap?: (snapPoint: string | number) => void;
  infoModal?: ({ snap, setSnap, snapPoints }: { snap: string; setSnap: React.Dispatch<React.SetStateAction<string | number>>; snapPoints: (number | string)[] }) => React.ReactNode;
};

export const ModalLayout = (props: ModalLayoutProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const presentationMode = props.presentationMode || "modal";

  if (isDesktop && presentationMode === "modal") {
    return <DesktopModal {...props} />;
  }

  if (isDesktop && presentationMode === "drawer") {
    return <DesktopDrawer {...props} />;
  }

  return <MobileDrawer {...props} />;
};

const DesktopModal = ({
  title,
  description,
  children,
  hideModal,
  showModal = false,
  onModalUnmount,
  footer,
}: ModalLayoutProps) => {
  const { handleSubmit, isDirty, isValid, handleDelete } = footer || {};
  const [snap, setSnap] = useState<string | number>(() => defaultSnap);
  const { t } = useTranslation();

  const handleOpenChange = async (nextOpen: boolean) => {
    if (nextOpen) return;

    const res = await hideModal();
    if (!res) return;

    onModalUnmount?.();
  };

  return (
    <Dialog open={showModal} onOpenChange={handleOpenChange}>
      <DialogContent className="md:max-w-2xl xl:max-w-3xl w-screen overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[80vh] px-2">
          {typeof children === "function" ? children(snap, setSnap, snapPoints) : children}
          {handleDelete && <FooterDelete handleDelete={handleDelete} show={!isDirty} />}
        </div>

        {handleSubmit && isDirty && <DialogFooter>
          <DialogClose asChild>
            <FooterModal
              handleCancel={() => handleOpenChange(false)}
              handleSubmit={handleSubmit}
              show={isDirty || false}
              isValid={isValid}
            />
          </DialogClose>
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

const defaultSnap = "0";
const snapPoints = ["0", '500'];
const DesktopDrawer = ({
  title,
  description,
  children,
  hideModal,
  showModal = false,
  onModalUnmount,
  footer,
  // snapPoints = [0, 0.3, 0.5],
  // defaultSnap = 0.5,
  backdropVisibility = "visible",
  infoModal,
  handleChangeSnap = () => { },
}: ModalLayoutProps) => {
  const [snap, setSnap] = useState<string | number>(() => defaultSnap);
  const handleOpenChange = useCallback(async (nextOpen: boolean) => {
    console.log("handleOpenChange", nextOpen);
    if (nextOpen) return;

    const res = await hideModal();
    if (!res) return;

    onModalUnmount?.();
  }, [hideModal, onModalUnmount]);

  const { handleSubmit, isDirty, isValid, handleDelete } = footer || {};



  return (<div

  >
    <Drawer
      direction="right"
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={((snapPoint: string | number | null) => {
        if (snapPoint !== null) {
          setSnap(snapPoint);
          handleChangeSnap(snapPoint);
        }
      })}
      open={showModal}
      onOpenChange={handleOpenChange}
      modal={backdropVisibility === "visible"}
    >
      <DrawerContent >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        {infoModal && infoModal({
          snap, setSnap: (e) => {
            setSnap(e); handleChangeSnap(e);
          }, snapPoints
        })}
        <div className={`overflow-y-scroll pb-20`}>
          {typeof children === "function" ? children(snap, setSnap, snapPoints) : children}
        </div>




        <div className={
          `absolute z-10  w-full max-w-124  left-0 right-0 p-4 bg-background border-t ` +
          (isDirty ? "pointer-events-auto bottom-0" : "pointer-events-none -bottom-20")
        }>
          {handleSubmit && <FooterModal
            handleCancel={() => setSnap(snapPoints[0])}
            handleSubmit={handleSubmit}
            show={isDirty || false}
            isValid={isValid}
          />}
          {handleDelete && <FooterDelete handleDelete={handleDelete} show={!isDirty} />}
        </div>
      </DrawerContent>

    </Drawer>
  </div>
  );
};

const MobileDrawer = ({
  title,
  description,
  children,
  hideModal,
  showModal = false,
  onModalUnmount,
  footer,
  snapPoints = [0.5, 0.75, 1],
  defaultSnap = 0.5,
  backdropVisibility = "visible",
  infoModal,
  handleChangeSnap = () => { },

}: ModalLayoutProps) => {
  const { handleSubmit, isDirty, isValid, handleDelete } = footer || {};
  const [snap, setSnap] = useState<number | string>(() => Number(defaultSnap) || 1);
  const { t } = useTranslation();
  const handleOpenChange = useCallback(async (nextOpen: boolean) => {
    if (nextOpen) return;

    const res = await hideModal();
    if (!res) return;

    // setSnap(0);
    onModalUnmount?.();
  }, [hideModal, onModalUnmount]);

  useEffect(() => {
    let mounted = true;
    const checkSnap = async () => {
      if (!mounted) return;
      // when snap reaches 0 we consider the drawer fully closed
      if (Number(snap) === 0) {
        if (await hideModal()) {
          onModalUnmount?.();
        }
      }
    };
    checkSnap();
    return () => { mounted = false; };
  }, [snap, hideModal, onModalUnmount]);



  return (
    <Drawer
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={((snapPoint: string | number | null) => {
        if (snapPoint !== null) {
          setSnap(snapPoint);
          handleChangeSnap(snapPoint);
        }
      })}
      open={showModal}
      onOpenChange={handleOpenChange}


      modal={backdropVisibility === "visible"}
    >
      <DrawerContent isFull={snap === 1}>
        <DrawerHeader className="group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left ">
          <DrawerTitle >{title}</DrawerTitle>
          <DrawerDescription >{description}</DrawerDescription>
          {snap === 1 && (
            <DrawerClose asChild>
              <Button variant="ghost" className="absolute top-2 right-2" onClick={() => handleOpenChange(false)}>
                <X size={18} />
                <span className="sr-only">{t("common.actions.close")}</span>
              </Button>
            </DrawerClose>
          )}

        </DrawerHeader>

        {infoModal && infoModal({
          snap, setSnap: (e) => {
            setSnap(e); handleChangeSnap(e);
          }, snapPoints
        })}

        <div className={`overflow-y-scroll min-h-screen pb-${isDirty ? "20" : "10"} px-4`}
          style={{
            marginBottom: `calc(100dvh * (1 - ${Number(snap)}))`,
          }}
        >

          {typeof children === "function" ? children(snap, setSnap, snapPoints) : children}

          {handleDelete && <FooterDelete handleDelete={handleDelete} show={!isDirty} />}

        </div>

        {handleSubmit && <StickyFooterModal
          handleCancel={() => handleOpenChange(false)}
          handleSubmit={handleSubmit}
          show={!!isDirty}
          isValid={isValid}
        />}
      </DrawerContent>

    </Drawer >
  );
};



const FooterDelete = ({ handleDelete, show }: { handleDelete: () => void; show: boolean }) => {
  const { t } = useTranslation();

  return show && (
    <div className=" w-full mt-4  flex justify-center">
      <Button
        className="flex-1"
        size="lg"
        variant="destructive"
        onClick={handleDelete}
        children={t("common.actions.delete")}
      />
    </div>
  )
}

const StickyFooterModal = ({ handleCancel, handleSubmit, show, isValid = true }: { handleCancel: () => void; handleSubmit: () => void; show: boolean; isValid?: boolean }) => {
  const { t } = useTranslation();

  return (
    <Portal.Portal
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        transform: show ? "translateY(0)" : "translateY(100%)",
        zIndex: 1000,
      }}
      className={`
          pointer-events-auto
          bg-card
        border-t   flex justify-center gap-2 p-2 
        transition-all duration-300  ease-in-out `}
      container={typeof window !== "undefined" ? document.body : undefined}
    >

      <Button
        className="flex-1"
        size="lg"
        variant="ghost"
        onClick={handleCancel}

        children={t("common.actions.cancel")}
      // children={}
      />
      <Button
        className="flex-1"
        size="lg"
        variant="default"
        onClick={handleSubmit}
        disabled={!isValid}
        children={t("common.actions.save")}
      />
    </Portal.Portal>
  );
}

const FooterModal = ({ handleCancel, handleSubmit, show, isValid = true }: { handleCancel: () => void; handleSubmit: () => void; show: boolean; isValid?: boolean }) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        transform: show ? "translateY(0)" : "translateY(200%)",
      }}
      className="
        border-t w-full  flex justify-center gap-2 overflow-hidden 
        transition-all duration-300  ease-in-out">
      <Button
        className="flex-1"
        size="lg"
        variant="ghost"
        onClick={handleCancel}
        children={t("common.actions.cancel")}
      />
      <Button
        className="flex-1"
        size="lg"
        variant="default"
        onClick={handleSubmit}
        disabled={!isValid}
        children={t("common.actions.save")}
      />
    </div>
  );
}