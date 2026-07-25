import React, { useState } from 'react';
import { ShieldCheck, Zap, DollarSign, Video, ArrowRight } from 'lucide-react';

const cardsData = [
  {
    id: 1,
    title: 'Verified Trust',
    description: 'Every listing is strictly audited for ownership, condition, and legality.',
    icon: <ShieldCheck size={22} className="text-[#047262]" strokeWidth={2.5} />,
    defaultActive: false,
  },
  {
    id: 2,
    title: 'Smart Search',
    description: 'Our AI-driven algorithms help you find the best matches based on preferences.',
    icon: <Zap size={22} className="text-[#047262] fill-[#047262]" />,
    defaultActive: true,
  },
  {
    id: 3,
    title: 'Best Value',
    description: 'Direct-from-owner listings and zero-commission options to ensure competitive prices.',
    icon: (
      <div className="w-6 h-6 rounded-full border-[2.5px] border-[#047262] flex items-center justify-center font-extrabold text-xs text-[#047262]">
        $
      </div>
    ),
    defaultActive: false,
  },
  {
    id: 4,
    title: 'Virtual Tours',
    description: 'High-definition 3D tours allow you to experience the property from home.',
    icon: <Video size={22} className="text-[#047262] fill-[#047262]/20" strokeWidth={2.5} />,
    defaultActive: false,
  },
];

const benefitsList = [
  'Direct connection with certified agents',
  'Real-time market valuation data',
  'Secure document management system',
  '24/7 Premium customer support',
];

const WhyChooseUs = () => {
  const [activeCard, setActiveCard] = useState(2); // "Smart Search" selected by default as in screenshot

  return (
    <section className="bg-white py-16 md:py-28 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: 2x2 Feature Cards Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 order-2 lg:order-1">
          {cardsData.map((card) => {
            const isSelected = activeCard === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCard(card.id)}
                onMouseEnter={() => setActiveCard(card.id)}
                className={`cursor-pointer rounded-[2rem] p-7 md:p-8 bg-white transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#047262] shadow-[0_20px_50px_rgba(4,114,98,0.12)]'
                    : 'border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-[#047262]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]'
                }`}
              >
                <div>
                  {/* Icon Badge */}
                  <div className="w-13 h-13 md:w-14 md:h-14 rounded-2xl bg-[#e0f5f0] flex items-center justify-center mb-6 shadow-xs w-fit px-3.5 py-3.5 transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg md:text-xl font-black text-[#1a2b3c] mb-3 tracking-tight">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Title, Description & Benefits List */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-7 order-1 lg:order-2 lg:pl-4">
          
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a2b3c] tracking-tight leading-[1.15] md:leading-[1.15]">
            Why RealEstate <br className="hidden sm:block" />
            is the <span className="text-[#047262]">Preferred Choice.</span>
          </h2>

          {/* Subtext */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal max-w-xl">
            We've reinvented the property search experience from the ground up. By focusing on
            transparency, technological precision, and user-centric design, we help you find not
            just a house, but a home.
          </p>

          {/* Benefits Bullet Points */}
          <div className="space-y-3.5 pt-2 w-full">
            {benefitsList.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm md:text-base font-extrabold text-[#1a2b3c]">
                <Zap size={16} className="text-[#047262] flex-shrink-0 fill-current" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Call to Action Link */}
          <div className="pt-4">
            <a 
              href="#process" 
              className="group inline-flex items-center gap-2 text-[#047262] font-extrabold text-sm md:text-base border-b border-[#047262] pb-0.5 hover:text-[#03594d] hover:border-[#03594d] transition-all"
            >
              <span>Learn more about our process</span>
              <ArrowRight size={17} className="transform group-hover:translate-x-1.5 transition-transform duration-200" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
