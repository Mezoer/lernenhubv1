/**
 * Sound hook — easy place to add a 'ding' (or wrong) sound later.
 * Wire to an Audio element or Howler/Web Audio when ready.
 */

export function useSound() {
  const playDing = () => {
    // TODO: Add correct-answer sound, e.g.:
    // const audio = new Audio('/sounds/ding.mp3');
    // audio.volume = 0.5;
    // audio.play().catch(() => {});
  };

  const playWrong = () => {
    // TODO: Add wrong-answer sound, e.g.:
    // const audio = new Audio('/sounds/wrong.mp3');
    // audio.volume = 0.4;
    // audio.play().catch(() => {});
  };

  return { playDing, playWrong };
}
