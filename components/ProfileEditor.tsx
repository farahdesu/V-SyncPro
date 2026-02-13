
import React, { useState } from 'react';
import { CVData } from '../types';

interface ProfileEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  onConfirm: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ data, onChange, onConfirm }) => {
  const [activeTab, setActiveTab] = useState<'core' | 'rec' | 'add'>('core');

  const updateField = (field: keyof CVData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const SectionTitle = ({ title, icon }: { title: string; icon: string }) => (
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-2">
      <i className={`${icon} text-blue-600 mr-2 w-5 text-center`}></i> {title}
    </h3>
  );

  const InputGroup = ({ label, children }: { label: string; children?: React.ReactNode }) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex mb-6">
        {[
          { id: 'core', label: 'Core Info', icon: 'fa-user' },
          { id: 'rec', label: 'Recommended', icon: 'fa-star' },
          { id: 'add', label: 'Additional', icon: 'fa-plus-circle' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-sm font-semibold transition-all flex items-center justify-center border-b-2 ${
              activeTab === tab.id ? 'text-blue-600 border-blue-600 bg-blue-50/50' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-2`}></i> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'core' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <SectionTitle title="Basic Information" icon="fa-id-card" />
            <div className="grid md:grid-cols-2 gap-4">
              <InputGroup label="Full Name">
                <input value={data.name} onChange={(e) => updateField('name', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </InputGroup>
              <InputGroup label="Headline">
                <input value={data.headline} onChange={(e) => updateField('headline', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </InputGroup>
            </div>
            <InputGroup label="Summary (About)">
              <textarea value={data.about} onChange={(e) => updateField('about', e.target.value)} className="w-full p-2.5 h-32 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </InputGroup>
          </div>

          <div>
            <SectionTitle title="Experience" icon="fa-briefcase" />
            {data.experience.map((exp, i) => (
              <div key={i} className="p-4 mb-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input value={exp.title} placeholder="Title" className="p-2 border rounded" onChange={(e) => {
                    const next = [...data.experience]; next[i].title = e.target.value; updateField('experience', next);
                  }} />
                  <input value={exp.company} placeholder="Company" className="p-2 border rounded" onChange={(e) => {
                    const next = [...data.experience]; next[i].company = e.target.value; updateField('experience', next);
                  }} />
                </div>
                <textarea value={exp.description} className="w-full p-2 border rounded text-sm h-24" onChange={(e) => {
                  const next = [...data.experience]; next[i].description = e.target.value; updateField('experience', next);
                }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rec' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <SectionTitle title="Education" icon="fa-graduation-cap" />
            {data.education.map((edu, i) => (
              <div key={i} className="p-4 mb-4 bg-gray-50 rounded-lg border border-gray-100 grid grid-cols-2 gap-3">
                <input value={edu.school} placeholder="School" className="p-2 border rounded" />
                <input value={edu.degree} placeholder="Degree" className="p-2 border rounded" />
              </div>
            ))}
          </div>
          <div>
            <SectionTitle title="Skills" icon="fa-bolt" />
            <textarea 
              value={data.skills.join(', ')} 
              onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
              className="w-full p-3 border rounded-lg h-24 font-mono text-sm"
            />
          </div>
          <div>
            <SectionTitle title="Certifications" icon="fa-certificate" />
            {data.certifications.length === 0 && <p className="text-gray-400 text-sm italic">No certifications detected.</p>}
            {data.certifications.map((cert, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={cert.name} className="flex-1 p-2 border rounded text-sm" />
                <input value={cert.issuingOrganization} className="flex-1 p-2 border rounded text-sm" />
              </div>
            ))}
          </div>
          <div>
            <SectionTitle title="Projects" icon="fa-diagram-project" />
            {data.projects.length === 0 && <p className="text-gray-400 text-sm italic">No projects detected.</p>}
            {data.projects.map((proj, i) => (
              <div key={i} className="p-4 mb-2 bg-gray-50 rounded-lg border border-gray-100">
                <input value={proj.name} className="w-full p-2 mb-2 border rounded text-sm font-bold" />
                <textarea value={proj.description} className="w-full p-2 border rounded text-sm h-16" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <SectionTitle title="Publications" icon="fa-book-open" />
              {data.publications.length === 0 && <p className="text-gray-400 text-sm italic">No publications detected.</p>}
              {data.publications.map((pub, i) => (
                <div key={i} className="p-3 mb-2 bg-gray-50 border rounded-lg">
                  <p className="text-sm font-bold">{pub.title}</p>
                  <p className="text-xs text-gray-500">{pub.publisher} ({pub.publicationDate})</p>
                </div>
              ))}
            </div>
            <div>
              <SectionTitle title="Languages" icon="fa-language" />
              <input value={data.languages.join(', ')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <SectionTitle title="Volunteer" icon="fa-hand-holding-heart" />
              {data.volunteer.map((v, i) => <div key={i} className="text-sm p-2 bg-gray-50 mb-1 border rounded">{v.role} at {v.organization}</div>)}
            </div>
            <div>
              <SectionTitle title="Awards" icon="fa-trophy" />
              {data.awards.map((a, i) => <div key={i} className="text-sm p-2 bg-gray-50 mb-1 border rounded">{a.title}</div>)}
            </div>
            <div>
              <SectionTitle title="Patents" icon="fa-lightbulb" />
              {data.patents.length === 0 && <p className="text-gray-400 text-sm italic">No patents detected.</p>}
              {data.patents.map((p, i) => <div key={i} className="text-sm p-2 bg-gray-50 mb-1 border rounded">{p.title} ({p.number})</div>)}
            </div>
            <div>
              <SectionTitle title="Test Scores" icon="fa-file-signature" />
              <input value={data.testScores.join(', ')} className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex justify-center z-40">
        <button
          onClick={onConfirm}
          className="bg-blue-600 text-white px-12 py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center"
        >
          Finalize Sync Guide <i className="fa-solid fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default ProfileEditor;
