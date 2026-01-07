export const ADSTERRA_URL = "https://www.effectivegatecpm.com/ruhbqsm3?key=86858c994c71f24a6dc907c26649cc01";

export const triggerAd = () => {
  if (!ADSTERRA_URL) return;
  // Abre el anuncio en una nueva pestaña sin perder el foco de la actual (a veces)
  window.open(ADSTERRA_URL, '_blank');
};