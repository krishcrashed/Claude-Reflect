export type SufficiencyScore = 'High' | 'Medium' | 'Low';

export type NextActionType = 
  | 'Proceed' 
  | 'Proceed With Caution' 
  | 'Add More Context' 
  | 'Explore Alternatives' 
  | 'Challenge Assumptions' 
  | 'View Counterarguments';

export interface Question {
  id: string;
  text: string;
  options?: string[]; // for selectable choices
  placeholder?: string;
  value: string; // bound user answer
}

export interface Assumption {
  fact: string;
  assumption: string;
  reason: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface StressPerspective {
  id: string;
  role: string;
  avatar: string; // avatar initial/icon
  title: string;
  text: string;
  riskRating: 'Critical' | 'Moderate' | 'Secondary';
}

export interface ReflectState {
  score: SufficiencyScore;
  provided: string[];
  missing: string[];
  missingImpact: string;
  assumptions: Assumption[];
  uncertainty: {
    high: string[];
    medium: string[];
    low: string[];
    explanation: string;
  };
  nextAction: {
    type: NextActionType;
    explanation: string;
  };
  stressTest: StressPerspective[];
}

export interface MessageRecord {
  role: 'user' | 'assistant';
  content: string; // The prompt or the markdown answer/HTML
}

export interface DecisionScenario {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  prompt: string;
  // Context Sufficiency Check Questions
  questions: Question[];
  // Loaded responses
  recommendationHTML: string; // High quality formatted text
  answerMarkdown?: string; // Markdown response from Claude
  reflectData: ReflectState;
  
  history?: MessageRecord[];
}
