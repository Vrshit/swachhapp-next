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
      // Calculate score
      let s = 0;
      answers.forEach((a, i) => {
        // use the latest answer for the last question
        const ans = i === currentQ ? selected : a;
        if (ans === TRAINING_QUESTIONS[i].correctAnswer) s++;
      });
      setScore(s);
      completeTraining(s);
      setShowResult(true);
    }
  };

  if (showResult) {
    const passed = score >= 3;
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {passed ? <Trophy size={40} /> : <RotateCcw size={40} />}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {passed ? 'Congratulations! 🎉' : 'Keep Trying!'}
          </h1>
          <p className="text-gray-600 mb-4">
            You scored <span className="font-bold text-lg">{score}</span> out of{' '}
            <span className="font-bold text-lg">{TRAINING_QUESTIONS.length}</span>
          </p>
          {passed ? (
            <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-6">
              ✅ Training completed! You're now a certified waste‑management aware citizen.
            </p>
          ) : (
            <p className="text-amber-700 bg-amber-50 rounded-xl px-4 py-3 mb-6">
              You need at least 3/5 to pass. Review the material and try again.
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Go to Dashboard
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQ(0);
                  setSelected(null);
                  setSubmitted(false);
                  setAnswers(new Array(TRAINING_QUESTIONS.length).fill(null));
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
        <div className="w-full bg-gray-200 rounded-full h-2">
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
