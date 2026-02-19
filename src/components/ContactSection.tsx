'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, FileText } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

export const ContactSection = () => {
  return (
    <section className="py-12 md:py-20 bg-cream" id="kontakt">
      <div className="container mx-auto px-6">

        {/* Section Header — CTA */}
        <motion.div
          id="kontaktny-formular"
          className="text-center mb-16 md:mb-20 scroll-mt-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4">
            Napíšte nám
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy leading-tight mb-6">
            Neváhajte nás <span className="text-accent-red italic">kontaktovať</span>
          </h2>
          <p className="text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Či už predávate nehnuteľnosť, hľadáte nový domov alebo len premýšľate o ďalšom kroku, sme tu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">


          {/* Left: Contact Info — this column is tall and scrolls normally */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Contact Cards */}
            <motion.div
              className="space-y-6 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <ContactCard
                icon={MapPin}
                title="Navštívte nás"
                content={<>Námestie Slobody 1185/30<br />926 01 Sereď</>}
              />
              <ContactCard
                icon={Phone}
                title="Zavolajte nám"
                content={
                  <a href="tel:+421905447220" className="hover:text-accent-red transition-colors">
                    0905 447 220
                  </a>
                }
              />
              <ContactCard
                icon={Mail}
                title="Napíšte nám"
                content={
                  <a href="mailto:info@frisco.sk" className="hover:text-accent-red transition-colors">
                    info@frisco.sk
                  </a>
                }
              />
              <ContactCard
                icon={Clock}
                title="Pracovná doba"
                content={
                  <>
                    <span className="font-bold">Po - Pi:</span> 9:00 - 17:00<br />
                    <span className="font-bold">So - Ne:</span> Zatvorené
                  </>
                }
              />
              <ContactCard
                icon={FileText}
                title="Fakturačné údaje"
                content={
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-navy">FRISCO, s.r.o.</p>
                    <p>IČO: 43 850 553</p>
                    <p>DIČ: 2022486895</p>
                    <p className="text-[10px] text-charcoal/50 leading-tight mt-2">
                      Zapísaná v Obchodnom registri Okresného súdu Trnava, Oddiel: Sro, Vložka číslo: 21013/T
                    </p>
                  </div>
                }
              />
            </motion.div>

            {/* Social Links */}
            <div className="pt-8 border-t border-navy/10">
              <h4 className="text-charcoal/50 uppercase tracking-widest text-xs mb-6">Sledujte nás</h4>
              <div className="flex gap-4">
                <SocialLink icon={Instagram} label="Instagram" href="https://www.instagram.com/friscoreality/" />
                <SocialLink icon={Facebook} label="Facebook" href="https://www.facebook.com/Friscorealitka/" />
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-12 relative rounded-2xl overflow-hidden border border-navy/10 h-[400px] shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.85566300157!2d17.737541377024726!3d48.28639262126042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b67bf84ae3c39%3A0xaabf0d6bfbcef097!2sFRISCO%2C%20s.r.o.%20-%20realitn%C3%A1%20kancel%C3%A1ria!5e0!3m2!1ssk!2ssk!4v1768663122983!5m2!1ssk!2ssk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>

          {/* Right: Contact Form — sticky so it locks in place */}
          <div className="lg:sticky lg:top-28 self-start">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper Components
const ContactCard = ({ icon: Icon, title, content }: { icon: any; title: string; content: React.ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    }}
    className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-navy/10 hover:border-navy/20 transition-colors shadow-sm"
  >
    <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-navy" />
    </div>
    <div>
      <h4 className="text-charcoal/50 uppercase tracking-widest text-[10px] mb-2">{title}</h4>
      <div className="text-charcoal font-sans text-lg">{content}</div>
    </div>
  </motion.div>
);

const SocialLink = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
  <a
    href={href}
    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-navy/10 hover:border-navy/30 hover:bg-navy/5 transition-all"
  >
    <Icon className="w-4 h-4 text-charcoal/60 group-hover:text-navy transition-colors" />
    <span className="text-sm text-charcoal/60 group-hover:text-navy transition-colors">{label}</span>
  </a>
);
