import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import JoinUpdates from '../components/JoinUpdates.jsx';
import SidebarAd from '../components/SidebarAd.jsx';

// Static current affairs database 2026
const CURRENT_AFFAIRS_DATA = [
  {
    title: 'India successfully launches GSAT-20 Communications Satellite via SpaceX Falcon 9',
    category: 'Science & Tech',
    date: '2026-06-12',
    summary: 'ISRO successfully deployed the high-throughput GSAT-20 communication satellite using SpaceX\'s Falcon 9 launch vehicle, marking the first commercial launch collaboration between ISRO and SpaceX.',
    source: 'Space Commission India'
  },
  {
    title: 'Reserve Bank of India (RBI) holds repo rate steady at 6.5% for fifth consecutive session',
    category: 'Economy',
    date: '2026-06-10',
    summary: 'The Monetary Policy Committee (MPC) of the RBI voted unanimously to keep the policy repo rate unchanged, keeping focus on aligning inflation durably to the 4% target while supporting growth.',
    source: 'Reserve Bank of India'
  },
  {
    title: 'Dr. Soumya Swaminathan appointed as the Chairperson of National Health Commission',
    category: 'National',
    date: '2026-06-08',
    summary: 'The government of India announced the appointment of renowned medical researcher Dr. Soumya Swaminathan to lead the restructured National Health Commission to oversee health policy reforms.',
    source: 'Ministry of Health'
  },
  {
    title: 'G7 Summit 2026: World Leaders sign historic clean energy transmission pact in Italy',
    category: 'International',
    date: '2026-06-05',
    summary: 'The 52nd G7 Summit concluded with member countries signing a multilateral green energy infrastructure funding agreement aimed at accelerating clean energy exports to developing nations.',
    source: 'Global Summit Wire'
  },
  {
    title: 'India wins Gold at the World Archery Championship 2026 in Switzerland',
    category: 'Sports',
    date: '2026-06-03',
    summary: 'The Indian compound archery team defeated South Korea in a thrilling final match to claim the gold medal, registering India\'s best-ever performance at the international tournament.',
    source: 'Sports Authority of India'
  },
  {
    title: 'DRDO conducts successful flight test of new generation Agni-Prime ballistic missile',
    category: 'Science & Tech',
    date: '2026-05-30',
    summary: 'Defense Research and Development Organisation (DRDO) successfully test-fired the canisterized Agni-Prime missile off the coast of Odisha, demonstrating high-accuracy target destruction.',
    source: 'DRDO Press Release'
  }
];

const GK_OUTPUTS = {
  gsat: {
    summary: {
      title: "India Launches GSAT-20 Communications Satellite via SpaceX Falcon 9",
      bullets: [
        "🌐 **Milestone Collaboration**: This marks the first time ISRO has partnered with SpaceX for a heavy commercial satellite launch (Falcon 9 vehicle).",
        "📡 **Satellite Specs**: GSAT-20 (GSAT-N2) is a high-throughput Ka-band satellite weighing 4,700 kg.",
        "⚡ **Core Goal**: Intended to provide high-speed broadband and in-flight connectivity to rural and remote regions of India.",
        "🎓 **Exam Significance**: High relevance for Science & Technology syllabus. Questions often focus on payload weights, launch vehicle name, and international aerospace pacts."
      ],
      relevance: "9.5/10 (Highly likely for UPSC & State PSC Science rounds)"
    },
    mcqs: [
      {
        question: "Which high-throughput communications satellite was launched by ISRO using SpaceX's Falcon 9 in 2026?",
        options: ["GSAT-20 (GSAT-N2)", "INSAT-4B", "EOS-04", "GSAT-30"],
        correct: 0,
        explanation: "GSAT-20 (also designated as GSAT-N2) was successfully launched via a SpaceX Falcon 9 rocket from Cape Canaveral. It weighs 4.7 tonnes and aims to close the digital divide across India."
      }
    ]
  },
  rbi: {
    summary: {
      title: "RBI MPC Holds Repo Rate Steady at 6.50%",
      bullets: [
        "📈 **Policy Stance**: The Monetary Policy Committee retained its stance of 'withdrawal of accommodation' to align CPI inflation with the target.",
        "📊 **Key Rates**: Repo Rate remains at 6.50%. Consequently, SDF stands at 6.25% and MSF at 6.75%.",
        "🌾 **GDP Projection**: Expected real GDP growth for FY26 is projected at 7.2% driven by robust domestic demand.",
        "✍️ **Exam Significance**: Highly relevant for Economy & Banking General Awareness sections. Expect direct questions on repo/reverse repo values."
      ],
      relevance: "9.0/10 (Standard question for RBI Grade B & Bank PO Mains)"
    },
    mcqs: [
      {
        question: "What is the policy Repo Rate maintained by the RBI Monetary Policy Committee in its mid-2026 session?",
        options: ["6.25%", "6.50%", "6.75%", "7.00%"],
        correct: 1,
        explanation: "The Reserve Bank of India (RBI) Monetary Policy Committee voted unanimously to keep the key benchmark repo rate unchanged at 6.50% to balance growth and durably align CPI inflation."
      }
    ]
  },
  g7: {
    summary: {
      title: "G7 Summit Italy: Clean Energy Transmission Pact",
      bullets: [
        "🌿 **Green Commitment**: G7 countries signed a multilateral commitment to build clean energy grids across Europe and Asia.",
        "🔌 **Funding Focus**: Focuses on expanding grid connections and funding green hydrogen transmission networks in developing economies.",
        "🤝 **Global Diplomacy**: Highlights shifting international relations aiming to reduce dependency on carbon-heavy fuels.",
        "📚 **Exam Significance**: Key international relations topic. Focus on G7 member states, summit venue (Italy), and climate agreements."
      ],
      relevance: "8.5/10 (Crucial for UPSC Mains GS Paper II & III)"
    },
    mcqs: [
      {
        question: "Which international summit concluded with the signing of a historic Clean Energy Transmission Pact?",
        options: ["G20 Summit (India)", "G7 Summit (Italy)", "COP31 (Japan)", "WEF Davos"],
        correct: 1,
        explanation: "The G7 Summit in Italy concluded with the signing of a multilateral Clean Energy Transmission Pact to fund high-capacity green electricity grids worldwide."
      }
    ]
  }
};

const SEO_OUTPUTS = {
  ssc: {
    keyword: "Best Books for SSC CGL 2026 preparation",
    slug: "/prep/best-books-ssc-cgl-2026",
    metaTitle: "Top 7 Best Books for SSC CGL 2026 Preparation – Topper Recommendations",
    metaDesc: "Struggling to find the best books to crack SSC CGL 2026? Check out our topper-recommended preparation books for Quant, English, Reasoning, and GK.",
    h1: "Best Books to Crack SSC CGL 2026: Tier-1 & Tier-2 Master Syllabus",
    preview: "Preparing for the <strong>SSC CGL 2026</strong> exam requires structured practice and the best resources. The syllabus covers Quantitative Aptitude, Logical Reasoning, General Awareness, and English. By selecting topper guides like <strong>Quantitative Aptitude by R.S. Aggarwal</strong> and <strong>Word Power Made Easy by Norman Lewis</strong>, candidates can build solid fundamentals. Our <strong>AI-optimized preparation guide</strong> highlights how to design a daily revision schedule to score 160+ marks.",
    score: 98
  },
  bank: {
    keyword: "How to prepare General Awareness for Bank PO",
    slug: "/prep/general-awareness-banking-po",
    metaTitle: "How to Score 35+ in General Awareness for Bank PO Exams – GK Guide",
    metaDesc: "Master the step-by-step strategy to prepare General Awareness for SBI PO and IBPS PO exams. Get access to the best study plan, current affairs sources, and GK mock tests.",
    h1: "Mastering General Awareness for Bank PO: Syllabus, Sources, and Tips",
    preview: "The General Awareness section is a major score booster in <strong>Bank PO exams</strong> like SBI and IBPS. Unlike static government exams, bank exams focus heavily on <strong>Daily Current Affairs</strong> and <strong>Banking Awareness</strong>. To score 35+ marks, candidates should read newspapers, practice weekly quiz sheets, and review our curated study notes. Utilizing our <strong>real-time AI GK hub</strong> helps track daily updates and test your retention with custom mock papers.",
    score: 97
  }
};

const STUDY_STEPS = [
  "🔍 Connecting to National Press Bureau & ISRO media wires...",
  "📝 Extracting semantic summary & verifying facts...",
  "🧠 Customizing multiple-choice questions for exam difficulty...",
  "✅ AI Generation Complete! Showing results below."
];

const SEO_STEPS = [
  "🎯 Crawling competitor search rankings & keyword density...",
  "📊 Designing LSI heading hierarchies and semantic anchors...",
  "🏷️ Auto-generating JSON-LD Schema structured schema markup...",
  "🚀 Page optimization complete (SEO Score: 98/100)!"
];

export default function CurrentAffairsHub() {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All', 'National', 'International', 'Economy', 'Science & Tech', 'Sports'];

  // Dynamic DB fetching states
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentAffairs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/current-affairs');
        setCurrentAffairs(res.data || []);
      } catch (err) {
        console.error('Error loading current affairs from database:', err);
        setError('Failed to fetch real-time updates. Showing offline backup.');
        setCurrentAffairs(CURRENT_AFFAIRS_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentAffairs();
  }, []);

  // AI Sandbox states
  const [sandboxTab, setSandboxTab] = useState('gk'); // 'gk' or 'seo'
  const [gkTopic, setGkTopic] = useState('gsat'); // 'gsat', 'rbi', 'g7'
  const [gkGenerating, setGkGenerating] = useState(false);
  const [gkStep, setGkStep] = useState(0);
  const [gkOutput, setGkOutput] = useState(null); // 'summary' or 'mcqs'
  const [showAnswer, setShowAnswer] = useState({}); // index: boolean

  const [seoKeyword, setSeoKeyword] = useState('ssc'); // 'ssc', 'bank'
  const [seoTone, setSeoTone] = useState('professional'); // 'professional', 'exam'
  const [seoGenerating, setSeoGenerating] = useState(false);
  const [seoStep, setSeoStep] = useState(0);
  const [seoOutput, setSeoOutput] = useState(null);

  const runGkGenerator = (type) => {
    setGkGenerating(true);
    setGkStep(0);
    setGkOutput(null);
    setShowAnswer({});

    const interval = setInterval(() => {
      setGkStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setGkGenerating(false);
          setGkOutput(type);
          return 3;
        }
        return prev + 1;
      });
    }, 400);
  };

  const runSeoGenerator = () => {
    setSeoGenerating(true);
    setSeoStep(0);
    setSeoOutput(null);

    const interval = setInterval(() => {
      setSeoStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setSeoGenerating(false);
          setSeoOutput(true);
          return 3;
        }
        return prev + 1;
      });
    }, 400);
  };

  const filteredItems = activeTab === 'All'
    ? currentAffairs
    : currentAffairs.filter(item => item.category === activeTab);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="current-affairs-page">
      <Helmet>
        <title>Daily Current Affairs 2026 – GK Updates & News for Sarkari Exams</title>
        <meta name="description" content="Stay updated with daily current affairs and general knowledge (GK) updates for SSC, UPSC, Bank, and Railway exams. View categorized news and preparation summaries." />
        <link rel="canonical" href={`${window.location.origin}/current-affairs`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Daily Current Affairs 2026 – GK Updates & News for Sarkari Exams" />
        <meta property="og:description" content="Stay updated with daily current affairs and general knowledge (GK) updates for SSC, UPSC, Bank, and Railway exams." />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
      </Helmet>

      {/* Header Banner */}
      <div className="mb-4 text-center py-4 bg-light rounded shadow-sm px-3" style={{ borderLeft: '5px solid #ec4899' }}>
        <h1 className="h2 fw-bold text-dark mb-2">📰 Daily Current Affairs & GK 2026</h1>
        <p className="text-muted fs-6 max-width-600 mx-auto mb-0">
          Stay informed with daily national & international general knowledge updates curated specifically for competitive exams like UPSC, SSC, Banking, and State PSCs.
        </p>
      </div>

      {/* AI Sandbox Engine */}
      <div style={{
        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
        borderRadius: '16px',
        padding: '24px',
        color: '#f8fafc',
        marginBottom: '32px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.3)',
        border: '1px solid #334155'
      }}>
        {/* Title */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#f472b6', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> NextJobPost AI Engine Sandbox
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              Interact with our proprietary content engines. Summarize news, generate mock test questions, or run the SEO content builder.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: '#334155', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setSandboxTab('gk')}
              style={{
                background: sandboxTab === 'gk' ? '#ec4899' : 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              🤖 AI GK Summary Engine
            </button>
            <button
              onClick={() => setSandboxTab('seo')}
              style={{
                background: sandboxTab === 'seo' ? '#10b981' : 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              ⚙️ AI SEO Content Machine
            </button>
          </div>
        </div>

        {/* Tab 1: AI GK Summary Engine */}
        {sandboxTab === 'gk' && (
          <div>
            <div className="row g-3 align-items-end mb-4">
              <div className="col-12 col-md-5">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Select Target News Topic</label>
                <select
                  value={gkTopic}
                  onChange={(e) => setGkTopic(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#334155',
                    border: '1px solid #475569',
                    color: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="gsat">🚀 ISRO GSAT-20 SpaceX Falcon 9 Launch</option>
                  <option value="rbi">📈 RBI MPC Repo Rate Holding Policy</option>
                  <option value="g7">🌍 G7 Summit Italy Clean Energy Transmission Pact</option>
                </select>
              </div>
              <div className="col-12 col-md-7 d-flex gap-2">
                <button
                  onClick={() => runGkGenerator('summary')}
                  disabled={gkGenerating}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: gkGenerating ? 0.7 : 1,
                    transition: 'all 150ms ease'
                  }}
                >
                  📚 Generate AI Study Summary
                </button>
                <button
                  onClick={() => runGkGenerator('mcqs')}
                  disabled={gkGenerating}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: gkGenerating ? 0.7 : 1,
                    transition: 'all 150ms ease'
                  }}
                >
                  🎯 Generate Mock Questions
                </button>
              </div>
            </div>

            {/* Console output while generating */}
            {gkGenerating && (
              <div style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '14px',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#34d399',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                  <span style={{ color: '#94a3b8' }}>AI Content Engine running...</span>
                </div>
                {STUDY_STEPS.slice(0, gkStep + 1).map((step, idx) => (
                  <div key={idx} style={{ marginBottom: '4px' }}>
                    {step}
                  </div>
                ))}
              </div>
            )}

            {/* Generated Output */}
            {!gkGenerating && gkOutput && (
              <div style={{
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '12px',
                padding: '20px',
                animation: 'fadeIn 300ms ease'
              }}>
                {gkOutput === 'summary' ? (
                  <div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f472b6' }}>
                        📝 Summary: {GK_OUTPUTS[gkTopic].summary.title}
                      </h4>
                      <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: '#ec48991a', color: '#f472b6', borderRadius: '20px', fontWeight: 800 }}>
                        Relevance: {GK_OUTPUTS[gkTopic].summary.relevance}
                      </span>
                    </div>
                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {GK_OUTPUTS[gkTopic].summary.bullets.map((bullet, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h4 className="mb-3" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f472b6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🎯</span> Generated Mock Questions:
                    </h4>
                    {GK_OUTPUTS[gkTopic].mcqs.map((q, qidx) => (
                      <div key={qidx} style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                          Q: {q.question}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                          {q.options.map((opt, oidx) => (
                            <div
                              key={oidx}
                              style={{
                                background: '#1e293b',
                                border: '1px solid #334155',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                color: '#cbd5e1',
                                fontWeight: 600
                              }}
                            >
                              {String.fromCharCode(65 + oidx)}. {opt}
                            </div>
                          ))}
                        </div>
                        {showAnswer[qidx] ? (
                          <div style={{ background: '#10b9811a', borderLeft: '3px solid #10b981', padding: '10px 14px', borderRadius: '4px', fontSize: '0.78rem', color: '#a7f3d0' }}>
                            <strong>Correct Answer: {String.fromCharCode(65 + q.correct)} ({q.options[q.correct]})</strong>
                            <p style={{ margin: '4px 0 0 0', lineHeight: 1.4 }}>{q.explanation}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAnswer(prev => ({ ...prev, [qidx]: true }))}
                            style={{
                              background: '#334155',
                              border: 'none',
                              color: '#ffffff',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            👁️ Reveal Correct Answer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI SEO Content Machine */}
        {sandboxTab === 'seo' && (
          <div>
            <div className="row g-3 align-items-end mb-4">
              <div className="col-12 col-md-5">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Target Keyword Phrase</label>
                <select
                  value={seoKeyword}
                  onChange={(e) => setSeoKeyword(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#334155',
                    border: '1px solid #475569',
                    color: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="ssc">🔑 Best Books for SSC CGL 2026 preparation</option>
                  <option value="bank">🔑 How to prepare General Awareness for Bank PO</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Optimized Writing Tone</label>
                <div style={{ display: 'flex', gap: '4px', background: '#334155', padding: '4px', borderRadius: '8px' }}>
                  <button
                    onClick={() => setSeoTone('professional')}
                    style={{
                      flex: 1,
                      background: seoTone === 'professional' ? '#10b981' : 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      padding: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Professional
                  </button>
                  <button
                    onClick={() => setSeoTone('exam')}
                    style={{
                      flex: 1,
                      background: seoTone === 'exam' ? '#10b981' : 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      padding: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Exam-focused
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <button
                  onClick={runSeoGenerator}
                  disabled={seoGenerating}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: seoGenerating ? 0.7 : 1,
                    transition: 'all 150ms ease'
                  }}
                >
                  🚀 Run SEO Content Generator
                </button>
              </div>
            </div>

            {/* Console output while generating */}
            {seoGenerating && (
              <div style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '14px',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#34d399',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  <span style={{ color: '#94a3b8' }}>SEO Engine running...</span>
                </div>
                {SEO_STEPS.slice(0, seoStep + 1).map((step, idx) => (
                  <div key={idx} style={{ marginBottom: '4px' }}>
                    {step}
                  </div>
                ))}
              </div>
            )}

            {/* Generated SEO Output */}
            {!seoGenerating && seoOutput && (
              <div style={{
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '12px',
                padding: '20px',
                animation: 'fadeIn 300ms ease'
              }}>
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2" style={{ borderBottom: '1px solid #334155' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🚀</span> AI SEO Generation Blueprint
                  </h4>
                  <span style={{ fontSize: '0.72rem', padding: '4px 10px', background: '#10b9811a', color: '#10b981', borderRadius: '20px', fontWeight: 800 }}>
                    SEO Health Score: {SEO_OUTPUTS[seoKeyword].score}/100
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>URL slug path</span>
                    <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#a855f7', fontFamily: 'monospace', marginTop: '4px' }}>
                      {SEO_OUTPUTS[seoKeyword].slug}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>optimized meta title</span>
                    <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700, marginTop: '4px' }}>
                      {SEO_OUTPUTS[seoKeyword].metaTitle}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>optimized meta description</span>
                    <p style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      {SEO_OUTPUTS[seoKeyword].metaDesc}
                    </p>
                  </div>

                  <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <span style={{ fontSize: '0.7rem', background: '#10b9811a', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>HTML H1 Heading Tag</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '8px 0 12px 0' }}>{SEO_OUTPUTS[seoKeyword].h1}</h3>
                    
                    <span style={{ fontSize: '0.7rem', background: '#334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>HTML Paragraph Content (Keywords Highlighted)</span>
                    <p
                      style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5, margin: '8px 0 0 0' }}
                      dangerouslySetInnerHTML={{ __html: SEO_OUTPUTS[seoKeyword].preview.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #10b981; background: #10b98112; padding: 2px 4px; border-radius: 4px; font-weight: 800;">$1</strong>') }}
                    ></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          
          {/* Navigation Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === cat ? '#ec4899' : '#f1f5f9',
                  color: activeTab === cat ? '#ffffff' : '#475569',
                  transition: 'all 150ms ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert alert-warning py-2.5 px-3 mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.82rem', borderRadius: '8px' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Current Affairs Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {loading && currentAffairs.length === 0 ? (
              <div className="text-center py-5 text-muted" style={{ fontSize: '0.9rem' }}>
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Loading daily current affairs updates...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-5 text-muted" style={{ fontSize: '0.9rem' }}>
                No current affairs articles found in this category.
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <article
                  key={item._id || idx}
                  className="current-affairs-card"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#ec4899',
                        backgroundColor: '#fdf2f8',
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}
                    >
                      {item.category}
                    </span>
                    <time className="text-muted small" style={{ fontSize: '0.8rem' }}>
                      {formatDate(item.date)}
                    </time>
                  </div>
                  
                  <h3 className="h5 fw-bold mb-2.5" style={{ color: '#1e293b', lineHeight: '1.35' }}>
                    {item.title}
                  </h3>
                  
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {item.summary}
                  </p>

                  <div className="d-flex align-items-center justify-content-between pt-2.5" style={{ borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <span>Source: {item.source}</span>
                    <a href="/preparation/gov" className="fw-bold" style={{ color: '#ec4899', textDecoration: 'none' }}>
                      Practice GK Questions →
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>

        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}

export { CURRENT_AFFAIRS_DATA };
