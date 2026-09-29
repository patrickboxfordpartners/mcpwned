let speaking = false;
let enabled = true;

export function setVoiceEnabled(on: boolean) {
  enabled = on;
  if (!on) stopSpeaking();
}

export function isVoiceEnabled() {
  return enabled;
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
  speaking = false;
}

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (!enabled || !window.speechSynthesis) return;

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);

  // WOPR voice: slow, low pitch, monotone
  utterance.rate = opts?.rate ?? 0.75;
  utterance.pitch = opts?.pitch ?? 0.3;
  utterance.volume = 0.8;

  // Prefer a robotic/male voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.includes("Daniel") ||
      v.name.includes("Alex") ||
      v.name.includes("Fred") ||
      v.name.includes("Samantha") ||
      v.name.includes("Google US English")
  );
  if (preferred) utterance.voice = preferred;

  speaking = true;
  utterance.onend = () => {
    speaking = false;
  };

  window.speechSynthesis.speak(utterance);
}

export function speakWopr(text: string) {
  speak(text, { rate: 0.65, pitch: 0.2 });
}

export function isSpeaking() {
  return speaking;
}
