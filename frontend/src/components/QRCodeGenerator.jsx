import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const QRCodeGenerator = ({ donationId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && donationId) {
      const qrData = JSON.stringify({
        donationId,
        type: 'pickup_verification',
        timestamp: new Date().toISOString(),
      });

      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 256,
          margin: 2,
          color: {
            dark: '#16a34a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error);
        }
      );
    }
  }, [donationId]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `donation-qr-${donationId}.png`;
      link.href = url;
      link.click();
      toast.success('QR Code downloaded!');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pickup QR Code</h3>
        <p className="text-sm text-gray-600">
          Share this QR code with the receiver for pickup verification
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl">
          <canvas ref={canvasRef} className="rounded-lg shadow-md" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Scan to verify pickup
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download QR Code
        </button>

        <p className="text-xs text-gray-500 text-center">
          Donation ID: {donationId}
        </p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
