import React, { useState, useEffect } from 'react';
import { StudyStep, StudySession, STEP_DESCRIPTIONS, BRI } from '../types';
import Assistant from './Assistant';
import { suggestParagraphTitle, suggestThemes, suggestBRI } from '../services/geminiService';
import { Eye, BookOpen, Heart, Layout as LayoutIcon, Wand2, Volume2, Download } from 'lucide-react';

interface StudyWorkspaceProps {
  session: StudySession;
  onSave: (session: StudySession) => void;
}

const StudyWorkspace: React.FC<StudyWorkspaceProps> = ({ session: initialSession, onSave }) => {
  const [session, setSession] = useState<StudySession>(initialSession);
  const [activeTab, setActiveTab] = useState<StudyStep>(initialSession.currentStep);
  const [aiError, setAiError] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    onSave(session);
  }, [session, onSave]);

  const updateList = (field: 'observations' | 'interpretations' | 'applications', index: number, value: string) => {
    const newList = [...session[field]];
    newList[index] = value;
    setSession({ ...session, [field]: newList });
  };

  const addToList = (field: 'observations' | 'interpretations' | 'applications') => {
    setSession({ ...session, [field]: [...session[field], ''] });
  };

  const removeFromList = (field: 'observations' | 'interpretations' | 'applications', index: number) => {
    const newList = [...session[field]];
    newList.splice(index, 1);
    setSession({ ...session, [field]: newList });
  };

  const handleSuggestTitle = async () => {
    try {
      setAiError('');
      const title = await suggestParagraphTitle(session.passage);
      setSession(prev => ({ ...prev, chartNotes: prev.chartNotes ? `${prev.chartNotes}\n\nSuggested Paragraph Title: ${title}` : `Suggested Paragraph Title: ${title}` }));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Could not suggest a paragraph title.');
    }
  };

  const handleSuggestThemes = async () => {
    try {
      setAiError('');
      const themes = await suggestThemes(session.observations, session.interpretations, session.passage);
      setSession(prev => ({
        ...prev,
        chartNotes: prev.chartNotes ? `${prev.chartNotes}\n\n--- Themes Analysis ---\n${themes}` : `--- Themes Analysis ---\n${themes}`
      }));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Could not identify themes.');
    }
  };

  const handleSuggestBRI = async () => {
    try {
      setAiError('');
      const bri = await suggestBRI(session.passage);
      setSession(prev => ({ ...prev, bri: { ...prev.bri, ...bri } }));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Could not suggest background information.');
    }
  };

  const updateBRI = (field: keyof BRI, value: string) => {
    setSession(prev => ({ ...prev, bri: { ...prev.bri, [field]: value } }));
  };

  const handleSelectStep = (step: StudyStep) => {
    setActiveTab(step);
    setSession(prev => ({ ...prev, currentStep: step }));
  };

  const exportStudy = () => {
    const list = (items: string[]) => items.filter(item => item.trim()).map(item => `- ${item}`).join('\n') || '- (none)';
    const content = [
      `# ${session.title || 'Untitled Study'}`,
      '',
      `Created: ${new Date(session.createdAt).toLocaleDateString()}`,
      '',
      '## Scripture passage',
      session.passage || '(none)',
      '',
      '## Observation',
      list(session.observations),
      '',
      '## Interpretation',
      `- Author: ${session.bri.author || '(not recorded)'}`,
      `- Date: ${session.bri.date || '(not recorded)'}`,
      `- Audience: ${session.bri.audience || '(not recorded)'}`,
      `- Location: ${session.bri.location || '(not recorded)'}`,
      '',
      list(session.interpretations),
      '',
      '## Application',
      list(session.applications),
      '',
      '## Charting notes',
      session.chartNotes || '(none)',
      ''
    ].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(session.title || 'bible-study').replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').trim() || 'bible-study'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabColors: Record<StudyStep, string> = {
    [StudyStep.OBSERVATION]: 'border-blue-500 text-blue-700 bg-blue-50/30',
    [StudyStep.INTERPRETATION]: 'border-amber-500 text-amber-700 bg-amber-50/30',
    [StudyStep.APPLICATION]: 'border-green-500 text-green-700 bg-green-50/30',
    [StudyStep.CHARTING]: 'border-purple-500 text-purple-700 bg-purple-50/30'
  };

  const renderContent = () => {
    switch (activeTab) {
      case StudyStep.OBSERVATION:
        return (
          <div className="space-y-6">
            {session.observations.length === 0 && (
                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mt-1">
                            <Volume2 size={20} />
                        </div>
                        <div>
                             <h4 className="font-bold text-indigo-900 text-base mb-1">
                                Step 1: First Reading
                            </h4>
                            <p className="text-sm text-indigo-800 mb-3 leading-relaxed">
                                According to the IBS method, start by reading the <strong>entire passage out loud</strong> in one sitting.
                                As you read, look for the big picture and <strong>identify repeated words or phrases</strong>.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                <li className="bg-white/50 px-3 py-2 rounded border border-indigo-100 text-indigo-900">
                                    <strong>Main Idea</strong>
                                    <span className="block text-xs text-indigo-700 mt-1">What is it about?</span>
                                </li>
                                <li className="bg-white/50 px-3 py-2 rounded border border-indigo-100 text-indigo-900">
                                    <strong>Reason Written</strong>
                                    <span className="block text-xs text-indigo-700 mt-1">Why was it written?</span>
                                </li>
                                <li className="bg-white/50 px-3 py-2 rounded border border-indigo-100 text-indigo-900">
                                    <strong>Atmosphere</strong>
                                    <span className="block text-xs text-indigo-700 mt-1">What is the mood?</span>
                                </li>
                                <li className="bg-white/50 px-3 py-2 rounded border border-indigo-100 text-indigo-900">
                                    <strong>Repetition</strong>
                                    <span className="block text-xs text-indigo-700 mt-1">Repeated words/ideas?</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                <Eye size={16} /> Observation Guide
              </h4>
              <p className="text-sm text-blue-800">
                Look for: Repeated words, contrasts ("but", "however"), lists, cause & effect ("therefore").
                <br/>
                <strong>Rule:</strong> Do not ask "Why?" yet.
              </p>
            </div>
            
            <div className="space-y-4">
              {session.observations.map((obs, idx) => (
                <div key={idx} className="flex gap-2">
                   <div className="mt-2 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                   <textarea
                    value={obs}
                    onChange={(e) => updateList('observations', idx, e.target.value)}
                    placeholder="E.g., The word 'faith' is repeated 3 times in verses 1-5..."
                    className="w-full p-3 rounded-md border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
                    rows={2}
                   />
                   <button onClick={() => removeFromList('observations', idx)} className="text-slate-400 hover:text-red-500 self-start mt-2">×</button>
                </div>
              ))}
              <button
                onClick={() => addToList('observations')}
                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                + Add Observation
              </button>
            </div>
          </div>
        );

      case StudyStep.INTERPRETATION:
        return (
          <div className="space-y-6">
             <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                <BookOpen size={16} /> Interpretation Guide
              </h4>
              <p className="text-sm text-amber-800">
                What did it mean to the <strong>Original Audience</strong>? consider Historical Background (BRI).
                Now you can ask "Why did the author write this?".
              </p>
            </div>

            {/* BRI Section */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                        Basic Required Information (BRI)
                    </h4>
                    <button 
                        onClick={handleSuggestBRI} 
                        className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full hover:bg-amber-200 flex items-center gap-1 font-medium transition-colors"
                    >
                        <Wand2 size={12}/> Auto-fill with AI
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Author</label>
                        <input 
                            value={session.bri?.author || ''} 
                            onChange={e => updateBRI('author', e.target.value)}
                            placeholder="Who wrote this book?"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Date</label>
                        <input 
                            value={session.bri?.date || ''} 
                            onChange={e => updateBRI('date', e.target.value)}
                            placeholder="Approx. date written"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Audience</label>
                        <input 
                            value={session.bri?.audience || ''} 
                            onChange={e => updateBRI('audience', e.target.value)}
                            placeholder="To whom was it written?"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Location</label>
                        <input 
                            value={session.bri?.location || ''} 
                            onChange={e => updateBRI('location', e.target.value)}
                            placeholder="Where was it written from?"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide pt-2">Interpretation Notes</h4>
              {session.interpretations.map((int, idx) => (
                <div key={idx} className="flex gap-2">
                   <div className="mt-2 w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                   <textarea
                    value={int}
                    onChange={(e) => updateList('interpretations', idx, e.target.value)}
                    placeholder="E.g., Paul emphasizes grace here because the Galatians were returning to legalism..."
                    className="w-full p-3 rounded-md border border-slate-200 focus:ring-2 focus:ring-amber-100 focus:border-amber-400 outline-none resize-none"
                    rows={3}
                   />
                   <button onClick={() => removeFromList('interpretations', idx)} className="text-slate-400 hover:text-red-500 self-start mt-2">×</button>
                </div>
              ))}
              <button
                onClick={() => addToList('interpretations')}
                className="text-sm text-amber-600 font-medium hover:underline flex items-center gap-1"
              >
                + Add Interpretation
              </button>
            </div>
          </div>
        );

      case StudyStep.APPLICATION:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-900 mb-1 flex items-center gap-2">
                <Heart size={16} /> Application Guide
              </h4>
              <p className="text-sm text-green-800">
                Identify <strong>Timeless Truths</strong>. Apply to the 7 Spheres (Family, Gov, Business, etc).
                Ensure it is: Personal, Practical, Probable, Provable.
              </p>
            </div>
             <div className="space-y-4">
              {session.applications.map((app, idx) => (
                <div key={idx} className="flex gap-2">
                   <div className="mt-2 w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                   <textarea
                    value={app}
                    onChange={(e) => updateList('applications', idx, e.target.value)}
                    placeholder="Timeless Truth: God values obedience over sacrifice. Personal App: I will stop volunteering out of guilt..."
                    className="w-full p-3 rounded-md border border-slate-200 focus:ring-2 focus:ring-green-100 focus:border-green-400 outline-none resize-none"
                    rows={3}
                   />
                   <button onClick={() => removeFromList('applications', idx)} className="text-slate-400 hover:text-red-500 self-start mt-2">×</button>
                </div>
              ))}
              <button
                onClick={() => addToList('applications')}
                className="text-sm text-green-600 font-medium hover:underline flex items-center gap-1"
              >
                + Add Application
              </button>
            </div>
          </div>
        );

      case StudyStep.CHARTING:
        return (
          <div className="space-y-6 h-full flex flex-col">
             <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-1 flex items-center gap-2">
                <LayoutIcon size={16} /> Charting & Structure
              </h4>
              <p className="text-sm text-purple-800">
                Create Paragraph Titles (max 4 words from text). Identify segments. Trace themes.
              </p>
            </div>
            <div className="flex gap-2 mb-2 flex-wrap">
                 <button 
                    onClick={handleSuggestTitle}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 flex items-center gap-1"
                 >
                    <Wand2 size={12}/> Suggest Paragraph Title
                 </button>
                 <button 
                    onClick={handleSuggestThemes}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 flex items-center gap-1"
                 >
                    <Wand2 size={12}/> Identify Themes
                 </button>
            </div>
            <textarea
              value={session.chartNotes}
              onChange={(e) => setSession({...session, chartNotes: e.target.value})}
              placeholder="Paragraph 1 Title: ...&#10;Paragraph 2 Title: ...&#10;Segment Theme: ..."
              className="flex-1 w-full p-4 rounded-md border border-slate-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none resize-none font-mono text-sm"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Study Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="min-w-0 flex-1">
            <input
              aria-label="Study title"
              value={session.title}
              onChange={event => setSession(prev => ({ ...prev, title: event.target.value }))}
              className="w-full max-w-xl text-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 rounded"
              placeholder="Untitled Study"
            />
            <p className="text-xs text-slate-500 mt-1">Changes save automatically on this device.</p>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <button
              onClick={exportStudy}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Download size={16} /> Export
            </button>
            <button
              onClick={() => setIsAssistantOpen(!isAssistantOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-md"
              aria-label={isAssistantOpen ? 'Close AI assistant' : 'Open AI assistant'}
            >
              {isAssistantOpen ? "Close AI" : "Open AI"}
            </button>
          </div>
        </header>

        {/* Split View Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Scripture Panel */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-200 bg-white">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scripture Passage</label>
            <textarea
                value={session.passage}
                onChange={(e) => setSession({...session, passage: e.target.value})}
                className="w-full h-[90%] p-4 text-lg leading-relaxed text-slate-800 border-none outline-none resize-none font-serif placeholder:text-slate-300"
                placeholder="Paste your scripture passage here..."
            />
          </div>

          {/* Work Panel */}
          <div className="w-full md:w-1/2 flex flex-col bg-slate-50/50">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-white overflow-x-auto">
              {[
                { id: StudyStep.OBSERVATION, label: 'Observation', icon: Eye, color: 'blue' },
                { id: StudyStep.INTERPRETATION, label: 'Interpretation', icon: BookOpen, color: 'amber' },
                { id: StudyStep.APPLICATION, label: 'Application', icon: Heart, color: 'green' },
                { id: StudyStep.CHARTING, label: 'Charting', icon: LayoutIcon, color: 'purple' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleSelectStep(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id ? tabColors[tab.id] : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                  `}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {aiError && (
                <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {aiError}
                </div>
              )}
              {renderContent()}
            </div>
          </div>

        </div>
      </div>

      {/* AI Sidebar */}
      {isAssistantOpen && (
        <div className="hidden lg:block h-full shadow-xl z-10 w-96">
          <Assistant currentStep={activeTab} passageContext={session.passage} />
        </div>
      )}
      
       {/* Mobile AI Overlay */}
       {isAssistantOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">AI Assistant</h3>
                    <button onClick={() => setIsAssistantOpen(false)}><XIcon size={24}/></button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Assistant currentStep={activeTab} passageContext={session.passage} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const XIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
)

export default StudyWorkspace;