
import React, { useState } from 'react';
import { CVData } from '../types';

interface SyncHelperProps {
  data: CVData;
}

const LINKEDIN_SECTIONS = {
  INTRO: "https://www.linkedin.com/in/me/edit/topcard/",
  ABOUT: "https://www.linkedin.com/in/me/edit/about/",
  EXPERIENCE: "https://www.linkedin.com/in/me/details/experience/",
  EDUCATION: "https://www.linkedin.com/in/me/details/education/",
  SKILLS: "https://www.linkedin.com/in/me/details/skills/",
  PROJECTS: "https://www.linkedin.com/in/me/details/projects/",
  PUBLICATIONS: "https://www.linkedin.com/in/me/details/publications/"
};

const SyncHelper: React.FC<SyncHelperProps> = ({ data }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyCard: React.FC<{ text: string; fieldId: string; label: string; icon?: string; link?: string }> = ({ text, fieldId, label, icon, link }) => (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
            {icon && <i className={`${icon} mr-1.5`}></i>} {label}
          </p>
          <p className="text-gray-800 text-sm font-medium line-clamp-2 leading-tight">
            {text || <span className="text-gray-300 italic">No data found</span>}
          </p>
        </div>
        <button
          onClick={() => copyToClipboard(text, fieldId)}
          disabled={!text}
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            !text ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
            copiedField === fieldId ? 'bg-green-500 text-white shadow-green-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
          }`}
          title="Copy to clipboard"
        >
          <i className={`fa-solid ${copiedField === fieldId ? 'fa-check text-xs' : 'fa-copy text-xs'}`}></i>
        </button>
      </div>
      {link && text && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-blue-600 font-bold hover:underline mt-auto flex items-center"
        >
          Open Section <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[8px]"></i>
        </a>
      )}
    </div>
  );

  const SectionGroup = ({ title, children, icon }: { title: string; children?: React.ReactNode; icon: string }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 px-1">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <i className={`${icon} text-blue-600 text-sm`}></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-100 text-[10px] font-bold mb-3 border border-blue-400/30 uppercase tracking-tighter">
            <i className="fa-solid fa-rocket mr-1"></i> Extension Mode Active
          </div>
          <h1 className="text-2xl font-bold mb-2">Sync Your Profile</h1>
          <p className="text-blue-100 text-sm opacity-90 max-w-lg">
            Use the buttons below to copy data. Each card includes a direct link to the relevant LinkedIn section for a frictionless experience.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href="https://www.linkedin.com/in/me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all flex items-center shadow-lg"
            >
              Go to Profile <i className="fa-solid fa-external-link text-xs ml-2"></i>
            </a>
          </div>
        </div>
        <div className="absolute top-1/2 right-[-30px] -translate-y-1/2 opacity-10 pointer-events-none">
          <i className="fa-brands fa-linkedin text-[200px]"></i>
        </div>
      </header>

      <div className="space-y-10">
        <SectionGroup title="Identity & Summary" icon="fa-user-tie">
          <CopyCard text={data.name} fieldId="n" label="Full Name" link={LINKEDIN_SECTIONS.INTRO} />
          <CopyCard text={data.headline} fieldId="h" label="Headline" link={LINKEDIN_SECTIONS.INTRO} />
          <CopyCard text={data.about} fieldId="a" label="About / Summary" link={LINKEDIN_SECTIONS.ABOUT} />
          <CopyCard text={data.skills.join(', ')} fieldId="s" label="Skills Batch" link={LINKEDIN_SECTIONS.SKILLS} />
        </SectionGroup>

        <SectionGroup title="Career History" icon="fa-briefcase">
          {data.experience.slice(0, 3).map((exp, i) => (
            <CopyCard 
              key={`exp-${i}`} 
              text={`${exp.title} at ${exp.company}\n\n${exp.description}`} 
              fieldId={`exp-${i}`} 
              label={`Role: ${exp.title}`} 
              icon="fa-building"
              link={LINKEDIN_SECTIONS.EXPERIENCE}
            />
          ))}
          {data.education.slice(0, 1).map((edu, i) => (
            <CopyCard 
              key={`edu-${i}`} 
              text={`${edu.degree} in ${edu.fieldOfStudy}\n${edu.school}`} 
              fieldId={`edu-${i}`} 
              label="Latest Education" 
              icon="fa-university"
              link={LINKEDIN_SECTIONS.EDUCATION}
            />
          ))}
        </SectionGroup>

        <SectionGroup title="Impact & Projects" icon="fa-diagram-project">
          {data.projects.slice(0, 2).map((p, i) => (
            <CopyCard 
              key={`proj-${i}`} 
              text={`${p.name}\n\n${p.description}`} 
              fieldId={`proj-${i}`} 
              label={`Project: ${p.name}`} 
              icon="fa-flask" 
              link={LINKEDIN_SECTIONS.PROJECTS}
            />
          ))}
          {data.publications.slice(0, 2).map((pub, i) => (
            <CopyCard 
              key={`pub-${i}`} 
              text={`${pub.title}\n${pub.publisher} | ${pub.publicationDate}\n\n${pub.description}`} 
              fieldId={`pub-${i}`} 
              label={`Publication: ${pub.title}`} 
              icon="fa-file-lines" 
              link={LINKEDIN_SECTIONS.PUBLICATIONS}
            />
          ))}
        </SectionGroup>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start space-x-4">
        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <i className="fa-solid fa-lightbulb"></i>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-1">Power User Tip</h4>
          <p className="text-gray-600 text-xs leading-relaxed">
            LinkedIn's new profile editor allows you to click "Open Section" links above to jump directly to the edit modal. No more digging through settings!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SyncHelper;
