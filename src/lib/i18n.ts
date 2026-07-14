import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  es: {
    translation: {
      brand: "Moteles Villavicencio",
      loading: "Preparando tu experiencia…",
      terms: {
        title: "Política de Privacidad",
        accept: "Acepto",
        decline: "Rechazar",
        readMore: "Ver más",
      },
      selector: {
        title: "Elige tu experiencia",
        subtitle: "Un clic para previsualizar · Dos clics para entrar",
        enter: "Entrar",
        preview: "Vista previa",
      },
      nav: {
        home: "Inicio",
        rooms: "Habitaciones",
        services: "Servicios",
        gallery: "Galería",
        attractions: "Atracciones",
        reviews: "Opiniones",
        faq: "Preguntas frecuentes",
        contact: "Contacto",
        login: "Ingresar",
        dashboard: "Panel",
        logout: "Salir",
      },
      hero: {
        book: "Reservar ahora",
        whatsapp: "WhatsApp",
        scroll: "Desliza para descubrir",
      },
      rooms: {
        title: "Habitaciones & Tarifas",
        subtitle: "Espacios pensados para el placer y la privacidad",
        night: "por noche",
        guests: "huéspedes",
        book: "Reservar",
        filterGuests: "Personas",
        filterType: "Tipo",
        filterPrice: "Precio máx.",
        types: {
          all: "Todas",
          suite: "Suite Presidencial",
          cabin: "Cabaña",
          room: "Habitación",
          tent: "Glamping",
        },
      },
      services: {
        title: "Servicios incluidos",
        subtitle: "Todo lo que necesitas para una escapada perfecta",
      },
      gallery: {
        title: "Galería",
        subtitle: "Un vistazo a nuestros espacios",
      },
      attractions: {
        title: "Cerca de ti",
        subtitle: "Villavicencio y sus alrededores",
      },
      reviews: {
        title: "Lo que dicen nuestros huéspedes",
        empty: "Sé el primero en dejar tu opinión",
      },
      faq: {
        title: "Preguntas frecuentes",
      },
      contact: {
        title: "Contacto & Ubicación",
        phone: "Teléfono",
        whatsapp: "WhatsApp",
        address: "Dirección",
        hours: "Horario",
        hours247: "Abierto 24/7",
      },
      booking: {
        title: "Reserva tu escapada",
        subtitle: "Te contactaremos por WhatsApp con la confirmación",
        checkIn: "Fecha de entrada",
        checkOut: "Fecha de salida",
        guests: "Huéspedes",
        roomType: "Tipo de habitación",
        decoration: "Decoración (opcional)",
        decorationHint: "Costo adicional según elección",
        name: "Tu nombre (opcional)",
        phone: "Tu teléfono",
        submit: "Enviar por WhatsApp",
        success: "¡Solicitud enviada! Te contactamos por WhatsApp.",
        alias: "Alias asignado",
        decorationOptions: {
          none: "Sin decoración",
          birthday: "Cumpleaños (+$80.000)",
          romantic: "Romántica (+$120.000)",
          anniversary: "Aniversario (+$150.000)",
          bachelor: "Despedida (+$200.000)",
        },
      },
      auth: {
        signIn: "Iniciar sesión",
        signUp: "Crear cuenta",
        email: "Correo electrónico",
        password: "Contraseña",
        fullName: "Nombre completo",
        phone: "Número de celular",
        docId: "Número de cédula",
        google: "Continuar con Google",
        haveAccount: "¿Ya tienes cuenta?",
        noAccount: "¿No tienes cuenta?",
        passwordHint: "Mínimo 8 caracteres, con letras y números",
      },
      floating: {
        top: "Volver arriba",
        theme: "Cambiar tema",
        lang: "Cambiar idioma",
      },
    },
  },
  en: {
    translation: {
      brand: "Villavicencio Motels",
      loading: "Preparing your experience…",
      terms: {
        title: "Privacy Policy",
        accept: "I accept",
        decline: "Decline",
        readMore: "Read more",
      },
      selector: {
        title: "Choose your experience",
        subtitle: "One click to preview · Two clicks to enter",
        enter: "Enter",
        preview: "Preview",
      },
      nav: {
        home: "Home",
        rooms: "Rooms",
        services: "Services",
        gallery: "Gallery",
        attractions: "Attractions",
        reviews: "Reviews",
        faq: "FAQ",
        contact: "Contact",
        login: "Sign in",
        dashboard: "Dashboard",
        logout: "Sign out",
      },
      hero: {
        book: "Book now",
        whatsapp: "WhatsApp",
        scroll: "Scroll to discover",
      },
      rooms: {
        title: "Rooms & Rates",
        subtitle: "Spaces designed for pleasure and privacy",
        night: "per night",
        guests: "guests",
        book: "Book",
        filterGuests: "Guests",
        filterType: "Type",
        filterPrice: "Max price",
        types: {
          all: "All",
          suite: "Presidential Suite",
          cabin: "Cabin",
          room: "Room",
          tent: "Glamping",
        },
      },
      services: {
        title: "Included services",
        subtitle: "Everything you need for a perfect getaway",
      },
      gallery: {
        title: "Gallery",
        subtitle: "A glimpse of our spaces",
      },
      attractions: {
        title: "Around you",
        subtitle: "Villavicencio and its surroundings",
      },
      reviews: {
        title: "What our guests say",
        empty: "Be the first to leave a review",
      },
      faq: {
        title: "Frequently asked questions",
      },
      contact: {
        title: "Contact & Location",
        phone: "Phone",
        whatsapp: "WhatsApp",
        address: "Address",
        hours: "Hours",
        hours247: "Open 24/7",
      },
      booking: {
        title: "Book your getaway",
        subtitle: "We will contact you via WhatsApp with the confirmation",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        roomType: "Room type",
        decoration: "Decoration (optional)",
        decorationHint: "Extra cost depending on choice",
        name: "Your name (optional)",
        phone: "Your phone",
        submit: "Send via WhatsApp",
        success: "Request sent! We'll reach you on WhatsApp.",
        alias: "Assigned alias",
        decorationOptions: {
          none: "No decoration",
          birthday: "Birthday (+$80,000)",
          romantic: "Romantic (+$120,000)",
          anniversary: "Anniversary (+$150,000)",
          bachelor: "Bachelor(ette) (+$200,000)",
        },
      },
      auth: {
        signIn: "Sign in",
        signUp: "Create account",
        email: "Email",
        password: "Password",
        fullName: "Full name",
        phone: "Phone number",
        docId: "ID number",
        google: "Continue with Google",
        haveAccount: "Already have an account?",
        noAccount: "No account yet?",
        passwordHint: "At least 8 characters, letters and numbers",
      },
      floating: {
        top: "Back to top",
        theme: "Toggle theme",
        lang: "Change language",
      },
    },
  },
};

if (!i18n.isInitialized) {
  const isBrowser = typeof window !== "undefined";
  const chain = isBrowser
    ? i18n.use(LanguageDetector).use(initReactI18next)
    : i18n.use(initReactI18next);
  chain.init({
    resources,
    lng: "es",
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    initImmediate: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });
}
if (!i18n.language) i18n.language = "es";

export default i18n;
