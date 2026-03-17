import React, { useState } from "react";
import { api } from "../services/api";
import { useContent } from "../hooks/useContent";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, QrCode, X, Globe } from "lucide-react";

export default function Donate() {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showUPI, setShowUPI] = useState(false);
  const [upiLink, setUpiLink] = useState("");

  const { content: donationDesc } = useContent("donation_description", "Your contribution helps us provide essential resources to communities in need. Every donation makes a difference.");
  const { content: upiId } = useContent("upi_id", "mayursubhashthoke888-1@oksbi");
  const { content: upiName } = useContent("upi_name", "Mayur Thoke");

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    const finalAmount = customAmount ? parseInt(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    // Create the UPI deep link
    // Format: upi://pay?pa=payee_address&pn=payee_name&am=amount&cu=currency
    const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${finalAmount}&cu=INR`;
    setUpiLink(link);
    setShowUPI(true);
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    const finalAmount = customAmount ? parseInt(customAmount) : amount;
    try {
      // Record the donation intent on the backend only after user confirms they've initiated payment
      await api.post("/donations/intent", {
        donorName,
        email,
        phone,
        amount: finalAmount,
        method: "UPI"
      });

      setMessage({ type: "success", text: "Thank you! Your donation is being processed. We will verify the payment shortly." });
      setShowUPI(false);
      setDonorName(""); setEmail(""); setPhone(""); setCustomAmount("");
    } catch (error) {
      console.error("Error recording donation", error);
      setMessage({ type: "error", text: "Could not record donation. Please contact support if you have already paid." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-orange-50 py-32 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-6xl mb-6">Support Our Cause</h1>
          <p className="text-xl text-slate-500 font-light leading-relaxed">{donationDesc}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-200/50 p-10 sm:p-14 border border-orange-100">
          {message.text && (
            <div className={`mb-10 p-5 rounded-2xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {message.text}
            </div>
          )}
          <form onSubmit={handleDonate} className="space-y-10">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Select Amount (INR)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-6">
                {[500, 1000, 2000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setAmount(amt); setCustomAmount(""); }}
                    className={`py-4 px-6 rounded-2xl border-2 text-base font-black transition-all duration-300 ${
                      amount === amt && !customAmount
                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg shadow-orange-100"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200 hover:bg-white"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-black text-lg">₹</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter Custom Amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                  className="w-full pl-12 pr-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-0 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Donor Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Your Details</h3>
                <div className="h-px bg-slate-100 flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-0 py-4 px-6 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-0 py-4 px-6 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-0 py-4 px-6 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-6 px-8 rounded-2xl bg-orange-500 text-white font-black text-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 transition-all shadow-xl shadow-orange-200 active:scale-[0.98] transform"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Smartphone className="w-6 h-6" />
                  Donate via UPI ₹{customAmount || amount}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Bank Transfer Details */}
        <div className="mt-12 bg-white rounded-[2.5rem] shadow-xl shadow-orange-200/50 p-10 sm:p-14 border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Direct Bank Transfer</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bank Holder Name</label>
                  <p className="text-lg font-black text-slate-900">Mayur Subhash Thoke</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bank Name</label>
                  <p className="text-lg font-black text-slate-900">Canara Bank Shrirampur</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Branch</label>
                  <p className="text-lg font-black text-slate-900">SHRIRAMPUR</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <label className="block text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Account Number</label>
                  <p className="text-2xl font-black text-orange-700 font-mono tracking-wider">110075588750</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">IFSC Code</label>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-wider">CNRB0001410</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm font-medium leading-relaxed">
              <p>After making a bank transfer, please share the transaction receipt with us at <span className="text-white font-bold">subhvaishalifoundation@gmail.com</span> along with your contact details so we can issue your donation receipt.</p>
            </div>
          </div>
        </div>

        {/* UPI Payment Modal */}
        {showUPI && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="relative p-8 text-center">
                <button 
                  onClick={() => setShowUPI(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="mb-8 mt-4">
                  <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-10 h-10 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Scan to Pay</h2>
                  <p className="text-slate-500 font-medium">Use any UPI app to complete payment</p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 mb-8 flex justify-center">
                  <QRCodeSVG 
                    value={upiLink} 
                    size={200}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <a 
                    href={upiLink}
                    onClick={() => {
                      // On mobile, this will open the app. We don't close the modal
                      // so they can come back and click "I have paid"
                    }}
                    className="flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Smartphone className="w-5 h-5" />
                    Open in UPI App
                  </a>

                  <button 
                    onClick={confirmPayment}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl bg-orange-500 text-white font-black text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "I have completed the payment"}
                  </button>

                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Payee: {upiName}
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Amount: ₹{customAmount || amount}
                  </p>
                </div>
              </div>
              
                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                <p className="text-sm text-slate-500 font-medium">
                  Important: After completing the payment in your UPI app, please click the "I have completed the payment" button above to notify us.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
