import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SCENARIOS } from './data';
import { DecisionScenario, Question, ReflectState, MessageRecord } from './types';
import ReflectPanel from './components/ReflectPanel';
import { AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Send, 
  Plus, 
  Layers, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Eye, 
  Layout, 
  Compass, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Mic,
  AudioLines,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [scenarios, setScenarios] = useState<DecisionScenario[]>(() => {
    // Deep clone scenarios to allow editing question values safely
    return JSON.parse(JSON.stringify(SCENARIOS));
  });
  
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isReflectPanelOpen, setIsReflectPanelOpen] = useState(true);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  
  // Interactive Walkthrough Stages: 
  // 'initial' -> user clicks/scenarios loaded, showing the intro & the 3 sufficiency questions in chat
  // 'generating' -> simulated thinking with detailed calibration logs
  // 'completed' -> standard calibrated recommendation rendered, with side panel opened
  const [stage, setStage] = useState<'initial' | 'generating' | 'completed'>('initial');
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Simulated thinking message index
  const [generationLogIndex, setGenerationLogIndex] = useState(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  const activeScenario = activeScenarioId ? scenarios.find(s => s.id === activeScenarioId) : undefined;

  // Run simulated logs when in 'generating' state
  useEffect(() => {
    if (stage === 'generating') {
      const logs = [
        `Calibrating context sufficiency indices for "${activeScenario?.title || 'scenario'}"...`,
        `Analyzing ${isUpgraded ? 'provided parameters (comp, geography, tier)...' : 'implicit baseline defaults...'}`,
        `Extracting user-provided strategic constraints vs. system assumptions...`,
        `Mapping macro-economic variables & opportunity cost curves...`,
        `Structuring alternative risk boundaries (PM View, Finance View, Risk Analyst)...`,
        `Assembling trust-calibrated recommendation report layout...`
      ];
      setGenerationLogs(logs);
      setGenerationLogIndex(0);

      const interval = setInterval(() => {
        setGenerationLogIndex(prev => {
          if (prev < logs.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setStage('completed');
              // Automatically slide open Reflect panel to maximize visual impact
              setIsReflectPanelOpen(true);
            }, 600);
            return prev;
          }
        });
      }, 350);

      return () => clearInterval(interval);
    }
  }, [stage, activeScenarioId, isUpgraded]);

  // Handle Switching Scenarios
  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setStage('initial');
    setIsUpgraded(false);
    // Keep custom inputs fresh or reset values
  };

  // Prefill the demo answers quickly to show upgraded flow
  const handlePrefillDemo = () => {
    const updated = scenarios.map(s => {
      if (s.id === activeScenarioId) {
        if (s.id === 'mba') {
          s.questions[0].value = '$125,000 base engineering salary, looking to keep debt ceiling under $80,000.';
          s.questions[1].value = 'Targeting Management Consulting or Venture Strategy in SF / Silicon Valley.';
          s.questions[2].value = 'GMAT score: 710. Prioritizing M7/T15 tier business schools.';
        } else if (s.id === 'saas_pivot') {
          s.questions[0].value = '$350k cash runway left (roughly 10 months). Team consists of 3 developers, no dedicated reps.';
          s.questions[1].value = 'NRR is 84%. Large buyers demand SAML Single Sign-On, SOC 2 Type II, and strict team policy controls.';
          s.questions[2].value = 'Customer Acquisition Cost (CAC) runs $300, self-serve payback period is 9 months with heavy cohort churn.';
        } else if (s.id === 'startup_vs_big_tech') {
          s.questions[0].value = 'Supporting partner in graduate school, $35k remaining college loan debt. Wish to buy apartment within 5 years.';
          s.questions[1].value = 'Strong interest in management tracks and starting my own infrastructure startup within 3 to 4 years.';
          s.questions[2].value = 'Founders are second-time exited builders backed by a Top-5 Silicon Valley seed VC fund.';
        } else if (s.id === 'open_source_infra') {
          s.questions[0].value = 'Managed cloud host console (primary) paired with paid enterprise closed-core advanced features.';
          s.questions[1].value = 'Competitors can replicate core API, but our auto-sharding orchestrator took 14 programmer-months to audit.';
          s.questions[2].value = 'Roughly 180 engineers in public Slack requesting local docker-compose configuration option.';
        }
      }
      return s;
    });
    setScenarios(updated);
  };

  // Submit questions (Context Upgraded Recommendation)
  const handleSubmitContext = () => {
    setIsUpgraded(true);
    setStage('generating');
  };

  // Skip questions (Muted Recommendation)
  const handleSkipContext = () => {
    setIsUpgraded(false);
    setStage('generating');
  };

  const handleCustomPromptSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim() || isLoadingContext) return;

    setIsLoadingContext(true);

    try {
      const activeScenario = activeScenarioId ? scenarios.find(s => s.id === activeScenarioId) : undefined;
      let payloadHistory: MessageRecord[] = [];
      
      if (activeScenarioId && activeScenario) {
        payloadHistory = [...(activeScenario.history || [])];
        payloadHistory.push({ role: 'user', content: activeScenario.prompt });
        const assistantAnswer = activeScenario.answerMarkdown || activeScenario.recommendationHTML || '';
        if (assistantAnswer) {
          payloadHistory.push({ role: 'assistant', content: assistantAnswer });
        }
      }

      const resp = await fetch("/api/analyze-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt, history: payloadHistory }),
      });
      const data = await resp.json();
      
      const dynamicId = 'custom_' + Date.now();
      const generatedQuestions = data.questions && data.questions.length > 0 ? data.questions.map((q: any, i: number) => ({
        id: dynamicId + '_q' + (i+1),
        text: q.text,
        options: q.options,
        placeholder: 'Enter details...',
        value: ''
      })) : [
        {
          id: dynamicId + '_q1',
          text: 'What is your primary constraint?',
          options: ['Time', 'Budget', 'Quality', 'Scope'],
          placeholder: 'e.g., Time constraint',
          value: ''
        },
        {
          id: dynamicId + '_q2',
          text: 'What is your main goal for this?',
          options: ['Learning', 'Implementation', 'Optimization', 'Exploration'],
          placeholder: 'e.g., Learning',
          value: ''
        },
        {
          id: dynamicId + '_q3',
          text: 'What have you tried so far?',
          options: [],
          placeholder: 'e.g., Nothing yet',
          value: ''
        }
      ];

      const reflectFallbacks = {
        score: 'Low',
        provided: ['User general input'],
        missing: generatedQuestions.map((q: any) => q.text),
        missingImpact: 'Without these constraints, any advice generated relies on loose generic baseline constants.',
        assumptions: [],
        uncertainty: {
          high: ['Specific user environment/needs.'],
          medium: ['Operational implementation details.'],
          low: ['General principles.'],
          explanation: 'Your risk coefficient is highly concentrated in unknown personal constraints.'
        },
        nextAction: {
          type: 'Add More Context',
          explanation: 'Provide more context to solidify the reasoning.'
        },
        stressTest: []
      };

      if (activeScenarioId && activeScenario) {
        setScenarios(prev => prev.map(s => {
          if (s.id === activeScenarioId) {
            const nextHistory: MessageRecord[] = [
              ...(s.history || []),
              { role: 'user', content: s.prompt },
              { role: 'assistant', content: s.answerMarkdown || s.recommendationHTML || '' }
            ];
            
            return {
              ...s,
              title: s.title, // keep the same title as before
              history: nextHistory,
              prompt: customPrompt,
              questions: generatedQuestions,
              answerMarkdown: data.answer || "No response generated.",
              reflectData: data.reflectData || reflectFallbacks,
            };
          }
          return s;
        }));
        setStage('generating');
        setIsUpgraded(false);
        setCustomPrompt('');
      } else {
        const newScenario: DecisionScenario = {
          id: dynamicId,
          title: customPrompt.length > 25 ? customPrompt.slice(0, 25) + '...' : customPrompt,
          desc: 'Custom strategic scenario submitted by user.',
          emoji: '💡',
          prompt: customPrompt,
          questions: generatedQuestions,
          recommendationHTML: `
            <div class="space-y-4 text-[#ececec] leading-relaxed">
              <p class="font-medium text-lg text-[#d97757] border-b border-[#383838] pb-2">Analysis Recommendation</p>
              <p>
                You submitted the prompt: <strong>"${customPrompt}"</strong>. Our engine has evaluated this query.
              </p>
              <div class="bg-[#2f2f2f] p-3 rounded border border-[#383838] text-sm text-[#d4d4d4]">
                <strong>Engine Readout:</strong> The response operates at a basic heuristic level due to missing constraints or alternatives in the prompt.
              </div>
              <p class="text-sm">
                We highly recommend answering the additional context questions to improve calibration.
              </p>
            </div>
          `,
          answerMarkdown: data.answer || "No response generated.",
          reflectData: data.reflectData || reflectFallbacks
        };

        setScenarios(prev => [newScenario, ...prev]);
        setActiveScenarioId(dynamicId);
        setStage('initial');
        setIsUpgraded(false);
        setCustomPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingContext(false);
    }
  };

  // Fast reset tool
  const handleResetScenarios = () => {
    setScenarios(JSON.parse(JSON.stringify(SCENARIOS)));
    setActiveScenarioId('mba');
    setStage('initial');
    setIsUpgraded(false);
  };

  return (
    <div className="flex h-screen bg-[#161616] text-[#ececec] font-sans overflow-hidden">
      
      {/* 1. FAITHFUL CLAUDE LEFT SIDEBAR */}
      <div 
        id="claude-sidebar"
        className="w-72 bg-[#1c1c1c] text-[#ececec] flex flex-col h-full border-r border-[#383838] shrink-0 hidden md:flex"
      >
        {/* Brand Header */}
        <div className="p-4 pt-5 pb-5 border-b border-[#383838] flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 px-2">
            <div>
              <h1 className="font-serif text-xl tracking-tight text-[#ececec] leading-tight cursor-pointer">
                Claude
              </h1>
            </div>
          </div>
          <button 
            id="btn-sidebar-reset"
            onClick={handleResetScenarios}
            title="Reset"
            className="p-1 rounded hover:bg-[#2f2f2f] text-[#a3a3a3] hover:text-[#ececec] transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Action button */}
        <div className="px-5">
          <button 
            id="btn-new-custom-chat"
            className="w-full py-2 px-3 rounded-md bg-[#212121] hover:bg-[#2f2f2f] border border-[#383838] text-xs font-bold text-[#ececec] transition flex items-center justify-center text-center cursor-pointer mb-2"
            onClick={() => {
              setActiveScenarioId(null);
              setCustomPrompt('');
              setTimeout(() => {
                const el = document.querySelector('#new-chat-composer-form textarea') as HTMLTextAreaElement;
                if (el) el.focus();
              }, 100);
            }}
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-stone-400" />
              New Chat
            </span>
          </button>
        </div>

        {/* Interactive Scenario History */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="text-xs uppercase text-[#a3a3a3] font-bold tracking-widest mb-3">
            Decisions
          </p>
          
          {scenarios.map((s) => {
            const isActive = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                id={`scenario-tab-${s.id}`}
                onClick={() => handleSelectScenario(s.id)}
                className={`w-full text-left py-2 px-3 rounded-md text-sm leading-relaxed transition ${
                  isActive 
                    ? 'bg-[#383838] text-[#ececec] font-medium' 
                    : 'text-[#a3a3a3] hover:text-[#ececec] hover:bg-[#2f2f2f]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="truncate flex-1">
                    <div className="truncate">{s.title}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* User profile details */}
        <div className="p-4 border-t border-[#383838] text-xs font-medium text-[#a3a3a3]">
          User: krishagarwal2105
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTENT PANE */}
      <div 
        id="claude-conversation-frame"
        className="flex-1 flex flex-col min-w-0 bg-[#212121] border-r border-[#383838] relative"
      >
        {activeScenario ? (
          <>
            {/* Navigation Bar */}
            <div className="h-12 border-b border-[#383838] px-6 flex items-center justify-between bg-[#212121] shrink-0">
          <div className="text-sm font-medium text-[#ececec]">Current Decision: {activeScenario.title}</div>

          <div className="flex gap-4 items-center">
            <button className="text-xs text-[#a3a3a3] hover:text-[#ececec] font-medium hidden md:block cursor-pointer">Share</button>
            
            {stage === 'completed' && !isReflectPanelOpen && (
              <button
                id="btn-expand-reflect-tab"
                onClick={() => setIsReflectPanelOpen(true)}
                className="py-1 px-2 border border-[#d97757] text-[#d97757] select-none rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1 hover:bg-[#fef2f2]"
              >
                Reflect Active <ChevronRight className="w-3 h-3" />
              </button>
            )}
             {stage !== 'completed' && (
              <button className="text-xs text-[#a3a3a3] font-medium hidden md:block border border-[#383838] px-2 py-1 rounded">Reflect Inactive</button>
            )}
          </div>
        </div>

        {/* Conversation Thread Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Thread History */}
            {activeScenario.history?.map((msg, index) => (
              <div key={index} className="w-full mb-6">
                {msg.role === 'user' ? (
                  <div className="flex justify-end w-full">
                    <div className="bg-[#383838] px-5 py-3 rounded-3xl max-w-[80%] text-[#ececec] text-[15px] leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full mb-8">
                    <div className="font-bold text-sm mb-1 text-[#d97757]">Claude</div>
                    <div className="markdown-body prose prose-invert prose-stone max-w-none text-[#ececec]">
                      {msg.content.includes('class=') && msg.content.includes('<div') ? (
                         <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thread Part 1: Original User Input */}
            <div className="flex justify-end w-full mb-6">
              <div className="bg-[#383838] px-5 py-3 rounded-3xl max-w-[80%] text-[#ececec] text-[15px] leading-relaxed">
                {activeScenario.prompt}
              </div>
            </div>

            {/* Thread Part 2: Claude Context Sufficiency Wizard */}
            <div className="flex gap-4">
              <div id="claude-response-wizard" className="w-full max-w-[100%] space-y-4">
                
                {stage === 'initial' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-[#d97757] rounded-full"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">
                        Context Sufficiency Check
                      </span>
                    </div>

                    <p className="text-sm mb-4 italic text-[#d4d4d4]">
                      Before I answer, details would improve recommendation quality:
                    </p>

                    {/* Question inputs container */}
                    <div id="context-questions-container" className="space-y-3 pt-1">
                      {activeScenario.questions.map((q, idx) => (
                        <div key={q.id} className="flex flex-col gap-2 p-3 border border-[#383838] rounded bg-[#212121] transition hover:border-[#d97757] focus-within:border-[#d97757]">
                          <span className="text-sm font-medium text-[#ececec]">{q.text}</span>
                          
                          {q.options && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1 mb-2">
                              {q.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    setScenarios(prev => prev.map(s => {
                                      if (s.id === activeScenario.id) {
                                        s.questions[idx].value = opt;
                                      }
                                      return s;
                                    }));
                                  }}
                                  className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${q.value === opt ? 'bg-[#d97757] border-[#d97757] text-white' : 'bg-[#2f2f2f] border-[#383838] text-[#d4d4d4] hover:bg-[#383838] hover:text-[#ececec]'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                          <input 
                            type="text"
                            id={`input-q-${q.id}`}
                            value={q.value}
                            onChange={(e) => {
                              const updatedVal = e.target.value;
                              setScenarios(prev => prev.map(s => {
                                if (s.id === activeScenario.id) {
                                  s.questions[idx].value = updatedVal;
                                }
                                return s;
                              }));
                            }}
                            placeholder={q.placeholder || "Type your answer..."}
                            className="w-full text-xs py-2 px-3 rounded border border-[#383838] bg-[#161616] focus:outline-none focus:ring-1 focus:ring-[#d97757] text-[#ececec] transition"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Helper buttons and actions */}
                    <div className="pt-3 mt-4 flex gap-2">
                      <button
                        id="btn-submit-questions"
                        onClick={handleSubmitContext}
                        className="bg-[#d97757] hover:bg-[#c66545] text-white font-medium text-xs px-3 py-1.5 rounded transition cursor-pointer"
                      >
                        Submit Details
                      </button>
                      <button
                        id="btn-skip-questions"
                        onClick={handleSkipContext}
                        className="text-[#a3a3a3] text-xs px-3 py-1.5 rounded border border-[#383838] hover:bg-[#2f2f2f] transition cursor-pointer"
                      >
                        Skip & Continue
                      </button>
                      
                      <div className="flex-1"></div>
                      <button
                        id="btn-prefill-demo-data"
                        onClick={handlePrefillDemo}
                        className="py-1.5 px-3 bg-[#212121] border border-[#383838] rounded text-[11px] text-[#a3a3a3] hover:text-[#ececec] font-medium transition cursor-pointer"
                      >
                        Demo Fill
                      </button>
                    </div>
                  </div>
                )}

                {stage === 'generating' && (
                  <div className="py-6 flex flex-col items-start justify-center space-y-2 animate-pulse">
                    <div className="font-bold text-sm text-[#d97757]">Claude</div>
                    <div className="h-4 flex items-center gap-2">
                      <p id="generating-log-statement" className="text-sm text-[#d4d4d4] italic">
                        {generationLogs[generationLogIndex]}
                      </p>
                    </div>
                  </div>
                )}

                {stage === 'completed' && (
                  <div className="space-y-4 flex flex-col gap-2 animate-fadeIn bg-transparent border-0 p-0 m-0 w-full rounded-none">
                    <div className="font-bold text-sm mb-1 text-[#d97757]">Claude</div>
                    
                    {/* Recommendation Output Text */}
                    {activeScenario.answerMarkdown ? (
                      <div id="claude-recommendation-output" className="markdown-body prose prose-invert prose-stone max-w-none text-[#ececec]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeScenario.answerMarkdown}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div 
                        id="claude-recommendation-output" 
                        className="text-[#d4d4d4] leading-relaxed text-sm format-clean space-y-4 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: activeScenario.recommendationHTML }}
                      />
                    )}

                    <div className="pt-4 flex items-center justify-start gap-4">
                      {/* Banner directing to the Reflect layer panel */}
                      {!isReflectPanelOpen && (
                      <button className="text-xs bg-[#212121] text-[#d97757] font-semibold border border-[#d97757] px-3 py-1.5 rounded cursor-pointer transition hover:bg-[#fef2f2]"
                        onClick={() => setIsReflectPanelOpen(true)}>
                        Show Reflect Calibration
                      </button>
                      )}
                      
                      <button 
                        id="btn-restart-calibration"
                        onClick={() => {
                          setStage('initial');
                          setIsUpgraded(false);
                        }}
                        className="text-[11px] text-[#a3a3a3] hover:text-[#ececec] transition cursor-pointer flex items-center gap-1"
                      >
                         Re-calibrate Prompt
                      </button>
                    </div>

                  </div>
                )}


              </div>
            </div>

          </div>
        </div>

        {/* Dynamic bottom Composer Panel/Chat Bar */}
        <div className="p-6 pt-0 bg-transparent flex flex-col items-center">
          <form 
            onSubmit={handleCustomPromptSubmit}
            id="chat-composer-form" 
            className="flex flex-col relative w-full max-w-3xl bg-[#2f2f2f] border border-[#383838] rounded-2xl p-3 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#d97757]"
          >
            <div className="flex items-start">
              <button type="button" className="p-1 mt-[2px] text-[#a3a3a3] hover:text-[#ececec] rounded transition">
                <Plus className="w-5 h-5" />
              </button>
              <textarea
                id="chat-input-field"
                rows={1}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 bg-transparent text-[15px] focus:outline-none h-auto min-h-[24px] max-h-[200px] resize-none text-[#ececec] mt-[6px] ml-2 placeholder-[#a3a3a3]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCustomPromptSubmit(e);
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-end pr-2 gap-4 mt-2 mb-1">
              <span className="text-xs text-[#a3a3a3] flex items-center gap-1 cursor-pointer">
                Sonnet 4.6 Low <ChevronDown className="w-3 h-3 ml-0.5" />
              </span>
              <button type="button" className="text-[#a3a3a3] hover:text-[#ececec] transition">
                <Mic className="w-[18px] h-[18px]" />
              </button>
              <button type="button" className="text-[#a3a3a3] hover:text-[#ececec] transition mr-1">
                <AudioLines className="w-[18px] h-[18px]" />
              </button>
              <button 
                type="submit"
                id="btn-submit-chat"
                className="p-1 mx-1 text-white bg-transparent hover:bg-white/10 rounded-full transition disabled:opacity-50"
                disabled={!customPrompt.trim()}
              >
                {isLoadingContext ? <RefreshCw className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 bg-[#ececec] rounded-full" />}
              </button>
            </div>
          </form>
          <div className="text-xs text-[#8e8e8e] mt-2">
            Claude is AI and can make mistakes. Please double-check responses.
          </div>
        </div>
        </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center pt-[15vh]">
            <h2 className="text-4xl font-serif text-[#e4dbcc] mb-8 select-none flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#d97757]" /> Good evening, Krish
            </h2>
            <div className="w-full max-w-3xl px-4">
              <form 
                onSubmit={handleCustomPromptSubmit}
                id="new-chat-composer-form" 
                className="relative bg-[#2f2f2f] border border-[#383838] rounded-2xl p-4 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#d97757]"
              >
                <div className="flex items-start">
                  <button type="button" className="p-1 mt-1 text-[#a3a3a3] hover:text-[#ececec] rounded transition">
                    <Plus className="w-5 h-5" />
                  </button>
                  <textarea
                    rows={1}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 bg-transparent text-[15px] focus:outline-none h-auto min-h-[32px] max-h-[200px] resize-none text-[#ececec] ml-2 mt-[6px] placeholder-[#a3a3a3]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCustomPromptSubmit(e);
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-end pt-2 gap-4">
                  <span className="text-xs text-[#a3a3a3] flex items-center gap-1 cursor-pointer">
                    Sonnet 4.6 Low <ChevronDown className="w-3 h-3 ml-0.5" />
                  </span>
                  <button type="button" className="text-[#a3a3a3] hover:text-[#ececec] transition">
                    <Mic className="w-[18px] h-[18px]" />
                  </button>
                  <button type="button" className="text-[#a3a3a3] hover:text-[#ececec] transition mr-1">
                    <AudioLines className="w-[18px] h-[18px]" />
                  </button>
                  <button 
                    type="submit"
                    disabled={!customPrompt.trim() || isLoadingContext}
                    className="p-1 mx-1 text-white bg-transparent hover:bg-white/10 rounded-full transition disabled:opacity-50"
                  >
                    {isLoadingContext ? <RefreshCw className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 bg-[#ececec] rounded-full" />}
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-[#8e8e8e]">
                Claude is AI and can make mistakes. Please double-check responses.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {[
                  { icon: BookOpen, label: 'Write' },
                  { icon: TrendingUp, label: 'Strategize' },
                  { icon: Sparkles, label: 'Create' },
                  { icon: Layers, label: 'Learn' },
                  { icon: Layout, label: 'Code' }
                ].map((action, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCustomPrompt("Let's " + action.label.toLowerCase() + " ");
                      document.querySelector('textarea')?.focus();
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-[#383838] hover:bg-[#2f2f2f] bg-[#212121] rounded-full text-sm text-[#ececec] transition cursor-pointer"
                  >
                    <action.icon className="w-4 h-4 text-[#a3a3a3]" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. CLAUDE REFLECT PANEL SLIDEOUT (Right Drawer) */}
      <AnimatePresence>
        {isReflectPanelOpen && activeScenario && (
          <ReflectPanel 
            isOpen={isReflectPanelOpen}
            onClose={() => setIsReflectPanelOpen(false)}
            data={activeScenario.reflectData}
            isUpgraded={isUpgraded}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
