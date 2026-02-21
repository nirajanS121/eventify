import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Instagram, Youtube, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { contentAPI } from '../../services/api';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteInfo, setSiteInfo] = useState({ address: '', email: '', phone: '', social: {} });

  useEffect(() => {
    contentAPI.getSiteInfo().then(setSiteInfo).catch(() => {});
  }, []);

  return (
    <footer className="relative bg-dark-950 border-t border-white/5">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-ice-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl gradient-mixed flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Forge<span className="gradient-text-mixed">&</span>Flow</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 -mt-0.5">Wellness Collective</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Where cold meets courage, movement meets mindfulness, and strangers become tribe. Your journey to extraordinary wellness starts here.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: siteInfo.social?.instagram || '#' },
                { icon: Youtube, href: siteInfo.social?.youtube || '#' },
                { icon: Twitter, href: siteInfo.social?.twitter || '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-ice-400 hover:bg-ice-500/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Events', path: '/events' },
                { label: 'Ice Bath Sessions', path: '/events?type=ICE_BATH' },
                { label: 'Fitness Classes', path: '/events?type=FITNESS' },
                { label: 'Yoga & Breathwork', path: '/events?type=YOGA' },
                { label: 'Community Events', path: '/events?type=SOCIAL' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-ice-300 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', path: '/#about' },
                { label: 'Our Team', path: '/#about' },
                { label: 'Gallery', path: '/#gallery' },
                { label: 'Testimonials', path: '/#testimonials' },
                { label: 'Contact', path: '/#contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-ice-300 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-ice-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">{siteInfo.address || '—'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-ice-400 shrink-0" />
                <span className="text-sm text-slate-400">{siteInfo.phone || '—'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-ice-400 shrink-0" />
                <span className="text-sm text-slate-400">{siteInfo.email || '—'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} Forge & Flow Wellness Collective. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
