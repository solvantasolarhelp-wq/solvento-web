"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// slides array removed as we now have a redesigned static hero section

const services = [
  { icon: "🏠", title: "Home Rooftop Solar", desc: "1–10 kWp systems with PM Surya Ghar subsidy up to ₹78,000. Best solar for homes in Jaipur.", tags: ["1–10 kWp","₹78K Subsidy","On-Grid"] },
  { icon: "🏭", title: "Commercial & Industrial", desc: "50 kW–1 MW solar plants for factories, warehouses, hospitals. Cut bills by up to 80%.", tags: ["EPC Project","3 Phase","80% Savings"] },
  { icon: "🔋", title: "Battery & Net Metering", desc: "Solar battery storage + net metering to sell surplus power back to DISCOM grid.", tags: ["Hybrid","Off-Grid","24/7 Power"] },
  { icon: "🔧", title: "AMC & Maintenance", desc: "Annual maintenance, panel cleaning, inverter servicing across Rajasthan.", tags: ["AMC","Monitoring","Warranty"] },
];

const reviews = [
  { initials: "RS", name: "Ramesh Sharma", city: "Vaishali Nagar, Jaipur", text: "Solvanta installed 5 kWp on my home. They handled all PM Surya Ghar paperwork and ₹78,000 subsidy came within 18 days. Excellent service!" },
  { initials: "PK", name: "Prakash Kumar", city: "Sitapura Industrial Area", text: "10 kWp 3-phase for our factory. Bill went from ₹42,000 to under ₹8,000/month. Professional team completed work in 18 days." },
  { initials: "SM", name: "Sunita Meena", city: "Kalwar Road, Jaipur", text: "Best solar company in Jaipur! Transparent pricing, quality INA panels, outstanding after-sales. Electricity bill almost zero now." },
];

const partners = ["INA","X-Watt","Tata Power","Adani Solar","Waaree","Luminous"];

export default function MarketingHome() {
  const [bill, setBill] = useState(3000);
  const [calcDone, setCalcDone] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  const kwp = bill >= 8000 ? 10 : bill >= 5000 ? 6 : bill >= 2000 ? 2 : 1;
  const subsidy = kwp >= 3 ? 78000 : kwp >= 2 ? 60000 : 30000;
  const save = Math.round(bill * 0.88);
  const cost = kwp * 51250 - subsidy;
  const payback = (cost / (save * 12)).toFixed(1);

  return (
    <div className="min-h-screen bg-white text-sol-navy">
      <nav className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[calc(100%-2rem)] max-w-5xl z-50 bg-white/85 backdrop-blur-md border border-slate-200/50 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-full h-15 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0 border border-slate-100 shadow-sm">
            <Image src="/logo.jpg" alt="Solvanta" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <div className="text-sol-navy font-black text-xs tracking-wide leading-none">SOLVANTA</div>
            <div className="text-sol-teal text-[8px] font-bold tracking-widest leading-none mt-0.5">SOLAR ENERGY</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          {["home","about","services","subsidy","contact"].map(s => {
            const isActive = activeSection === s;
            const label = s === "subsidy" ? "PM Subsidy" : s;
            return (
              <button 
                key={s} 
                onClick={() => { setActiveSection(s); document.getElementById(s)?.scrollIntoView({behavior:"smooth"}); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? "bg-[#bbf7d0] text-[#09221C] shadow-sm" 
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/50"
                }`}
              >
                {label}
                {isActive && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#09221C] text-white text-[8px] flex items-center justify-center font-black">
                    ★
                  </span>
                )}
              </button>
            );
          })}
          {/* Associate login link */}
          <Link href="/associate/login" className="ml-2 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 transition-all">
            Associate Login
          </Link>
        </div>
        <Link href="/contact" onClick={e => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}); }}
          className="bg-[#09221C] text-white hover:bg-slate-900 px-4 py-2 rounded-full text-xs font-extrabold transition-all shadow-sm hover:shadow-md cursor-pointer">
          Get Free Quote
        </Link>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-start pt-24 pb-16">
        {/* Full-Screen Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/solar_field_hero.png"
            alt="Lush green meadow with solar panels installation under a bright sky"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark overlay gradients to protect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#09221C]/90 via-[#09221C]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09221C] via-transparent to-transparent opacity-80" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid md:grid-cols-12 gap-8 items-center mt-8 md:mt-0">
          <div className="md:col-span-8 lg:col-span-7 bg-[#09221C]/75 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-start gap-6">
            
            {/* Animated Lightning Bolt Badge & PM Surya Ghar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.5)] border border-white/10 animate-float-vertical">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#09221C] fill-[#09221C]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#F5B800]/15 text-[#F5B800] text-xs font-bold px-4 py-2 rounded-full border border-[#F5B800]/30">
                ★ PM SURYA GHAR ROOFTOP SOLAR
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight font-display">
              Power Your Home <br />
              With <span className="text-[#CCFF00] drop-shadow-[0_2px_10px_rgba(204,255,0,0.2)]">Rooftop Solar</span>
            </h1>

            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-lg font-sans">
              Get PM Surya Ghar scheme subsidy on solar installation. Trusted solar installer in Jaipur, Rajasthan. Free site survey — installation in 15–20 days.
            </p>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto mt-2">
              <a 
                href="https://wa.me/918114404945?text=Hello%20Solvanta%20Solar!%20I%20am%20interested%20in%20rooftop%20solar."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#CCFF00] hover:bg-[#b5e600] text-[#09221C] font-extrabold px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(204,255,0,0.25)] hover:shadow-[0_8px_30px_rgba(204,255,0,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-sm cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.5.992c-5.437 0-9.862 4.371-9.866 9.8.001 2.005.526 3.96 1.519 5.672L2.148 22.1l5.803-1.517zM17.21 14.62c-.287-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-1.353-.679-2.224-1.199-3.111-2.724-.236-.405-.084-.623.06-.767.13-.13.287-.336.43-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.564-.473-.488-.648-.497-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976.144.192 2.03 3.1 4.92 4.35.686.297 1.222.474 1.64.607.69.22 1.318.19 1.815.115.553-.083 1.702-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
                
                <button 
                  onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-4 rounded-xl hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-sm cursor-pointer"
                >
                  Get Free Quote
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* TRUST BAR */}
      <div className="bg-sol-navy border-t-2 border-sol-teal">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-around gap-4">
          {[["✅","PM Surya Ghar","Authorized"],["🛡","25-Year","Panel Warranty"],["★","4.9","Google Rating"],["⚡","Install in","15–20 Days"]].map(([icon,bold,rest]) => (
            <div key={bold} className="flex items-center gap-2 text-white/70 text-xs">
              <span className="text-sol-teal text-base">{icon}</span>
              <span><strong className="text-white">{bold}</strong> {rest}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 bg-sol-lt text-sol-teal text-xs font-bold px-3 py-1.5 rounded-full mb-3">☀ Our Services</span>
            <h2 className="text-3xl font-black text-sol-navy">Complete <span className="text-sol-teal">Solar Solutions</span></h2>
            <div className="w-14 h-1 bg-gradient-to-r from-sol-teal to-sol-gold rounded mx-auto mt-3" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(s => (
              <div key={s.title} className="bg-white border border-sol-sl rounded-2xl p-5 hover:shadow-lg hover:border-sol-teal hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-sol-navy mb-2">{s.title}</h3>
                <p className="text-sm text-sol-gray leading-relaxed mb-3">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sol-lt text-sol-teal">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PM SUBSIDY */}
      <section id="subsidy" className="py-16 px-6 bg-sol-navy">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-sol-teal/15 text-teal-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4">₹ Government Scheme</span>
            <h2 className="text-3xl font-black text-white mb-4">PM Surya Ghar <span className="text-sol-gold">Free Electricity Yojana</span></h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">Get up to 300 units free electricity every month. Government subsidizes solar installation cost. Solvanta Solar is an authorized installer — we handle everything.</p>
            <div className="space-y-3">
              {[["1 kWp","₹30,000","~120 units/month free","border-blue-400"],["2 kWp","₹60,000","~240 units/month free","border-sol-teal"],["3 kWp+","₹78,000","~300 units/month free","border-sol-gold"]].map(([kw,amt,units,border]) => (
                <div key={kw} className={`flex items-center justify-between bg-white/7 border ${border} rounded-xl px-4 py-3 hover:bg-white/12 transition-all`}>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{kw} System</div>
                    <div className="text-xs text-white/40 mt-0.5">{units}</div>
                  </div>
                  <div className="text-2xl font-black text-sol-gold">{amt}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Calculator */}
          <div className="bg-white rounded-2xl p-7 shadow-2xl">
            <h3 className="text-lg font-bold text-sol-navy mb-1 flex items-center gap-2">🧮 Solar Savings Calculator</h3>
            <p className="text-xs text-sol-gray mb-5">Enter your monthly electricity bill to get instant estimates</p>
            <div className="mb-4">
              <label className="text-xs font-bold text-sol-navy block mb-2">Monthly Electricity Bill (₹): <span className="text-sol-teal font-bold">₹{bill.toLocaleString("en-IN")}</span></label>
              <input type="range" min="500" max="20000" step="100" value={bill}
                onChange={e => { setBill(Number(e.target.value)); setCalcDone(true); }}
                className="w-full h-1.5 bg-sol-sl rounded-full appearance-none cursor-pointer accent-sol-teal" />
              <div className="flex justify-between text-[10px] text-sol-gray mt-1"><span>₹500</span><span>₹20,000</span></div>
            </div>
            {calcDone && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[["☀",kwp+" kWp","Recommended System","bg-sol-lt text-sol-teal"],["₹","₹"+(subsidy/1000)+"K","PM Subsidy","bg-amber-50 text-amber-700"],["💰","₹"+save.toLocaleString("en-IN"),"Monthly Savings","bg-green-50 text-green-700"],["📅",payback+" Yrs","Payback Period","bg-blue-50 text-blue-700"]].map(([icon,v,l,cls]) => (
                  <div key={l} className={`rounded-xl p-3 text-center ${cls}`}>
                    <div className="text-xl font-bold">{v}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{l}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              className="w-full mt-4 bg-sol-navy text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-950 transition-all flex items-center justify-center gap-2">
              ☀ Get Detailed Free Quote
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 px-6 bg-[#F4F7FB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white border border-sol-sl px-3 py-1.5 rounded-full text-xs font-semibold text-sol-gray mb-3">
              <span className="text-sol-gold">★★★★★</span> 4.9 on Google Reviews · 320+ reviews
            </div>
            <h2 className="text-3xl font-black text-sol-navy">Our <span className="text-sol-teal">Testimonials</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map(r => (
              <div key={r.name} className="bg-white border border-sol-sl rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="text-sol-gold text-lg mb-3">★★★★★</div>
                <p className="text-sm text-sol-gray/80 leading-relaxed italic mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sol-lt flex items-center justify-center text-sol-teal font-bold text-sm">{r.initials}</div>
                  <div>
                    <div className="text-sm font-semibold text-sol-navy">{r.name}</div>
                    <div className="text-xs text-sol-gray">{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="about" className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-sol-lt text-sol-teal text-xs font-bold px-3 py-1.5 rounded-full mb-4">🏢 Brand Partners</span>
          <h2 className="text-2xl font-black text-sol-navy mb-8">Authorized Dealer for <span className="text-sol-teal">India's Top Solar Brands</span></h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {partners.map(p => (
              <div key={p} className="border border-sol-sl rounded-xl py-3 px-2 text-center hover:border-sol-teal hover:bg-sol-lt transition-all">
                <div className="text-sm font-bold text-sol-navy">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 px-6 bg-sol-navy">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-black text-white mb-3">Contact <span className="text-sol-gold">Solvanta Solar</span></h2>
            <p className="text-white/60 text-sm mb-7">Get a free site survey, solar quotation, or just ask us anything about rooftop solar in Rajasthan.</p>
            <div className="space-y-4">
              {[["📍","Address","P.No. 1-D, Kalyan Puri, Govindpura\nNiwaru Link Road, Kalwar Road, Jaipur 302012"],["📞","Phone","+91 8114404945 | +91 8005973887 | +91 9950746563"],["✉","Email","solvantasolarhelp@gmail.com"],["🕐","Hours","Mon–Sat: 9:00 AM – 6:00 PM"]].map(([icon,title,val]) => (
                <div key={title} className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-sol-lt rounded-xl flex items-center justify-center text-sol-teal flex-shrink-0">{icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-white mb-0.5">{title}</div>
                    <div className="text-white/60 text-sm whitespace-pre-line">{val}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Associate link */}
            <div className="mt-8 p-4 bg-white/8 border border-white/15 rounded-xl">
              <p className="text-white/60 text-sm mb-2">Are you a solar associate / channel partner?</p>
              <Link href="/associate/login" className="inline-flex items-center gap-2 bg-sol-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-600 transition-all">
                → Associate Login / Register
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-sol-navy mb-1">Send an Enquiry</h3>
            <p className="text-xs text-sol-gray mb-5">We'll call you back within 2 hours during business hours.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-sol-dark border-t-2 border-sol-teal px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-white"><Image src="/logo.jpg" alt="" width={36} height={36} className="object-contain"/></div>
              <div><div className="text-white font-bold text-sm">SOLVANTA</div><div className="text-sol-teal text-[9px] tracking-widest">SOLAR ENERGY</div></div>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">Jaipur's most trusted solar energy company. PM Surya Ghar authorized installer. GST: 08APCPB7272G1Z1</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs text-white/50">
            <div><div className="text-white/80 font-semibold mb-3">Quick Links</div>
              {["Home","About Us","Services","PM Subsidy","Contact Us"].map(l => <div key={l} className="mb-2 hover:text-white cursor-pointer transition-colors">{l}</div>)}
            </div>
            <div><div className="text-white/80 font-semibold mb-3">Contact</div>
              <div className="mb-2">+91 8114404945</div>
              <div className="mb-2">+91 8005973887</div>
              <div className="mb-2">solvantasolarhelp@gmail.com</div>
            </div>
            <div><div className="text-white/80 font-semibold mb-3">Portal</div>
              <Link href="/associate/login" className="block mb-2 hover:text-white transition-colors">Associate Login</Link>
              <Link href="/associate/register" className="block mb-2 hover:text-white transition-colors">Associate Register</Link>
              <Link href="/admin" className="block mb-2 hover:text-white transition-colors">Admin Panel</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-5 border-t border-white/10 flex justify-between text-[10px] text-white/30 flex-wrap gap-2">
          <span>© 2025 Solvanta Solar Energy. All rights reserved.</span>
          <span>PM Surya Ghar Authorized</span>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/918114404945?text=Hello%20Solvanta%20Solar!%20I%20am%20interested%20in%20rooftop%20solar."
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-5 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:bg-green-600 hover:scale-110 transition-all animate-pulse">
        💬
      </a>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", mobile:"", city:"Jaipur", service:"Home Rooftop Solar" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.mobile) return;
    setSent(true);
  }
  if (sent) return (
    <div className="bg-green-50 border-l-4 border-sol-teal p-4 rounded-lg text-green-700 text-sm font-semibold">
      ✅ Thank you! We'll call you back within 2 hours.
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold text-sol-navy block mb-1">Full Name *</label>
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ramesh Kumar"
            className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
        <div><label className="text-xs font-semibold text-sol-navy block mb-1">Mobile *</label>
          <input required value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} placeholder="+91 XXXXX XXXXX"
            className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
      </div>
      <div><label className="text-xs font-semibold text-sol-navy block mb-1">City</label>
        <select value={form.city} onChange={e=>setForm({...form,city:e.target.value})}
          className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
          {["Jaipur","Jodhpur","Ajmer","Kota","Bikaner","Alwar","Other"].map(c=><option key={c}>{c}</option>)}
        </select></div>
      <div><label className="text-xs font-semibold text-sol-navy block mb-1">Service Required</label>
        <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}
          className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
          {["Home Rooftop Solar","Commercial/Industrial","Battery Storage","AMC/Maintenance","PM Surya Ghar Query"].map(s=><option key={s}>{s}</option>)}
        </select></div>
      <button type="submit" className="w-full bg-sol-navy text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-950 transition-all">
        ➤ Send Enquiry — Get Free Quote
      </button>
    </form>
  );
}
