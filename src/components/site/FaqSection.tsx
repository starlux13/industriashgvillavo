import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    qEs: "¿Es necesario reservar con anticipación?",
    qEn: "Do I need to book in advance?",
    aEs: "Recomendamos reservar por WhatsApp para asegurar disponibilidad, sobre todo los fines de semana.",
    aEn: "We recommend booking via WhatsApp to secure availability, especially on weekends.",
  },
  {
    qEs: "¿Se puede pagar en la llegada?",
    qEn: "Can I pay upon arrival?",
    aEs: "Sí, aceptamos efectivo, transferencia y tarjetas al llegar.",
    aEn: "Yes, we accept cash, transfers and cards on arrival.",
  },
  {
    qEs: "¿Hay parqueadero privado?",
    qEn: "Is there private parking?",
    aEs: "Sí, todos nuestros sitios cuentan con parqueadero privado incluido.",
    aEn: "Yes, all our sites include private parking.",
  },
  {
    qEs: "¿Puedo pedir decoración especial?",
    qEn: "Can I request special decoration?",
    aEs: "Sí, ofrecemos decoraciones para cumpleaños, aniversarios y ocasiones especiales con costo adicional.",
    aEn: "Yes, we offer decorations for birthdays, anniversaries and special occasions for an extra fee.",
  },
  {
    qEs: "¿Cuál es el horario de check-in y check-out?",
    qEn: "What are the check-in and check-out hours?",
    aEs: "Atendemos 24/7. El tiempo estándar de la habitación es acordado al momento de la reserva.",
    aEn: "We are open 24/7. Standard room time is agreed at booking.",
  },
];

export function FaqSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";

  return (
    <section id="faq" className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-4xl font-semibold sm:text-5xl"
        >
          <span className="gold-text">{t("faq.title")}</span>
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {lang === "es" ? f.qEs : f.qEn}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {lang === "es" ? f.aEs : f.aEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
