
import React, { useState } from 'react';
import { CVData } from '../types';

interface SyncHelperProps {
  data: CVData;
}

const SyncHelper: React.FC<SyncHelperProps> = ({ data }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyCard: React.FC<{ text: string; fieldId: string; label: string; icon?: string }> = ({ text, fieldId, label, icon }) => (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center">
            {icon && <i className={`${icon} mr-1.5`}></i>} {label}
          </p>
          <p className="text-gray-800 text-sm font-medium line-clamp-3 leading-relaxed">
            {text || <span className="text-gray-300 italic">No data found</span>}
          </p>
        </div>
        <button
          onClick={() => copyToClipboard(text, fieldId)}
          disabled={!text}
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            !text ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
            copiedField === fieldId ? 'bg-green-500 text-white shadow-green-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
          }`}
        >
          <i className={`fa-solid ${copiedField === fieldId ? 'fa-check' : 'fa-copy'}`}></i>
        </button>
      </div>
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
      <div className="grid gap-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-400/20 text-blue-100 text-xs font-bold mb-4 border border-blue-400/30">
            <i className="fa-solid fa-rocket mr-2"></i> READY TO SYNC
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Your LinkedIn Booster is Ready</h1>
          <p className="text-blue-100 text-lg leading-relaxed opacity-90">
            We've mapped your CV to LinkedIn sections. Open your profile in a new tab and use the copy buttons below to fill each section accurately.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="https://www.linkedin.com/in/me/edit/topcard/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center shadow-lg hover:-translate-y-0.5"
            >
              Open LinkedIn Profile <i className="fa-solid fa-external-link text-xs ml-2"></i>
            </a>
          </div>
        </div>
        <div className="absolute top-1/2 right-[-50px] -translate-y-1/2 opacity-10 pointer-events-none">
          <i className="fa-brands fa-linkedin text-[300px]"></i>
        </div>
      </header>

      <div className="space-y-12">
        {/* Core Profile */}
        <SectionGroup title="Core Information" icon="fa-user-tie">
          <CopyCard text={data.name} fieldId="n" label="Full Name" />
          <CopyCard text={data.headline} fieldId="h" label="Headline" />
          <CopyCard text={data.about} fieldId="a" label="About / Summary" />
          <CopyCard text={data.skills.join(', ')} fieldId="s" label="Skills (Batch List)" />
        </SectionGroup>

        {/* Experience & Education */}
        <SectionGroup title="Experience & Education" icon="fa-graduation-cap">
          {data.experience.slice(0, 4).map((exp, i) => (
            <CopyCard 
              key={`exp-${i}`} 
              text={`${exp.title} | ${exp.company}\n\n${exp.description}`} 
              fieldId={`exp-${i}`} 
              label={`Job: ${exp.title}`} 
              icon="fa-briefcase"
            />
          ))}
          {data.education.map((edu, i) => (
            <CopyCard 
              key={`edu-${i}`} 
              text={`${edu.degree} in ${edu.fieldOfStudy}\n${edu.school}`} 
              fieldId={`edu-${i}`} 
              label="Education" 
              icon="fa-university"
            />
          ))}
        </SectionGroup>

        {/* Projects & Publications */}
        <SectionGroup title="Projects & Publications" icon="fa-book-open">
          {data.projects.slice(0, 3).map((p, i) => (
            <CopyCard 
              key={`proj-${i}`} 
              text={`${p.name}\n\n${p.description}`} 
              fieldId={`proj-${i}`} 
              label={`Project: ${p.name}`} 
              icon="fa-diagram-project" 
            />
          ))}
          {data.publications.slice(0, 3).map((pub, i) => (
            <CopyCard 
              key={`pub-${i}`} 
              text={`${pub.title}\n${pub.publisher} | ${pub.publicationDate}\n\n${pub.description}`} 
              fieldId={`pub-${i}`} 
              label={`Pub: ${pub.title}`} 
              icon="fa-file-lines" 
            />
          ))}
        </SectionGroup>

        {/* Additional Sections */}
        <SectionGroup title="Additional Highlights" icon="fa-award">
          {data.certifications.slice(0, 2).map((c, i) => (
            <CopyCard key={`c-${i}`} text={c.name} fieldId={`c-${i}`} label="Certification" icon="fa-certificate" />
          ))}
          {data.volunteer.slice(0, 2).map((v, i) => (
            <CopyCard key={`v-${i}`} text={`${v.role} at ${v.organization}`} fieldId={`v-${i}`} label="Volunteer" icon="fa-heart" />
          ))}
          {data.languages.length > 0 && (
            <CopyCard text={data.languages.join(', ')} fieldId="lang" label="Languages" icon="fa-language" />
          )}
          {data.awards.slice(0, 2).map((a, i) => (
            <CopyCard key={`a-${i}`} text={a.title} fieldId={`a-${i}`} label="Award/Honor" icon="fa-trophy" />
          ))}
        </SectionGroup>
      </div>

      <div className="bg-gray-100 p-8 rounded-2xl text-center border-2 border-dashed border-gray-200">
        <h4 className="font-bold text-gray-700 mb-2">Pro Tip: Form Filling</h4>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          LinkedIn often has separate fields for "Start Date" and "End Date". We've grouped some info to make it easier to read, but you can copy individual parts from the Review screen if needed.
        </p>
      </div>
    </div>
  );
};

export default SyncHelper;
