import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive?: boolean;
}

export interface BreadcrumbsNavProps {
  items?: BreadcrumbItem[];
  currentSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({
  items,
  currentSection = 'Home',
  onSelectSection
}) => {
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', url: 'https://app.tourcartbd.com/' },
    { label: 'Southeast Bangladesh Tours', url: 'https://app.tourcartbd.com/#builder' },
    { label: currentSection, url: `https://app.tourcartbd.com/#${currentSection.toLowerCase().replace(/\s+/g, '-')}`, isActive: true }
  ];

  const breadcrumbsList = items || defaultItems;

  // Schema.org BreadcrumbList payload
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url
    }))
  };

  return (
    <nav aria-label="Breadcrumb Navigation" className="w-full bg-[#E8F4F2]/60 border-b border-[#1A7C6E]/15 py-2.5 px-4 md:px-12 text-xs font-semibold">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5 text-gray-600">
        <a
          href="/"
          onClick={(e) => {
            if (onSelectSection) {
              e.preventDefault();
              onSelectSection('hero');
            }
          }}
          className="inline-flex items-center gap-1 text-[#1A7C6E] hover:text-[#E85D3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A7C6E] rounded px-1"
          aria-label="Go to Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </a>

        {breadcrumbsList.slice(1).map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            {crumb.isActive ? (
              <span className="font-bold text-[#111827] bg-white px-2 py-0.5 rounded border border-gray-200" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.url}
                className="text-gray-600 hover:text-[#1A7C6E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A7C6E] rounded px-1"
              >
                {crumb.label}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};
