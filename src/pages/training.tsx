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
} from 'lucide-react';

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
      // Calculate final score using committed answers array
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
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 460);

    // Inner border
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 440);

    // Title
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 32px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 400, 80);

    // Subtitle
    ctx.fillStyle = '#166534';
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.fillText('Waste Management Awareness Training', 400, 115);

    // Divider
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 135);
    ctx.lineTo(600, 135);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#374151';
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillText('This is to certify that', 400, 180);

    // Name
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 28px Inter, Arial, sans-serif';
    ctx.fillText(user.name, 400, 220);

    // Details
    ctx.fillStyle = '#374151';
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillText('has successfully completed the SwachhApp', 400, 265);
    ctx.fillText('Citizen Waste Management Training Program', 400, 290);
    ctx.fillText(`with a score of ${score} out of ${TRAINING_QUESTIONS.length}`, 400, 325);

    // Date
    ctx.font = '14px Inter, Arial, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 400, 370);

    // Footer
    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 14px Inter, Arial, sans-serif';
    ctx.fillText('♻ SwachhApp — Smart India Hackathon 2026', 400, 430);
    ctx.font = '11px Inter, Arial, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(`Certificate ID: SWA-${user.id.slice(0, 8).toUpperCase()}`, 400, 455);

    // Download
    const link = document.createElement('a');
    link.download = `SwachhApp_Certificate_${user.name.replace(/\\s/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (showResult) {
    const passed = score >= 3;
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {passed ? <Trophy size={40} /> : <RotateCcw size={40} />}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {passed ? 'Congratulations! 🎉' : 'Keep Trying!'}
          </h1>
          <p className="text-gray-600 mb-4">
            You scored{' '}
            <span className="font-bold text-lg">{score}</span> out of{' '}
            <span className="font-bold text-lg">{TRAINING_QUESTIONS.length}</span>
          </p>
          {passed ? (
            <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-6">
              ✅ Training completed! You're now a certified waste-management aware citizen.
            </p>
          ) : (
            <p className="text-amber-700 bg-amber-50 rounded-xl px-4 py-3 mb-6">
              You need at least 3/5 to pass. Review the material and try again.
            </p>
          )}

          {/* Answer Review */}
          <div className="text-left bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h3 className="font-semibold mb-3">📝 Answer Review</h3>
            <div className="space-y-3">
              {TRAINING_QUESTIONS.map((tq, i) => {
                const finalAnswers2 = [...answers];
                finalAnswers2[TRAINING_QUESTIONS.length - 1] = selected;
                const userAns = finalAnswers2[i];
                const correct = userAns === tq.correctAnswer;
                return (
                  <div
                    key={tq.id}
                    className={`p-3 rounded-xl text-sm ${
                      correct ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {correct ? (
                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{tq.question}</p>
                        {!correct && (
                          <p className="text-red-600 text-xs mt-1">
                            Your answer: {tq.options[userAns ?? 0]} → Correct: {tq.options[tq.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Go to Dashboard
            </button>
            {passed && (
              <button
                onClick={handleDownloadCertificate}
                className="flex items-center gap-2 border-2 border-primary-300 text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition"
              >
                <Download size={16} /> Download Certificate
              </button>
            )}
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQ(0);
                  setSelected(null);
                  setSubmitted(false);
                  setAnswers(new Array(TRAINING_QUESTIONS.length).fill(null));
                  setScore(0);
                  setShowResult(false);
                }}
                className="border-2 border-primary-300 text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition"
              >
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Waste Management Training</h1>
            <p className="text-sm text-gray-500">
              Question {currentQ + 1} of {TRAINING_QUESTIONS.length}
            </p>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={(currentQ + 1) / TRAINING_QUESTIONS.length * 100} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / TRAINING_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* ── Question card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-5">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let style = 'border-gray-200 hover:border-primary-300 hover:bg-primary-50';
              if (selected === idx && !submitted) {
                style = 'border-primary-500 bg-primary-50 ring-2 ring-primary-200';
              }
              if (submitted) {
                if (idx === q.correctAnswer) {
                  style = 'border-green-500 bg-green-50';
                } else if (idx === selected && idx !== q.correctAnswer) {
                  style = 'border-red-500 bg-red-50';
                } else {
                  style = 'border-gray-100 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition flex items-center gap-3 ${style}`}
                >
                  <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                  {submitted && idx === q.correctAnswer && (
                    <CheckCircle2 size={18} className="ml-auto text-green-600" />
                  )}
                  {submitted && idx === selected && idx !== q.correctAnswer && (
                    <XCircle size={18} className="ml-auto text-red-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Explanation (shown after submit) ── */}
          {submitted && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-2">
                <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Explanation</p>
                  <p className="text-sm text-blue-700 mt-1">{q.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selected === null}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              {currentQ < TRAINING_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
