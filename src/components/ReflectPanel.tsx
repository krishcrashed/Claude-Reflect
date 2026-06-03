import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ReflectState, 
  SufficiencyScore, 
  NextActionType, 
} from '../types';

interface ReflectPanelProps {
  data: ReflectState;
  onClose: () => void;
  isOpen: boolean;
  isUpgraded: boolean; // upgraded after submitting context questionnaire
  onActionClick?: (actionType: NextActionType) => void;
}

export default function ReflectPanel({ 
  data, 
  onClose, 
  isOpen, 
  isUpgraded,
  onActionClick 
}: ReflectPanelProps) {
  const [activeTab, setActiveTab] = useState<'assess' | 'perspectives'>('assess');
  const [hasRunStressTest, setHasRunStressTest] = useState(false);
  const [selectedStressPerspective, setSelectedStressPerspective] = useState<string | null>(null);

  // Compute upgraded state variables
  const currentScore: SufficiencyScore = isUpgraded ? 'High' : data.score;
  const currentProvided = isUpgraded 
    ? [...data.provided, ...data.missing.map(m => m.replace(' parameters', '').replace(' metrics', '').replace(' readiness', ''))] 
    : data.provided;
  const currentMissing = isUpgraded ? [] : data.missing;
  const currentImpact = isUpgraded 
    ? 'All core ambiguities have been resolved. The recommendation quality has been upgraded with calibrated precision.' 
    : data.missingImpact;

  // Next action evaluation
  const currentNextAction = isUpgraded 
    ? { type: 'Proceed' as NextActionType, explanation: 'All strategic variables mapped. You can lock in structural milestones and begin tactical pilot phase.' }
    : data.nextAction;

  const handleStressTestClick = () => {
    setHasRunStressTest(true);
    setActiveTab('perspectives');
  };

  return (
    <motion.aside 
      id="claude-reflect-panel"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 344, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="bg-[#161616] flex flex-col border-l border-[#383838] h-full shrink-0 overflow-hidden"
    >
      <div className="w-[344px] flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-[#383838] shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm tracking-tight text-[#ececec]">Claude Reflect</h2>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] bg-[#383838] px-2 py-0.5 rounded font-bold text-[#a3a3a3]">v1.2</span>
            <button 
              id="btn-close-reflect"
              onClick={onClose}
              className="text-[#a3a3a3] hover:text-[#ececec] text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
        <p className="text-xs text-[#a3a3a3] mt-1 italic">Calibration for high-stakes decisions.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#383838] bg-[#161616] text-[10px] font-bold uppercase tracking-wider">
        <button
          id="tab-assess"
          onClick={() => setActiveTab('assess')}
          className={`flex-1 py-3 text-center transition ${
            activeTab === 'assess' 
              ? 'bg-[#212121] border-b-2 border-[#ececec] text-[#ececec]'
              : 'border-b-2 border-transparent text-[#a3a3a3] hover:text-[#ececec]'
          }`}
        >
          Calibration
        </button>
        <button
          id="tab-stress"
          onClick={() => {
            setActiveTab('perspectives');
            setHasRunStressTest(true);
          }}
          className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition ${
            activeTab === 'perspectives' 
              ? 'bg-[#212121] border-b-2 border-[#ececec] text-[#ececec]' 
              : 'border-b-2 border-transparent text-[#a3a3a3] hover:text-[#ececec]'
          }`}
        >
          Perspectives
          {(!hasRunStressTest) && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757] animate-pulse" />
          )}
        </button>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {activeTab === 'assess' ? (
          <>
            {/* Context Quality Notification */}
            <section className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3]">
                  Context Quality
                </span>
                <span className={`text-xs font-bold uppercase ${
                  currentScore === 'High' ? 'text-[#4a7c44]' : 
                  currentScore === 'Medium' ? 'text-[#d97757]' : 
                  'text-[#c23e3e]'}`}>
                  {currentScore}
                </span>
              </div>

              <div className="h-1.5 w-full bg-[#383838] rounded-full overflow-hidden mb-3">
                <div className={`h-full transition-all duration-700 ${
                  currentScore === 'High' ? 'bg-[#4a7c44] w-full' : 
                  currentScore === 'Medium' ? 'bg-[#d97757] w-3/5' : 
                  'bg-[#c23e3e] w-1/4'
                }`}></div>
              </div>

              {/* Provided facts mapping */}
              <div className="text-xs space-y-2 font-sans pt-2 border-t border-[#383838]">
                <div className="text-[#a3a3a3] font-semibold mb-2">Provided Information:</div>
                {currentProvided.map((fact, i) => (
                  <div key={i} className="flex gap-2 text-[#ececec]">
                    <span className="text-[#4a7c44]">✓</span><span className="leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>

              {/* Missing facts mapping */}
              {currentMissing.length > 0 && (
                <div className="text-xs space-y-2 mt-4 pt-4 border-t border-[#383838]">
                  <div className="text-[#a3a3a3] font-semibold mb-2">Missing Context:</div>
                  {currentMissing.map((missing, i) => (
                    <div key={i} className="flex gap-2 text-[#ececec]">
                      <span className="text-[#d97757] font-bold">!</span><span className="leading-relaxed">{missing}</span>
                    </div>
                  ))}
                  <div className="mt-3 text-[11px] text-[#a3a3a3] bg-[#1c1c1c] p-3 rounded border border-[#383838] leading-relaxed">
                    <span className="font-semibold text-[#ececec] block mb-1">Why this matters:</span>
                    {currentImpact}
                  </div>
                </div>
              )}
            </section>

            {/* Assumptions Made Section */}
            <section className="space-y-3 pt-6 border-t border-[#383838]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3]">
                Key Assumptions Made
              </span>

              <div className="space-y-3 mt-3">
                {data.assumptions.length === 0 ? (
                  <div className="text-xs text-[#a3a3a3] italic">No major assumptions were required.</div>
                ) : (
                  data.assumptions.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-[#1c1c1c] border border-[#383838] rounded space-y-2"
                    >
                      <div className="text-xs font-semibold text-[#ececec] leading-relaxed">
                        {item.fact}
                      </div>
                      <div className="text-[11px] text-[#a3a3a3] leading-relaxed space-y-1">
                        <div><span className="font-medium text-[#d4d4d4]">Assumed:</span> {item.assumption}</div>
                        <div><span className="font-medium text-[#d4d4d4]">Why:</span> {item.reason}</div>
                        <div><span className="font-medium text-[#d4d4d4]">Risk Impact:</span> <span className={`${item.impact === 'High' ? 'text-[#d97757]' : 'text-[#a3a3a3]'}`}>{item.impact}</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Uncertainty Explorer */}
            <section className="space-y-3 pt-6 border-t border-[#383838]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3]">
                Uncertainty Map
              </span>

              <div className="mt-3 space-y-4">
                <p className="text-[11px] text-[#a3a3a3] leading-relaxed mb-4">
                  {data.uncertainty.explanation}
                </p>
                {data.uncertainty.high.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#d97757] uppercase tracking-wider">High Uncertainty Areas</div>
                    {data.uncertainty.high.map((item, i) => (
                      <div key={'high-'+i} className="text-xs text-[#ececec] bg-[#1c1c1c] p-2 rounded border border-[#383838] leading-relaxed">
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {data.uncertainty.medium.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#b58900] uppercase tracking-wider">Medium Uncertainty Areas</div>
                    {data.uncertainty.medium.map((item, i) => (
                      <div key={'medium-'+i} className="text-xs text-[#ececec] bg-[#1c1c1c] p-2 rounded border border-[#383838] leading-relaxed">
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Stress Test */}
            <section className="pt-6 border-t border-[#383838]">
              <button
                onClick={handleStressTestClick}
                className="w-full py-3 border-2 border-dashed border-[#d97757] rounded-lg text-xs font-bold text-[#d97757] hover:bg-[#d97757] hover:bg-opacity-10 flex flex-col items-center gap-1 transition cursor-pointer"
              >
                ALTERNATIVE PERSPECTIVES
                <span className="font-normal opacity-70">Avoid confirmation bias</span>
              </button>
            </section>

            {/* Recommended Next Action Section */}
            <section className="pt-6 border-t border-[#383838]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3]">
                Recommended Next Action
              </span>

              <div className="mt-3 space-y-2">
                <button
                  className="w-full text-left p-3 bg-[#212121] border border-[#383838] rounded hover:border-[#ececec] flex justify-between items-center transition cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#ececec]">{currentNextAction.type}</span>
                  <span className="text-lg text-[#ececec]">→</span>
                </button>
                <div className="text-[11px] mt-1 text-[#a3a3a3] leading-relaxed px-1 pb-4">
                  {currentNextAction.explanation}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* PERSPECTIVES WORKING MODE */
          <div className="space-y-5 animate-fadeIn mt-2 text-[#ececec]">
            <p className="text-[11px] text-[#a3a3a3] leading-relaxed">
              Review these alternative perspectives to avoid confirmation bias. How would your strategy change if you approached it from these angles?
            </p>
            {/* Viewport alternatives */}
            <div className="space-y-4">
              {data.stressTest.length === 0 ? (
                <div className="text-xs text-[#a3a3a3] italic p-4 bg-[#1c1c1c] rounded">No strong alternative perspectives identified for this query.</div>
              ) : (
                data.stressTest.map((perspective) => (
                  <div 
                    key={perspective.id}
                    onClick={() => setSelectedStressPerspective(
                      selectedStressPerspective === perspective.id ? null : perspective.id
                    )}
                    className={`p-4 rounded bg-[#212121] transition cursor-pointer border ${
                      selectedStressPerspective === perspective.id 
                        ? 'border-[#ececec]' 
                        : 'border-[#383838] hover:border-[#ececec]'
                    }`}
                  >
                    <div className="flex items-center justify-between pointer-events-none mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl select-none">{perspective.avatar}</span>
                        <div>
                          <div className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-wide">{perspective.role}</div>
                          <h4 className="text-xs font-bold text-[#ececec]">{perspective.title}</h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#ececec] leading-relaxed">
                      {perspective.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Back button */}
            <div className="pt-3 border-t border-[#383838]">
              <button 
                id="btn-back-to-assess"
                onClick={() => setActiveTab('assess')}
                className="w-full py-2 bg-[#212121] border border-[#383838] hover:bg-[#2f2f2f] text-[#ececec] rounded text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                ← Back to Calibration
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </motion.aside>
  );
}
