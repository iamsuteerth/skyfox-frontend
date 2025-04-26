import { getPDFTicket } from '@/services/booking-service';

function base64ToBlob(base64: string, type = 'application/pdf'): Blob {
  const byteChars = atob(base64);
  const byteArrays = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArrays[i] = byteChars.charCodeAt(i);
  }
  return new Blob([byteArrays], { type });
}

export const downloadTicket = async (
  bookingId: number,
  showToast: Function,
  fileName = `Skyfox_Booking_${bookingId}.pdf`
) => {
  try {
    const pdfBase64 = await getPDFTicket(bookingId);
    const blob = base64ToBlob(pdfBase64);

    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    showToast({
      type: "error",
      title: "Download failed",
      description: error?.message || "Unable to download the ticket PDF.",
    });
  }
};
