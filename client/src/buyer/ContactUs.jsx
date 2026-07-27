import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, ChevronDown, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import Footer from '../components/Footer';
import { usePropertyContext } from '../context/PropertyContext';

const ContactUs = () => {
  const { addAdminMessage } = usePropertyContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Schedule a Property Tour / Seller Support Query',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0); // Index 0 open by default

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = localStorage.getItem('userRole');
    if (addAdminMessage) {
      addAdminMessage({
        senderName: formData.name || (role === 'seller' ? 'Suresh Sharma (Verified Seller)' : 'Valued User'),
        senderRole: role ? role.toUpperCase() : 'GENERAL',
        email: formData.email || 'contact@realtyindia.com',
        phone: formData.phone || '+91 96925 30661',
        subject: formData.subject || 'Platform Support & Verification Assistance',
        message: formData.message || 'Assistance requested with listing management.'
      });
    }
    setIsSubmitted(true);
    // Reset notification after 6 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Schedule a Property Tour',
        message: '',
      });
    }, 6000);
  };

  const contactCards = [
    {
      icon: <Phone size={24} className="text-[#047262]" />,
      title: 'Call Us Directly',
      detail: '+91 12345 67890',
      subtext: 'Available Mon-Sat, 9:00 AM - 7:00 PM',
      action: 'tel:+911234567890',
      actionText: 'Call Now',
    },
    {
      icon: <Mail size={24} className="text-[#047262]" />,
      title: 'Email Support & Inquiries',
      detail: 'contact@realestate.com',
      subtext: 'Our team responds within 2 business hours',
      action: 'mailto:contact@realestate.com',
      actionText: 'Send Mail',
    },
    {
      icon: <MapPin size={24} className="text-[#047262]" />,
      title: 'Headquarters & Hub',
      detail: '123 Business Hub, India',
      subtext: 'Visit our flagship property experience center',
      action: '#',
      actionText: 'Get Directions',
    },
  ];

  const faqs = [
    {
      question: 'How fast do certified agents respond to tour requests?',
      answer:
        'Typically within 2 business hours during operating times! When you schedule an in-person or virtual tour through our portal, a dedicated agent instantly reserves your time slot and reaches out with confirmation details.',
    },
    {
      question: 'Can I connect directly with property owners with zero commission?',
      answer:
        'Yes absolutely! Our platform explicitly distinguishes between brokerage listings and verified zero-commission direct owner listings so you can communicate directly without intermediaries.',
    },
    {
      question: 'What documentation should I prepare before booking a tour?',
      answer:
        'No formal paperwork is required just to view or tour properties! However, if you are planning to reserve or bid on a property, having valid photo identification and income verification will streamline your approval process.',
    },
    {
      question: 'Do you offer personalized neighborhood & valuation analysis?',
      answer:
        'Yes! Our AI smart tools and regional concierge agents can generate a complimentary tailored PDF report analyzing neighborhood appreciation trends, school ratings, and rental ROI.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70">
      
      {/* Header Banner Section */}
      <section className="bg-white pt-12 md:pt-16 pb-16 px-6 md:px-12 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0f5f0] text-[#047262] font-extrabold text-xs tracking-wider uppercase mb-5 shadow-xs">
            <Sparkles size={14} />
            <span>Client Concierge & Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a2b3c] tracking-tight max-w-3xl mx-auto leading-[1.15] mb-4">
            We're Here to Help You Find Your <span className="text-[#047262]">Dream Property</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you need assistance scheduling a private showing, verifying pricing details,
            or exploring customized neighborhood insights, our real estate specialists are ready.
          </p>
        </div>
      </section>

      {/* Quick Contact Cards Grid */}
      <section className="py-12 px-6 md:px-12 max-w-[1400px] mx-auto -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-7 border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(4,114,98,0.1)] hover:border-[#047262]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-13 h-13 rounded-2xl bg-[#e0f5f0] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-lg font-black text-[#1a2b3c] mb-1">
                  {card.title}
                </h3>
                <p className="text-[#047262] font-black text-base mb-2">
                  {card.detail}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-6 font-normal">
                  {card.subtext}
                </p>
              </div>
              <a
                href={card.action}
                className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gray-50 hover:bg-[#047262] text-gray-700 hover:text-white font-extrabold text-xs transition-colors border border-gray-200/60 group-hover:border-transparent shadow-xs"
              >
                {card.actionText}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Main Split Section: Form on Left, FAQs on Right */}
      <section className="py-10 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-200/80 shadow-[0_15px_60px_rgba(0,0,0,0.04)] relative overflow-hidden">
            
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#1a2b3c] tracking-tight mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 text-sm font-normal">
                Fill out the form below and a dedicated agent will connect with you shortly.
              </p>
            </div>

            {/* Success Toast Notification */}
            {isSubmitted && (
              <div className="mb-6 bg-[#e0f5f0] border-2 border-[#047262] rounded-2xl p-5 flex items-start gap-4 animate-in fade-in duration-300">
                <CheckCircle size={24} className="text-[#047262] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-[#1a2b3c] text-sm">Message Sent Successfully!</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Thank you for contacting RealEstate. One of our Senior Property Concierge specialists has received your inquiry and will reach out to you within 2 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-extrabold text-[#1a2b3c] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-extrabold text-[#1a2b3c] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Inquiry Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-extrabold text-[#1a2b3c] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-extrabold text-[#1a2b3c] mb-2">
                    Inquiry Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200 cursor-pointer font-medium"
                  >
                    <option value="Schedule a Property Tour">Schedule a Property Tour</option>
                    <option value="General Property Inquiry">General Property Inquiry</option>
                    <option value="Direct Owner Verification">Direct Owner Verification</option>
                    <option value="Agent & Brokerage Support">Agent & Brokerage Support</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div>
                <label className="block text-xs md:text-sm font-extrabold text-[#1a2b3c] mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us which listing ID or neighborhood you are interested in, your preferred touring schedule, or any specific requirements..."
                  required
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200 resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-[#047262] hover:bg-[#03594d] text-white font-black text-sm md:text-base rounded-xl shadow-[0_8px_20px_rgba(4,114,98,0.25)] hover:shadow-[0_12px_25px_rgba(4,114,98,0.35)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <Send size={18} />
                <span>Submit Message</span>
              </button>
            </form>
          </div>

          {/* Right Column: FAQ Accordion & Live Support Box */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* FAQ Card Container */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-200/80 shadow-[0_15px_60px_rgba(0,0,0,0.03)]">
              <h3 className="text-xl md:text-2xl font-black text-[#1a2b3c] tracking-tight mb-2">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mb-6 font-normal">
                Quick answers to common questions about touring and communication.
              </p>

              {/* Accordion List */}
              <div className="space-y-3.5">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                        isOpen ? 'border-[#047262] bg-[#f7fcfa]' : 'border-gray-200/80 bg-white hover:border-gray-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-4 md:p-5 text-left font-black text-[#1a2b3c] text-xs md:text-sm flex items-center justify-between gap-3 focus:outline-none"
                      >
                        <span className={isOpen ? 'text-[#047262]' : 'text-gray-800'}>{faq.question}</span>
                        <ChevronDown
                          size={18}
                          className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180 text-[#047262]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-200/40 pt-3 font-normal animate-in fade-in duration-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Support / Concierge Call to Action Card */}
            <div className="bg-[#1a2b3c] text-white rounded-[2.5rem] p-8 md:p-9 shadow-xl relative overflow-hidden">
              {/* Background Accent Decorative Circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#047262]/20 blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#047262] flex items-center justify-center text-white font-bold shadow-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-base font-black tracking-tight">Immediate Assistance</h4>
                  <span className="text-xs text-[#047262] font-extrabold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#047262] animate-pulse" />
                    Agents Active Online
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-normal mb-6">
                Need urgent assistance while actively visiting a property or bidding? Connect instantly with our dedicated live concierge hotline.
              </p>

              <a
                href="tel:+911234567890"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#047262] hover:bg-[#03594d] text-white font-extrabold text-sm transition-colors shadow-lg"
              >
                <Phone size={16} />
                <span>Call Live Concierge (+91 12345 67890)</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* Footer Included */}
      <Footer />
    </div>
  );
};

export default ContactUs;
