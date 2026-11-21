import React, { useCallback, useEffect, useRef, useState } from 'react';
import Layout from './components/Layout';
import StudyWorkspace from './components/StudyWorkspace';
import PrivacyLaunch from './components/PrivacyLaunch';
import type { AppView } from './components/Layout';
import { StudySession, StudyStep } from './types';
import { PlusCircle, Book, Clock, Search, Trash2, Download, Upload } from 'lucide-react';

const INITIAL_SESSIONS: StudySession[] = [];

const STORAGE_KEY = 'ibs-companion-sessions-v1';
const BACKUP_FORMAT = 'inductive-bible-study-companion';
const BACKUP_VERSION = 1;
const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
const MAX_BACKUP_SESSIONS = 500;

interface SessionLoadResult {
  sessions: StudySession[];
  recoveryData: string | null;
  error: string;
}

const isStudySession = (value: unknown): value is StudySession => {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<StudySession>;
  return typeof session.id === 'string' && session.id.length > 0
    && typeof session.title === 'string'
    && typeof session.passage === 'string'
    && typeof session.createdAt === 'number' && Number.isFinite(session.createdAt)
    && Object.values(StudyStep).includes(session.currentStep as StudyStep)
    && Array.isArray(session.observations) && session.observations.every(item => typeof item === 'string')
    && Array.isArray(session.interpretations) && session.interpretations.every(item => typeof item === 'string')
    && Array.isArray(session.applications) && session.applications.every(item => typeof item === 'string')
    && typeof session.chartNotes === 'string'
    && !!session.bri
    && typeof session.bri === 'object'
    && ['author', 'date', 'audience', 'location'].every(key => typeof session.bri?.[key as keyof typeof session.bri] === 'string');
};

const loadSessions = (): SessionLoadResult => {
  let stored: string | null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Could not load saved studies:', error);
    return {
      sessions: INITIAL_SESSIONS,
      recoveryData: null,
      error: 'Your browser could not access saved studies.'
    };
  }

  if (stored === null) {
    return { sessions: INITIAL_SESSIONS, recoveryData: null, error: '' };
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every(isStudySession)) {
      return { sessions: parsed, recoveryData: null, error: '' };
    }
  } catch (error) {
    console.error('Saved study data is not valid JSON:', error);
  }

  return {
    sessions: INITIAL_SESSIONS,
    recoveryData: stored,
    error: 'Saved studies could not be read. Download the original data before starting a new library.'
  };
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [initialLoad] = useState(loadSessions);
  const [sessions, setSessions] = useState<StudySession[]>(initialLoad.sessions);
  const [recoveryData, setRecoveryData] = useState<string | null>(initialLoad.recoveryData);
  const [loadError, setLoadError] = useState(initialLoad.error);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [storageError, setStorageError] = useState('');
  const [backupMessage, setBackupMessage] = useState('');
  const backupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recoveryData !== null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      setStorageError('');
    } catch (error) {
      console.error('Could not save studies on this device:', error);
      setStorageError('Your browser could not save these studies. Export your work before leaving this page.');
    }
  }, [sessions, recoveryData]);

  const handleDownloadRecoveryData = () => {
    if (recoveryData === null) return;
    const url = URL.createObjectURL(new Blob([recoveryData], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ibs-companion-recovery-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleStartFresh = () => {
    if (!window.confirm('Start with an empty study library? The saved data in this browser will be replaced. Download the original data first if you may need it.')) return;
    setSessions(INITIAL_SESSIONS);
    setRecoveryData(null);
    setLoadError('');
  };

  const handleCreateSession = () => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      title: 'Untitled Study',
      passage: '',
      currentStep: StudyStep.OBSERVATION,
      observations: [],
      interpretations: [],
      applications: [],
      chartNotes: '',
      bri: {
        author: '',
        date: '',
        audience: '',
        location: ''
      },
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveView('study');
  };

  const handleOpenSession = (id: string) => {
    setCurrentSessionId(id);
    setActiveView('study');
  };

  const handleSaveSession = useCallback((updatedSession: StudySession) => {
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  }, []);

  const handleDeleteSession = (id: string) => {
    if (!window.confirm('Delete this study? This cannot be undone.')) return;
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const handleExportBackup = () => {
    const backup = {
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      sessions
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ibs-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupMessage(`Backed up ${sessions.length} ${sessions.length === 1 ? 'study' : 'studies'}.`);
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      if (file.size > MAX_BACKUP_BYTES) {
        throw new Error('Backup file is too large (10 MB maximum).');
      }
      const backup: unknown = JSON.parse(await file.text());
      if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
        throw new Error('This is not a valid study backup.');
      }
      const data = backup as { format?: unknown; version?: unknown; sessions?: unknown };
      if (data.format !== BACKUP_FORMAT || data.version !== BACKUP_VERSION
        || !Array.isArray(data.sessions) || data.sessions.length > MAX_BACKUP_SESSIONS
        || !data.sessions.every(isStudySession)
        || new Set(data.sessions.map(session => session.id)).size !== data.sessions.length) {
        throw new Error('This backup is not supported or contains invalid study data.');
      }

      const importedSessions = data.sessions;
      const replacedCount = importedSessions.filter(imported =>
        sessions.some(existing => existing.id === imported.id)
      ).length;
      const replaceNotice = replacedCount
        ? ` ${replacedCount} matching ${replacedCount === 1 ? 'study will' : 'studies will'} be replaced.`
        : '';
      if (!window.confirm(`Import ${importedSessions.length} ${importedSessions.length === 1 ? 'study' : 'studies'}? Existing studies will be kept.${replaceNotice}`)) {
        return;
      }

      setSessions(previous => {
        const merged = new Map<string, StudySession>();
        previous.forEach(session => merged.set(session.id, session));
        importedSessions.forEach(session => merged.set(session.id, session));
        return Array.from(merged.values()).sort((a, b) => b.createdAt - a.createdAt);
      });
      setRecoveryData(null);
      setLoadError('');
      setBackupMessage(`Imported ${importedSessions.length} ${importedSessions.length === 1 ? 'study' : 'studies'}.`);
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : 'Could not import this backup.');
    }
  };

  const activeSession = sessions.find(s => s.id === currentSessionId);
  const filteredSessions = sessions.filter(session =>
    `${session.title} ${session.passage}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {storageError && (
        <div role="alert" className="absolute top-2 right-2 z-[100] max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow">
          {storageError}
        </div>
      )}
      {loadError && (
        <div role="alert" className="absolute top-2 left-2 right-2 z-[100] mx-auto max-w-2xl rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow">
          <p>{loadError}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recoveryData !== null && (
              <button
                onClick={handleDownloadRecoveryData}
                className="rounded-md border border-amber-400 bg-white px-3 py-1.5 font-medium hover:bg-amber-100"
              >
                Download original data
              </button>
            )}
            <button
              onClick={handleStartFresh}
              className="rounded-md border border-amber-400 bg-white px-3 py-1.5 font-medium hover:bg-amber-100"
            >
              Start with an empty library
            </button>
          </div>
        </div>
      )}
      {activeView === 'home' ? (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">Bible Study Dashboard</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Work through a passage with a guided process for observation, interpretation, application, and charting.
            </p>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto mt-3">
              Studies are saved in this browser. Text submitted to AI features is sent to Google Gemini.
              Only paste scripture text you have permission to use.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Back up all studies
            </button>
            <button
              onClick={() => backupInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Upload size={16} /> Restore backup
            </button>
            <input
              ref={backupInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportBackup}
              className="sr-only"
              aria-label="Choose a study backup file"
            />
            {backupMessage && <p role="status" className="w-full text-center text-sm text-slate-600">{backupMessage}</p>}
          </div>

          <label className="relative block mb-6 max-w-xl mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search your studies..."
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <button 
              onClick={handleCreateSession}
              className="group flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            >
              <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle size={32} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800">New Inductive Study</h3>
              <p className="text-sm text-slate-500 mt-2">Start from scratch</p>
            </button>

            {/* Session Cards */}
            {filteredSessions.map(session => (
              <div 
                key={session.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Book size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      aria-label={`Delete ${session.title}`}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <button onClick={() => handleOpenSession(session.id)} className="text-left flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 truncate w-full">{session.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                  {session.passage || "No scripture added yet..."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400 w-full">
                    <span className="flex items-center gap-1">
                      <Clock size={12}/> {session.observations.length} observations
                    </span>
                  </div>
                </button>
              </div>
            ))}
            {filteredSessions.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-10">
                {search ? 'No studies match your search.' : 'No studies yet. Create one to get started.'}
              </p>
            )}
          </div>
        </div>
      ) : activeView === 'study' ? (
        activeSession ? (
          <StudyWorkspace key={activeSession.id} session={activeSession} onSave={handleSaveSession} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
            <p>No study is open yet.</p>
            <button onClick={() => setActiveView('home')} className="text-indigo-600 hover:underline">
              Return to your studies
            </button>
          </div>
        )
      ) : <PrivacyLaunch />}
    </Layout>
  );
};

export default App;