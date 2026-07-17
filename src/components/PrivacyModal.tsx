import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

const KEY = "motels.terms.accepted.v1";

export function PrivacyModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(KEY);
  });

  const accept = () => {
    localStorage.setItem(KEY, new Date().toISOString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && accept()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="gold-text text-2xl">{t("terms.title")}</DialogTitle>
          <DialogDescription>
            {t("privacy.intro")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-4 text-sm leading-relaxed text-muted-foreground">
          <p className="mb-3">{t("privacy.p1")}</p>
          <p className="mb-3"><strong>{t("privacy.p2Label")}</strong> {t("privacy.p2")}</p>
          <p className="mb-3"><strong>{t("privacy.p3Label")}</strong> {t("privacy.p3")}</p>
          <p className="mb-3"><strong>{t("privacy.p4Label")}</strong> {t("privacy.p4")}</p>
          <p className="mb-3"><strong>{t("privacy.p5Label")}</strong> {t("privacy.p5")}</p>
          <p><strong>{t("privacy.p6Label")}</strong> {t("privacy.p6")}</p>
        </ScrollArea>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => (window.location.href = "https://www.google.com")}>
            {t("terms.decline")}
          </Button>
          <Button onClick={accept} className="bg-[color:var(--gold)] text-[color:var(--primary-foreground)] hover:opacity-90">
            {t("terms.accept")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
