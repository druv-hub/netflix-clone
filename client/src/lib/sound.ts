/**
 * Web Audio API synthesizer for the iconic Netflix "Ta-Dum" sound effect.
 * Runs 100% locally in the browser with zero external audio asset dependencies!
 */
export function playNetflixTadum() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Booom (The Initial Impact)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);
    
    subGain.gain.setValueAtTime(0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.5);

    // 2. First "Ta" Hit (Metallic / Cinematic String Attack at t=0)
    const hit1Freqs = [130.81, 196.00, 261.63, 392.00]; // C3 chord
    hit1Freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Low pass filter for warm cinematic feel
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.8);

      gain.gain.setValueAtTime(0.25 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    });

    // 3. Second "DUM" Resonant Chord (at t = 0.28s) - The Signature Deep Climax
    const hit2Time = now + 0.28;
    const hit2Freqs = [65.41, 98.00, 130.81, 164.81, 196.00, 329.63]; // C2 / E / G Rich Power Chord
    
    hit2Freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx < 2 ? "triangle" : "sawtooth";
      osc.frequency.setValueAtTime(freq, hit2Time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, hit2Time + 2.5);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, hit2Time);
      filter.frequency.exponentialRampToValueAtTime(150, hit2Time + 2.5);

      gain.gain.setValueAtTime(0.4 / (idx + 1), hit2Time);
      gain.gain.exponentialRampToValueAtTime(0.0001, hit2Time + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(hit2Time);
      osc.stop(hit2Time + 3.2);
    });

    // 4. Subtle Shimmer / Swell Reverb Tail
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2.5, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(800, hit2Time);
    noiseFilter.Q.setValueAtTime(3, hit2Time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, hit2Time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, hit2Time + 2.4);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(hit2Time);
    whiteNoise.stop(hit2Time + 2.5);

  } catch (err) {
    console.warn("Netflix Ta-Dum audio could not play:", err);
  }
}
