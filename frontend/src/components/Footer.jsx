import React from 'react';

export default function Footer() {
  const footerLinks = [
    ['FAQ', 'Investor Relations', 'Privacy', 'Speed Test'],
    ['Help Centre', 'Jobs', 'Cookie Preferences', 'Legal Notices'],
    ['Account', 'Ways to Watch', 'Corporate Information', 'Only on Netflix'],
    ['Media Centre', 'Terms of Use', 'Contact Us']
  ];

  return (
    <footer className="bg-[#141414] border-t border-zinc-800/80 py-12 px-4 md:px-12 text-zinc-500 text-xs max-w-6xl mx-auto w-full select-none">
      <p className="mb-6 hover:underline cursor-pointer">
        Questions? Call <span className="underline">000-800-919-1694</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {footerLinks.map((col, idx) => (
          <ul key={idx} className="space-y-3">
            {col.map((link) => (
              <li key={link}>
                <a href="#" className="hover:underline hover:text-zinc-400 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="mb-6">
        <button className="border border-zinc-600 hover:text-white px-3 py-1.5 rounded-xs transition-colors">
          Service Code
        </button>
      </div>

      <p className="text-[11px] text-zinc-600">
        © 1997-2026 Netflix, Inc. All rights reserved.
      </p>
    </footer>
  );
}
