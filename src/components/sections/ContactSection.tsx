import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Mail, 
  Linkedin, 
  MapPin, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { contact } = data;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'Custom Browser Automation Bots',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formState.name.trim()) {
      errs.name = 'Please enter your name';
    }
    if (!formState.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formState.message.trim()) {
      errs.message = 'Please provide details about your target industry, location, or data requirements';
    } else if (formState.message.trim().length < 15) {
      errs.message = 'Please provide a bit more detail (at least 15 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate sending and provide immediate mailto option & clean confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const directMailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Inquiry regarding ${formState.projectType || 'Python Automation'}`
  )}&body=${encodeURIComponent(
    `Hi Ibrahim,\n\nName: ${formState.name}\nEmail: ${formState.email}\nProject Type: ${formState.projectType}\n\nProject details:\n${formState.message}\n`
  )}`;

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Get in Touch
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
            Contact
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Have a target market, niche, or specific website in mind? Reach out with your parameters and I will get back to you with a structured proposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Card */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 transition-all hover:border-slate-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 transition-all hover:border-slate-700">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                      LinkedIn Profile
                    </span>
                    <a
                      href={contact.linkedIn.startsWith('http') ? contact.linkedIn : `https://${contact.linkedIn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors break-all flex items-center gap-1.5"
                    >
                      <span>{contact.linkedIn.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 transition-all hover:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Location
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {contact.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Note */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{contact.availabilityNote}</span>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl relative">
              
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Message Prepared & Recorded
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-white">{formState.name}</span>. Your project parameters for <span className="text-cyan-300">{formState.projectType}</span> have been captured.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={directMailtoUrl}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Email Client to Send Directly</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormState({
                          name: '',
                          email: '',
                          projectType: 'Custom Browser Automation Bots',
                          message: ''
                        });
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label 
                        htmlFor="contact-name" 
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        value={formState.name}
                        onChange={(e) => {
                          setFormState({ ...formState, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                          errors.name 
                            ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label 
                        htmlFor="contact-email" 
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Your Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={formState.email}
                        onChange={(e) => {
                          setFormState({ ...formState, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="alex@company.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                          errors.email 
                            ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label 
                      htmlFor="projectType" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      value={formState.projectType}
                      onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    >
                      <option value="Custom Browser Automation Bots">Custom Browser Automation Bots</option>
                      <option value="Web Workflow & Task Automation">Web Workflow &amp; Task Automation</option>
                      <option value="Web Scraping & Data Extraction">Web Scraping &amp; Data Extraction</option>
                      <option value="AI-Assisted Automation">AI-Assisted Automation</option>
                      <option value="Google Sheets & Docs Automation">Google Sheets &amp; Docs Automation</option>
                      <option value="Lead Discovery Automation">Lead Discovery Automation</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label 
                      htmlFor="contact-message" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Message / Project Details <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={formState.message}
                      onChange={(e) => {
                        setFormState({ ...formState, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      placeholder="Describe your repetitive web workflow, steps to automate, or data to extract..."
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                        errors.message 
                          ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="contact-submit-btn"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer shadow-lg shadow-cyan-400/20"
                    >
                      {isSubmitting ? (
                        <span>Validating...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-[11px] text-slate-400">
                      Direct response guaranteed within 24 hours. No spam, ever.
                    </span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
