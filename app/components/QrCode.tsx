/* eslint-disable @next/next/no-img-element */
import QRCode from "qrcode";

export default async function QrCode({ value }: { value: string }) {
  const dataUrl = await QRCode.toDataURL(value, { margin: 1, scale: 7 });
  return (
    <img
      src={dataUrl}
      alt="QR code"
      style={{ width: 240, height: 240, borderRadius: 12, border: "1px solid #333" }}
    />
  );
}
