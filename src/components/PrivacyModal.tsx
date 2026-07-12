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
            Antes de continuar, por favor revisa nuestra política.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-4 text-sm leading-relaxed text-muted-foreground">
          <p className="mb-3">
            El presente Política de Privacidad establece los términos en que Motel Tantra usa y protege
            la información que es proporcionada por sus usuarios al momento de utilizar su sitio web.
            Esta compañía está comprometida con la seguridad de los datos de sus usuarios.
          </p>
          <p className="mb-3">
            <strong>Información recogida:</strong> Nuestro sitio web podrá recoger información personal
            como nombre, correo electrónico e información demográfica. Cuando sea necesario podrá ser
            requerida información específica para procesar algún pedido o realizar una entrega o
            facturación.
          </p>
          <p className="mb-3">
            <strong>Uso de la información:</strong> Empleamos la información para proporcionar el mejor
            servicio posible, mantener un registro de usuarios y de pedidos, y mejorar nuestros servicios.
            Podríamos enviarle correos periódicamente con ofertas especiales que consideremos relevantes
            para usted; puede cancelarlos en cualquier momento.
          </p>
          <p className="mb-3">
            <strong>Cookies:</strong> Empleamos cookies para identificar las páginas visitadas y su
            frecuencia, únicamente para análisis estadístico. Puede eliminarlas o rechazarlas desde su
            navegador; algunas funciones podrían no estar disponibles si las declina.
          </p>
          <p className="mb-3">
            <strong>Enlaces a terceros:</strong> Podría contener enlaces a otros sitios; no somos
            responsables de sus términos ni de la protección de datos en esos sitios.
          </p>
          <p>
            <strong>Control de su información:</strong> Puede restringir la recopilación o el uso de su
            información en cualquier momento. No venderemos ni distribuiremos su información sin su
            consentimiento, salvo requerimiento judicial. Nos reservamos el derecho de cambiar estos
            términos en cualquier momento.
          </p>
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
