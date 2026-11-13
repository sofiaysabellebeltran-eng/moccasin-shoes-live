import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 px-6 mt-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest mb-4">Moccasin PH</h3>
          <p className="text-sm text-white/60 mb-4">Wear your journey.</p>
          <p className="text-sm text-white/60">© 2026 Moccasin-PH Ventures Corporation.</p>
        </div>

        {/* Contact Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <a href="mailto:moccasin.info@theljrgroup.com" className="hover:text-white flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                moccasin.info@theljrgroup.com
              </a>
            </li>
            <li>
              <a href="tel:09763791569" className="hover:text-white flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                0976 379 1569
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560266840550" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-[#1877F2] transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
            </a>
            <a href="https://instagram.com/moccasin.mindanao" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-[#E1306C] transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
            </a>
            <a href="https://tiktok.com/@moccasin.mindanao" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-black transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
