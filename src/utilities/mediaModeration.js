/**
 * Frontend-only content moderation helpers for Squad MEDIA.
 *
 * Goal:
 * - Any post that looks like a job advertisement should NOT be published.
 * - Suspected job-post content should be sent to Pending for customer service verification.
 *
 * Note: This is heuristic-based (keywords + patterns). Backend should re-check.
 */

const leetNormalize = (s) =>
  (s || '')
    .replace(/0/g, 'o')
    .replace(/[1!]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a');

const compact = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const normalize = (text) => {
  const t = leetNormalize(String(text || '').toLowerCase());
  return {
    raw: t,
    compact: compact(t), // catches "h i r i n g" and punctuation splits
  };
};

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/; // loose on purpose

const MONEY_RE = /(\$|aud|per\s*hour|hourly|\/\s*h|\/\s*hr|per\s*day|daily\s*rate)/i;
const APPLY_RE = /\b(apply|resume|cv|send\s*your\s*cv|email\s*your\s*cv|dm\s*to\s*apply)\b/i;
const HIRING_RE = /\b(hiring|vacancy|job\s*available|position\s*available|we\s*are\s*hiring|staff\s*needed|recruiting)\b/i;
const SHIFT_RE = /\b(shift|start\s*(today|tomorrow)|immediate\s*start|mon|tue|wed|thu|fri|sat|sun|weekend|public\s*holiday)\b/i;

/**
 * @param {string} text
 * @returns {{score: number, isSuspectedJobPost: boolean, reasons: string[]}}
 */
export const scoreJobPostSuspicion = (text) => {
  const { raw, compact: c } = normalize(text);

  let score = 0;
  const reasons = [];

  const bump = (pts, reason) => {
    score += pts;
    if (reason) reasons.push(reason);
  };

  // Strong signals
  if (HIRING_RE.test(raw) || /(hiring|vacancy|jobavailable|positionavailable|staffneeded|recruiting)/.test(c)) {
    bump(5, 'Hiring/vacancy keywords detected');
  }

  if (APPLY_RE.test(raw) || /(applynow|sendcv|sendresume|emailyourcv|dmt oapply|dmtoapply)/.test(c)) {
    bump(4, 'Apply/resume call-to-action detected');
  }

  if (EMAIL_RE.test(raw)) bump(4, 'Email detected');
  if (PHONE_RE.test(raw)) bump(4, 'Phone number detected');
  if (MONEY_RE.test(raw) || /\$\s*\d+/.test(raw)) bump(3, 'Pay/rate pattern detected');

  // Medium signals
  if (SHIFT_RE.test(raw) || /(shift|immediatestart)/.test(c)) bump(2, 'Shift/start-time keywords detected');
  if (/\b(abn|tfn|tax)\b/i.test(raw) || /(abn|tfn|tax)/.test(c)) bump(2, 'Tax keywords detected');

  // If text is very short, reduce false positives a bit
  if ((raw || '').trim().length < 15) score = Math.max(0, score - 1);

  // Threshold tuned for "better safe than sorry" in MEDIA
  const isSuspectedJobPost = score >= 6;

  return { score, isSuspectedJobPost, reasons };
};

