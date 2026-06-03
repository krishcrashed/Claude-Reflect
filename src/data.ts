import { DecisionScenario } from './types';

export const SCENARIOS: DecisionScenario[] = [
  {
    id: 'mba',
    title: 'Should I pursue an MBA?',
    desc: 'Evaluate strategic career pivot, financial investment, and opportunity cost of returning to business school.',
    emoji: '🎓',
    prompt: 'Should I pursue an MBA? I have been working in engineering for 3 years and feel locked out of executive strategy roles.',
    questions: [
      {
        id: 'mba_q1',
        text: 'What is your current total compensation (salary/bonus) and financial constraint?',
        placeholder: 'e.g., $110,000/yr, willing to take max $80k debt.',
        value: ''
      },
      {
        id: 'mba_q2',
        text: 'What is your target post-MBA industry and ideal geographic location?',
        placeholder: 'e.g., Management Consulting or VC in California.',
        value: ''
      },
      {
        id: 'mba_q3',
        text: 'Do you have specific test scores (GMAT/GRE) or a target tier of business schools in mind?',
        placeholder: 'e.g., Target M7/T15 schools, took GMAT Focus: 685.',
        value: ''
      }
    ],
    recommendationHTML: `
      <div class="space-y-4 text-gray-800 leading-relaxed">
        <p class="font-medium text-lg text-amber-900 border-b border-amber-100 pb-2">Strategic Recommendation Summary</p>
        <p>
          Given your background in engineering and desired transition to executive strategy, an MBA is a <strong>highly effective vector</strong> for career transformation, but it represents a high-risk premium.
        </p>
        
        <div class="bg-amber-50/50 rounded-lg p-3 border border-amber-100 my-3">
          <p class="text-sm font-semibold text-amber-900 mb-1">🔑 Core Directives:</p>
          <ul class="list-disc pl-4 space-y-1 text-sm text-gray-700">
            <li><strong>M7 or T15 Tier ONLY:</strong> Below the Top 15, management consulting hiring drops by over 60%, and VC hiring is almost non-existent.</li>
            <li><strong>Calculate "Net Cost of Career Friction":</strong> Do not just count tuition. Factor in the substantial 2-year opportunity cost of missed engineering promotion salaries.</li>
          </ul>
        </div>

        <p class="font-semibold text-gray-900">1. Tactical Benefits of the Pivot</p>
        <p>
          Engineers often hit a "technical ceiling" around Year 4-6. An MBA from an elite school serves as an immediate credential reset. Corporate recruiters in investment banking, top-tier consulting, and corporate development use MBA programs as their primary pipelines.
        </p>

        <p class="font-semibold text-gray-900">2. Financial Reality Mapping</p>
        <p>
          If you currently earn over $120,000, two years of lost salary ($240k) plus $160k in tuition yields a true economic investment of <strong>$400,000</strong>. You must model a post-graduation starting base salary of $175k+ to break even within five years.
        </p>

        <p class="font-semibold text-gray-800 italic text-xs mt-2 bg-gray-50 p-2 rounded">
          *Note: This recommendation is predicated on standard assumptions around financial aid, pre-existing debt, and economic stability.
        </p>
      </div>
    `,
    reflectData: {
      score: 'Medium',
      provided: [
        '3 years work experience',
        'Engineering background',
        'Friction/block with executive roles'
      ],
      missing: [
        'Current compensation parameters',
        'Target geographic geography/school tiers',
        'Post-Graduation industry intent (Consulting, Tech, VC)'
      ],
      missingImpact: 'Without target geographies and financial limits, we cannot model real salary delta or qualify school tuition ROI accurately.',
      assumptions: [
        {
          fact: 'Engineering Background',
          assumption: 'User is located in an expensive Western tech market (e.g., US/Europe).',
          reason: 'Engineers seeking business strategy typically target US-centric top-tier business institutions.',
          impact: 'High'
        },
        {
          fact: 'Wants Strategic Roles',
          assumption: 'User intends to work in management consulting, corporate strategy, or product management.',
          reason: 'These represent the highest volume pathways for technical professionals transitioning via MBA.',
          impact: 'High'
        },
        {
          fact: '3 Years Experience',
          assumption: 'User is ready to apply immediately, targeting matriculation at 4-5 years of experience.',
          reason: 'The median age for top business school enrollment is 27-28 years old with ~5 years of professional track record.',
          impact: 'Medium'
        }
      ],
      uncertainty: {
        high: [
          'Post-MBA hiring markets in tech and venture capital (currently soft/highly cyclical).',
          'Exact break-even timeline without knowing your current salary base.'
        ],
        medium: [
          'Admissions probability profile without target standardized GMAT scores.',
          'Scholarship and fellowship offset eligibility values.'
        ],
        low: [
          'Long-term salary premium for executive roles (historically very stable).',
          'Curriculum suitability for building core corporate financial acumen.'
        ],
        explanation: 'The greatest variables affecting this decision are macroeconomic conditions in the target industry (soft tech sector reduces tech PM role volume) and your personal current income trajectory.'
      },
      nextAction: {
        type: 'Proceed With Caution',
        explanation: 'Begin by filling out the context questionnaire on current earnings and target school tiers before preparing admissions files. We recommend analyzing immediate internal career change options first.'
      },
      stressTest: [
        {
          id: 'risk',
          role: 'Risk Analyst',
          avatar: '🛑',
          title: 'The Opportunity Cost Hazard',
          text: 'If you earn $130k/yr now, in 2 years you are sacrificing $260k cash flow. Add $150k tuition and 7% interest rates on loans: your total capital deficit is nearly $450k. If the tech job market remains cold, your post-graduation salary might only be $160k, meaning your break-even horizon exceeds 7 years.',
          riskRating: 'Critical'
        },
        {
          id: 'finance',
          role: 'In-house Strategy Director',
          avatar: '💼',
          title: 'The "Silent Internal Promotion" Track',
          text: 'Most tech firms prefer promoting internally proven engineers to PM/Strategy roles over hiring external MBAs with zero product track record. Ask your current Lead PM for cross-functional stretch assignments. You can bypass the MBA altogether and gain 2 years of compounding seniority and equity.',
          riskRating: 'Moderate'
        },
        {
          id: 'expert',
          role: 'Admissions Panel Expert',
          avatar: '🎓',
          title: 'The Tier Filter Gatekeeping',
          text: 'An MBA is only a transformational tool if completed at an M7 (Harvard, Stanford, Wharton, etc.) or top T15 school. Below this bracket, specialized finance, consulting, and prestige recruiters do not recruit at scale, severely deflating the ROI curve.',
          riskRating: 'Moderate'
        }
      ]
    }
  },
  {
    id: 'saas_pivot',
    title: 'Should we pivot SaaS to Enterprise sales?',
    desc: 'Evaluate moving from self-serve product-led growth to high-touch enterprise contracts.',
    emoji: '🏢',
    prompt: 'Should we pivot our SaaS product from a PLG model ($29/month self-serve) to enterprise contract sales ($50k+/year)? Traffic is steady, but self-serve churn is peaking.',
    questions: [
      {
        id: 'saas_q1',
        text: 'What is your current runway length and existing sales headcount?',
        placeholder: 'e.g., 9 months runway, 2 developers, 0 dedicated sales.',
        value: ''
      },
      {
        id: 'saas_q2',
        text: 'What is your current product retention (e.g., NRR) and what features are enterprise users requesting?',
        placeholder: 'e.g., NRR is 85%. Users ask for SSO, SOC 2 compliance, and custom workspace policies.',
        value: ''
      },
      {
        id: 'saas_q3',
        text: 'What is your current average customer acquisition cost (CAC) and customer payback period?',
        placeholder: 'e.g., CAC is $150, payback takes 6 months.',
        value: ''
      }
    ],
    recommendationHTML: `
      <div class="space-y-4 text-gray-800 leading-relaxed">
        <p class="font-medium text-lg text-emerald-900 border-b border-emerald-100 pb-2">Strategic Recommendation Summary</p>
        <p>
          Your current self-serve retention metrics (85% NRR) and high self-serve churn indicate a product that delivers initial value but fails to expand. Moving to enterprise sales ($50k+) is <strong>fundamentally a change in organization, not just a pricing page update</strong>.
        </p>

        <div class="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 my-3">
          <p class="text-sm font-semibold text-emerald-950 mb-1">💡 Key Pivot Strategy:</p>
          <ul class="list-disc pl-4 space-y-1 text-sm text-gray-700">
            <li><strong>Transition to Product-Led Sales (PLS) first:</strong> Do not kill the $29/mo tier. Use it as a lead generator to identify high-activity teams inside Fortune 500 companies.</li>
            <li><strong>SOC 2 Compliance is the Bottleneck:</strong> Prioritize SOC-2 security certification immediately. Enterprise buyers will not sign custom contracts without security validation.</li>
          </ul>
        </div>

        <p class="font-semibold text-gray-900">1. Organizational Transition Strain</p>
        <p>
          Selling a database or software-as-a-service at $50,000 mandates a professional sales cycle (RFPs, legal compliance, procurement reviews, multi-stakeholder buy-in). A development team of two with zero sales headcount will suffer significant development delays as founders spend 90% of their bandwidth negotiating custom contracts.
        </p>

        <p class="font-semibold text-gray-900">2. Ideal Runway Requirement</p>
        <p>
          Enterprise sales cycles average <strong>6 to 9 months</strong>. With only 9 months of runway, pitching enterprise contracts is a survival risk. You could run out of cash before your first six premium clients complete their signature flows.
        </p>
      </div>
    `,
    reflectData: {
      score: 'Low',
      provided: [
        'PLG self-serve tier priced at $29/month',
        'High client churn issue',
        'Target contract size $50k+/year'
      ],
      missing: [
        'Current funding/runway parameters',
        'Sales and sales engineering headcount capacity',
        'Enterprise security readiness (SSO, SOC-2, HIPAA)'
      ],
      missingImpact: 'Runway level and sales capabilities are critical. If runway is short, committing to custom 9-month sales contracts could create bankruptcy risk before revenue materializes.',
      assumptions: [
        {
          fact: 'Self-serve churn is peaking',
          assumption: 'The core product lacks institutional stickiness or team collaborative loops.',
          reason: 'Individual self-serve buyers churn heavily when they transition projects or lose short-term focus, whereas team-wide deployments remain stable.',
          impact: 'High'
        },
        {
          fact: 'Target $50k contract size',
          assumption: 'Your product contains sensitive or proprietary organizational data worthy of enterprise IT review.',
          reason: 'Pricing floors at $50k inevitably draw the scrutiny of Chief Information Security Officers (CISOs).',
          impact: 'High'
        }
      ],
      uncertainty: {
        high: [
          'Enterprise sales pipeline conversion rate (totally unproven in current operations).',
          'Founder capability in complex B2B institutional negotiation.'
        ],
        medium: [
          'Average sales cycle duration (depends on client security standards and size).',
          'Actual engineering cost to implement custom enterprise-grade controls.'
        ],
        low: [
          'Self-serve value limits (clearly established as churn-prone).',
          'Infrastructure scalability under heavier customer load (typically minor).'
        ],
        explanation: 'Your entire pivot risks sudden cash-out since the actual sales cycle timing and conversion rate are completely unknown, and your current organization is built for developer self-serve.'
      },
      nextAction: {
        type: 'Challenge Assumptions',
        explanation: 'Before abandoning the self-serve model, run 10 interviews with active users to see if an immediate "Team / Workspace Plan" ($200-$500/mo) can solve churn before committing to enterprise compliance costs.'
      },
      stressTest: [
        {
          id: 'finance',
          role: 'CFO / Venture Partner',
          avatar: '📉',
          title: 'The Runway Death Spiral',
          text: 'If you have less than 12 months runway, a pivot to enterprise contracts is highly dangerous. Enterprise deals are easily delayed by legal review for 90+ days. If your sales funnel freezes, you collapse. Retain the self-serve revenues to buy yourself survival margin.',
          riskRating: 'Critical'
        },
        {
          id: 'risk',
          role: 'Enterprise CISO Perspective',
          avatar: '🛡️',
          title: 'The Security Blockade',
          text: 'You cannot sell a $50k contract without a SOC-2 Type II certificate, SAML single sign-on (SSO), data-residency guarantees, and a complex security questionnaire response. Implementing this takes 4-6 months and costs $20k-$40k in toolkits and audits.',
          riskRating: 'Critical'
        },
        {
          id: 'expert',
          role: 'Product Coach',
          avatar: '🧪',
          title: 'The "Custom Feature" Trap',
          text: 'Early enterprise contracts will demand highly customized feature requests. If your team starts building bespoke code for your first two enterprise clients, your general product roadmap freeze, turning your scalable SaaS company into an expensive, low-margin professional consulting shop.',
          riskRating: 'Moderate'
        }
      ]
    }
  },
  {
    id: 'startup_vs_big_tech',
    title: 'Should I join an early-stage startup or Big Tech?',
    desc: 'Evaluate financial trade-offs, equity risks, personal career velocity, and learning structures.',
    emoji: '🚀',
    prompt: 'Should I join a Series A startup as Employee #12 ($125k salary + 0.5% equity) or take a Senior Software Engineer offer at Google ($220k base + $150k RSUs per year)?',
    questions: [
      {
        id: 'work_q1',
        text: 'What are your current personal financial liabilities and long-term wealth targets?',
        placeholder: 'e.g., Supporting family, paying off $40k student loans, want to buy home.',
        value: ''
      },
      {
        id: 'work_q2',
        text: 'Are you eager to specialize as an individual contributor, or do you want to transition towards management?',
        placeholder: 'e.g., Want to lead teams and eventually build my own company in 3 years.',
        value: ''
      },
      {
        id: 'work_q3',
        text: 'What is the track-record of the startup founders and their lead investors?',
        placeholder: 'e.g., Lead investor is Sequoia; founders backed by robust exits before.',
        value: ''
      }
    ],
    recommendationHTML: `
      <div class="space-y-4 text-gray-800 leading-relaxed">
        <p class="font-medium text-lg text-indigo-900 border-b border-indigo-100 pb-2">Strategic Recommendation Summary</p>
        <p>
          This is a strategic choice between <strong>Immediate Liquid Compensation</strong> (Google) and <strong>Career Velocity Premium</strong> (Series A startup).
        </p>

        <div class="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 my-3">
          <p class="text-sm font-semibold text-indigo-950 mb-1">🧭 Strategic Directive:</p>
          <ul class="list-disc pl-4 space-y-1 text-sm text-gray-700">
            <li><strong>De-risk the equity:</strong> Model the startup's 0.5% equity as exactly $0. If you cannot survive happily on the $125k base salary alone, do not sign.</li>
            <li><strong>Leap for leverage, not prestige:</strong> If your goal is starting a venture in 3 years, Employee #12 at an elite VC-backed startup provides more valuable context on early-stage company building than senior IC roles at Google.</li>
          </ul>
        </div>

        <p class="font-semibold text-gray-900">1. Core Financial Analysis</p>
        <p>
          Google offers $370k total annual compensation (liquid, public equity). The startup offers $125k base. Over 3 years, the liquid compensation delta is <strong>$735,000 cash equivalent</strong>. For the startup's 0.5% equity to offset this delta, the startup must achieve a liquid enterprise valuation of **$300 Million** at your exit (assuming no dilution, which is unrealistic).
        </p>

        <p class="font-semibold text-gray-900">2. Dilution Risk and Equity Realities</p>
        <p>
          As Employee #12 in a Series A company, your 0.5% share will likely dilute by 30-50% during Series B, C, and D rounds. Unless the startup becomes an elite unicorn, your payout will likely be smaller than Google's standard RSU package.
        </p>
      </div>
    `,
    reflectData: {
      score: 'Medium',
      provided: [
        'Series A startup equity offering: 0.5%',
        'Salary comparative numbers: $125k vs $220k base + $150k RSUs',
        'Senior Software Engineer offer at Google'
      ],
      missing: [
        'Personal debt and immediate liquidity needs',
        'Startup founders pedigree and financial funding status',
        'Personal risk tolerance and target timeline'
      ],
      missingImpact: 'Without details on your current financial pressure (debt, rent, dependencies), we cannot evaluate if the $125k salary limit poses a material quality of life hazard or forces premature relocation.',
      assumptions: [
        {
          fact: 'Employee #12 Offer',
          assumption: 'The startup equity has standard 4-year vesting with a 1-year cliff.',
          reason: 'This is the standard venture capital employee equity compensation framework.',
          impact: 'Low'
        },
        {
          fact: 'Seeks Startup Growth',
          assumption: 'User is willing to work 50-60 hour weeks with frequent structural pivots.',
          reason: 'Early stage Series A environments frequently undergo heavy shifts in project ownership and product focus.',
          impact: 'High'
        }
      ],
      uncertainty: {
        high: [
          'Liquidity timeline or probability for Series A venture equity (typically 7-10 years, 90% failure).',
          'Actual cultural cohesion of the startup leadership.'
        ],
        medium: [
          'Promotion and RSU refresh velocity at Google within the current corporate landscape.',
          'Post-hire dilution projections (Series B round may dilute you by up to 25%).'
        ],
        low: [
          'Google brand value on standard resume (high and highly consistent).',
          'Immediate cost of living offsets in tech hubs.'
        ],
        explanation: 'Your strategic risk is concentrated in the absolute illiquidity of the Series A equity and the severe cash deficit relative to Big Tech savings rates.'
      },
      nextAction: {
        type: 'Explore Alternatives',
        explanation: 'Negotiate the startup base salary to $145k or ask for an accelerated vesting schedule for the initial equity chunk to reduce downside volatility.'
      },
      stressTest: [
        {
          id: 'finance',
          role: 'Venture Capital Advisor',
          avatar: '📊',
          title: 'The Liquidation Preference Trap',
          text: 'Venture funding terms govern employee exit payouts. If the company sells for $50 Million after raising $40 Million in debt-like preferred shares, the investors take their money first. As a common stock holder (Employee #12), your 0.5% could vest to exactly $0, despite a positive outcome headline.',
          riskRating: 'Critical'
        },
        {
          id: 'risk',
          role: 'Tech Career Coach',
          avatar: '🧠',
          title: 'The "Rest and Vest" Boredom Risk',
          text: 'At Google, you may be relegated to minor infrastructure maintenance, slow approval cycles, and corporate politics. Your technical learning speed will likely decrease. If startup-building skills are your path, Google may build golden handcuffs that keep you from ever initiating your own venture.',
          riskRating: 'Moderate'
        }
      ]
    }
  },
  {
    id: 'open_source_infra',
    title: 'Should we open-source our core infrastructure?',
    desc: 'Evaluate strategic growth benefits against losing intellectual property advantages.',
    emoji: '📂',
    prompt: 'Should we open-source our core high-performance caching layer? We want to build developer adoption, but fear AWS or competitors repackaging it.',
    questions: [
      {
        id: 'os_q1',
        text: 'What is your monetization strategy (e.g., Open Core, SaaS cloud hosting, or technical support)?',
        placeholder: 'e.g., Open Core (paid enterprise features) and managed cloud service.',
        value: ''
      },
      {
        id: 'os_q2',
        text: 'How hard is it for a competitor to replicate your cloud managed orchestrator?',
        placeholder: 'e.g., Competitor would take 6 months; our orchestrator manages complex auto-sharding.',
        value: ''
      },
      {
        id: 'os_q3',
        text: 'Do you currently have developers actively trying to contribute or self-host your product?',
        placeholder: 'e.g., ~150 developers in our closed beta requesting self-host options.',
        value: ''
      }
    ],
    recommendationHTML: `
      <div class="space-y-4 text-gray-800 leading-relaxed">
        <p class="font-medium text-lg text-rose-900 border-b border-rose-100 pb-2">Strategic Recommendation Summary</p>
        <p>
          Open sourcing your core engine is a <strong>one-way street</strong>. Once the code is public, you cannot retroactively close it without major community backlash (e.g., Elastic, HashiCorp).
        </p>

        <div class="bg-rose-50/50 rounded-lg p-3 border border-rose-100 my-3">
          <p class="text-sm font-semibold text-rose-950 mb-1">💡 Suggested License Approach:</p>
          <ul class="list-disc pl-4 space-y-1 text-sm text-gray-700">
            <li><strong>Adopt a Business Source License (BSL 1.1):</strong> This allows self-hosting for developers but legally prevents large hyperscalers (like Amazon) from packaging your technology as a competing managed commercial service.</li>
            <li><strong>Restrict SaaS features:</strong> Keep security (SAML), telemetry controls, and cluster auto-scaling closed in an enterprise proprietary extension package.</li>
          </ul>
        </div>

        <p class="font-semibold text-gray-900">1. Developer Ecosystem vs. Commercial Conversion</p>
        <p>
          Open source creates a massive top-of-funnel marketing effect. However, developer adoption does not naturally convert to enterprise sales contract values. If self-hosting is simple, users will use your unpaid version forever, ballooning your support forums without increasing revenue.
        </p>
      </div>
    `,
    reflectData: {
      score: 'Low',
      provided: [
        'Developer adoption target',
        'Competitor repackaging risk'
      ],
      missing: [
        'Precise monetization blueprint (Open-Core vs Hosting)',
        'Ecosystem self-hosting traction metric',
        'Defensibility level of managed cloud solution'
      ],
      missingImpact: 'Without a clear monetization blueprint, releasing core IP has high risk: you may fuel competitor features without establishing a sustainable economic engine.',
      assumptions: [
        {
          fact: 'Fear of competitor repackaging',
          assumption: 'Competitors can easily deploy your code on their infrastructure to undercut you.',
          reason: 'Unless protected by BSL or strong proprietary orchestration layers, hyperscalers always win on distribution cost.',
          impact: 'High'
        },
        {
          fact: 'Developer adoption target',
          assumption: 'Open-sourcing will instantly create an active external developer community.',
          reason: 'Maintaining open-source tools requires extensive developer advocacy work, which is costly and exhausting.',
          impact: 'Medium'
        }
      ],
      uncertainty: {
        high: [
          'Actual developer contribution and maintenance investment (usually < 2% of users participate).',
          'Hyperscaler repricing timelines under Apache 2.0 license frameworks.'
        ],
        medium: [
          'Enterprise willingness to pay for proprietary features if self-hosting is "good enough".',
          'Licensing compliance and legal policy friction in enterprise software procurement.'
        ],
        low: [
          'Community backlash severity to changing licenses later (historically severe and permanent).',
          'General infrastructure cloud hosting margins (standardized).'
        ],
        explanation: 'The greatest unknown is your developer-to-customer conversion rate, and your team\'s operational readiness to run an open repo.'
      },
      nextAction: {
        type: 'Challenge Assumptions',
        explanation: 'Publish a "Closed Beta Developer License" first. Let your beta users self-host under a free non-commercial license and monitor actual behavior before releasing product control.'
      },
      stressTest: [
        {
          id: 'risk',
          role: 'Open-Source Lawyer',
          avatar: '⚖️',
          title: 'The License Lock-in Trap',
          text: 'If you license under Apache 2.0, you are legally giving Amazon Web Services the right to run your software, charge for it, and control the marketplace. Changing your license structure after you have community code contributions requires the signature of EVERY external developer who has submitted a line of code, which is nearly impossible.',
          riskRating: 'Critical'
        },
        {
          id: 'finance',
          role: 'OSS Founder Strategy',
          avatar: '🌱',
          title: 'The Support Tax Crisis',
          text: 'Open source developers will expect fast bug fixes, free architectural consulting, and continuous support. You will spend 70% of your time answer issues on GitHub for developers who will never pay you a dollar, starving your paying enterprise clients from critical product improvements.',
          riskRating: 'Moderate'
        }
      ]
    }
  }
];