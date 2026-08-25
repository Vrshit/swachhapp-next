import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { TRAINING_QUESTIONS, completeTraining, getCurrentUser } from '@/lib/store';
import type { User } from '@/lib/types';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  Download,
  Info,
  Sparkles,
  Award,
  BookOpen,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export default function TrainingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(TRAINING_QUESTIONS.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) return null;

  const q = TRAINING_QUESTIONS[currentQ];

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmitAnswer = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQ < TRAINING_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      const finalAnswers = [...answers];
      finalAnswers[currentQ] = selected;
      let s = 0;
      finalAnswers.forEach((a, i) => {
        if (a === TRAINING_QUESTIONS[i].correctAnswer) s++;
      });
      setScore(s);
      try {
        completeTraining(s);
      } catch (e) {
        console.error('Training save error:', e);
      }
      setShowResult(true);
    }
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1000, 640);
    bgGradient.addColorStop(0, '#f9fdfa');
    bgGradient.addColorStop(1, '#eaf7ec');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1000, 640);

    // Outer Golden-Emerald Border
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, 952, 592);

    // Inner Delicate Border
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, 928, 568);

    // Top Header Badge
    ctx.fillStyle = '#166534';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF INDIA • SMART INDIA HACKATHON 2026', 500, 75);

    // Main Certificate Title
    ctx.fillStyle = '#14532d';
    ctx.font = '900 36px Inter, sans-serif';
    ctx.fillText('CERTIFICATE OF RECOGNITION', 500, 125);

    ctx.fillStyle = '#15803d';
    ctx.font = '600 18px Inter, sans-serif';
    ctx.fillText('National Citizen Waste Segregation & Bio-Energy Training Program', 500, 160);

    // Divider
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(250, 185);
    ctx.lineTo(750, 185);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#374151';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('This is proudly conferred upon', 500, 230);

    // Candidate Name
    ctx.fillStyle = '#0f391b';
    ctx.font = '900 38px Inter, sans-serif';
    ctx.fillText(user.name.toUpperCase(), 500, 285);

    // Description text
    ctx.fillStyle = '#4b5563';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('for successfully completing the rigorous 3-Tier Municipal Waste Management Program,', 500, 335);
    ctx.fillText(`demonstrating excellence with a certified score of ${score} / ${TRAINING_QUESTIONS.length}.`, 500, 365);
    ctx.fillText('Authorized to act as an accredited "Green Champion" for urban local bodies.', 500, 395);

    // Gold Seal Medal Graphic
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(500, 470, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('VERIFIED', 500, 468);
    ctx.fillText('SIH 2026', 500, 482);

    // Signatures
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('Swachh Bharat Mission Coordinator', 240, 550);
    ctx.fillText('Municipal Council Director', 760, 550);

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, 530);
    ctx.lineTo(340, 530);
    ctx.moveTo(660, 530);
    ctx.lineTo(860, 530);
    ctx.stroke();

    // Date & Certificate ID
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    const dateStr = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillText(`Issue Date: ${dateStr} • ID: SWA-${user.id.slice(0, 8).toUpperCase()}`, 500, 595);

    // Download
    const link = document.createElement('a');
    link.download = `SwachhApp_Green_Champion_${user.name.replace(/\s/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (showResult) {
    const passed = score >= 3;
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-8 px-4 text-center">
          <div className="clay-card-3d p-8 sm:p-12 text-center space-y-6">
            <div
              className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
                passed
                  ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-[0_10px_30px_rgba(22,163,74,0.35)]'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.35)]'
              }`}
            >
              {passed ? <Trophy size={48} /> : <RotateCcw size={48} />}
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Training Assessment Result
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
                {passed ? 'Congratulations, Green Champion! 🎉' : 'Keep Learning, Citizen!'}
              </h1>
              <p className="text-gray-600 text-base mt-2">
                You achieved a score of{' '}
                <span className="font-extrabold text-emerald-700 text-xl">{score}</span> out of{' '}
                <span className="font-bold text-gray-800">{TRAINING_QUESTIONS.length}</span>
              </p>
            </div>

            {passed ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-sm text-emerald-900 font-bold">
                ✅ You have successfully unlocked the <b>Reporter & Champion Tier</b> and can now
                download your government-ready digital certificate.
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-amber-900 font-bold">
                ⚠️ A minimum score of 3/5 is required for official certification. Review your answers
                below and retake the module.
              </div>
            )}

            {/* Answer Breakdown Panel */}
            <div className="text-left bg-white/80 rounded-2xl border border-gray-200/80 p-5 space-y-3 shadow-inner">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-700" />
                <span>Question Review & Explanations</span>
              </h3>
              <div className="space-y-3">
                {TRAINING_QUESTIONS.map((tq, i) => {
                  const finalAnswers2 = [...answers];
                  finalAnswers2[TRAINING_QUESTIONS.length - 1] = selected;
                  const userAns = finalAnswers2[i];
                  const correct = userAns === tq.correctAnswer;
                  return (
                    <div
                      key={tq.id}
                      className={`p-3.5 rounded-2xl text-xs ${
                        correct
                          ? 'bg-emerald-50/80 border border-emerald-200'
                          : 'bg-red-50/80 border border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {correct ? (
                          <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{tq.question}</p>
                          {!correct && (
                            <p className="text-red-700 font-semibold mt-1">
                              Your answer: {tq.options[userAns ?? 0]} • Correct:{' '}
                              {tq.options[tq.correctAnswer]}
                            </p>
                          )}
                          <p className="text-gray-600 mt-1 italic">💡 {tq.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                href="/dashboard"
                className="glass-card-3d hover:bg-white text-gray-800 font-bold px-6 py-3.5 text-sm rounded-full flex items-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
              {passed ? (
                <button
                  onClick={handleDownloadCertificate}
                  className="clay-btn-green text-white font-extrabold px-7 py-3.5 text-sm flex items-center gap-2.5 shine-sweep-effect shadow-lg"
                >
                  <Download size={16} />
                  <span>Download Verified Certificate (PNG)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentQ(0);
                    setSelected(null);
                    setSubmitted(false);
                    setAnswers(new Array(TRAINING_QUESTIONS.length).fill(null));
                    setScore(0);
                    setShowResult(false);
                  }}
                  className="clay-btn-green text-white font-extrabold px-7 py-3.5 text-sm flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  <span>Retake Training</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── 3D Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-2">
              <Sparkles size={14} />
              <span>Interactive 3D Curriculum</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Waste Management Awareness Training
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Learn waste segregation, home bio-composting, and earn your Green Champion badge.
            </p>
          </div>

          <div className="glass-card-3d rounded-2xl px-4 py-2 flex items-center gap-2 self-start border border-white">
            <span className="text-xs font-extrabold text-emerald-800">
              Module {currentQ + 1} / {TRAINING_QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* ── 3D Step Progress Bar ── */}
        <div className="w-full bg-gray-200/80 rounded-full h-3 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${((currentQ + 1) / TRAINING_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* ── 3D Claymorphic Question Card ── */}
        <div className="clay-card-3d p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
              Question 0{currentQ + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-snug">
              {q.question}
            </h2>
          </div>

          {/* Option Buttons */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let style = 'border-gray-200/80 bg-white/70 hover:border-emerald-300 text-gray-800';
              if (selected === idx && !submitted) {
                style = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300 scale-[1.01]';
              }
              if (submitted) {
                if (idx === q.correctAnswer) {
                  style = 'border-emerald-600 bg-emerald-100/90 text-emerald-950 font-bold';
                } else if (idx === selected && idx !== q.correctAnswer) {
                  style = 'border-red-500 bg-red-50 text-red-950';
                } else {
                  style = 'border-gray-200 opacity-50 bg-gray-50 text-gray-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between shadow-sm ${style}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-white/80 border border-current flex items-center justify-center text-xs font-black shadow-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-bold">{opt}</span>
                  </div>

                  {submitted && idx === q.correctAnswer && (
                    <CheckCircle2 size={20} className="text-emerald-700 flex-shrink-0" />
                  )}
                  {submitted && idx === selected && idx !== q.correctAnswer && (
                    <XCircle size={20} className="text-red-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-1 animate-float-3d">
              <div className="flex items-center gap-2 font-extrabold text-xs text-emerald-800">
                <Info size={16} />
                <span>Official Environmental Guideline</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            {!submitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selected === null}
                className="clay-btn-green text-white font-extrabold px-8 py-3.5 text-sm flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none shine-sweep-effect"
              >
                <span>Check Answer</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="clay-btn-green text-white font-extrabold px-8 py-3.5 text-sm flex items-center gap-2 shine-sweep-effect"
              >
                <span>
                  {currentQ < TRAINING_QUESTIONS.length - 1 ? 'Next Question' : 'View My Score & Certificate'}
                </span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
