/** Short tap when dice finish rolling (optional - gated by user preference). */
export const playRollDiceRevealSound = (): void => {
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

		oscillator.type = "triangle";
		oscillator.frequency.setValueAtTime(420, context.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(
			560,
			context.currentTime + 0.06,
		);

		gain.gain.setValueAtTime(0.0001, context.currentTime);
		gain.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.015);
		gain.gain.exponentialRampToValueAtTime(
			0.0001,
			context.currentTime + 0.16,
		);

		oscillator.connect(gain);
		gain.connect(context.destination);
		oscillator.start();
		oscillator.stop(context.currentTime + 0.18);
		oscillator.onended = () => {
			void context.close();
		};
	} catch {
		// Audio blocked or unavailable - ignore.
	}
};
