/** Short tap when coins finish flipping (optional - gated by user preference). */
export const playFlipCoinRevealSound = (): void => {
    if (typeof window === "undefined") {
        return;
    }

    const AudioContextCtor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
    if (!AudioContextCtor) {
        return;
    }

    try {
        const context = new AudioContextCtor();
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(520, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            680,
            context.currentTime + 0.05,
        );

        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + 0.14,
        );

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.16);
        oscillator.onended = () => {
            void context.close();
        };
    } catch {
        // Audio blocked or unavailable - ignore.
    }
};
