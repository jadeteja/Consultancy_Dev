import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2,
  Building,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill message and redirect or prompt confirmation
    setSubmitted(true);
  };

  const directWhatsAppUrl = `https://wa.me/917285927080?text=${encodeURIComponent(
    `Hello Next step solutions, my name is ${formData.name || 'Job Seeker'}. I am contacting you regarding: ${
      formData.subject || 'Career inquiry'
    }. ${formData.message}`
  )}`;

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-white to-[#F7FAFF] border-b border-slate-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#0866D9] text-xs font-semibold tracking-wide uppercase">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A56] tracking-tight">
            Contact Next Step Solutions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have queries regarding current job openings, placement support, or corporate hiring partnerships? We are here to assist you.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Cards */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-[#102A56]">Contact Information</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Reach out directly through phone, WhatsApp, email, or visit our office during working hours.
            </p>

            <div className="space-y-4">
              {/* Phone */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0866D9] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone Support</div>
                  <a 
                    href="tel:+917285927080" 
                    className="text-base font-bold text-[#102A56] hover:text-[#0866D9] transition-colors block mt-0.5"
                  >
                    +91 72859 27080
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Available Mon – Sat (9:30 AM – 6:30 PM)</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">WhatsApp Desk</div>
                  <a 
                    href="https://wa.me/917285927080?text=Hello%20Next%20step%20solutions%2C%20I%20have%20an%20inquiry" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base font-bold text-[#25D366] hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <span>+91 72859 27080</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Instant chat & resume submissions</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</div>
                  <a 
                    href="mailto:nextstepsolutions.recruitment@gmail.com" 
                    className="text-sm sm:text-base font-bold text-[#102A56] hover:text-[#0866D9] transition-colors block mt-0.5 break-all"
                  >
                    nextstepsolutions.recruitment@gmail.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">For corporate mandates & resume reviews</p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Head Office</div>
                  <p className="text-sm font-semibold text-[#102A56] mt-0.5">
                    Cyber Towers, HITEC City
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Hyderabad, Telangana – 500081, India</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operating Hours</div>
                  <p className="text-sm font-semibold text-[#102A56] mt-0.5">
                    Monday to Saturday
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">09:30 AM to 06:30 PM IST (Sunday Closed)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#102A56]">Send Us a Message</h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill in your details below and our talent acquisition desk will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Thank You for Reaching Out!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We have received your message. You can also connect immediately with our representative on WhatsApp.
                </p>
                <div className="pt-2">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-emerald-600 text-white shadow-md transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Continue on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0866D9] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0866D9] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0866D9] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0866D9] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select an option</option>
                      <option value="Job Seeking / Candidate Placement">Job Seeking / Candidate Placement</option>
                      <option value="Resume Guidance">Resume Guidance & Interview Tips</option>
                      <option value="Corporate Employer Hiring">Corporate Employer Hiring / Tie-ups</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your educational background, experience, or hiring requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0866D9] focus:border-transparent transition-all resize-y"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#0866D9] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>

                  <a
                    href="https://wa.me/917285927080?text=Hello%20Next%20step%20solutions%2C%20I%20want%20to%20connect%20with%20your%20team"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
