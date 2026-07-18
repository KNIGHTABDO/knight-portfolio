// Nocturnal Sound Synthesizer via Web Audio API
// No assets/external files required. All synthesized procedurally in-browser.

class SoundSynth {
    private ctx: AudioContext | null = null
    private ambientNode: AudioNode | null = null
    private isMuted: boolean = false
    private currentVolume: number = 0.3

    constructor() {
        // AudioContext is initialized lazily on user interaction
    }

    private getContext(): AudioContext {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
            this.ctx = new AudioContextClass()
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume()
        }
        return this.ctx
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted
        if (this.isMuted) {
            this.stopAmbient()
        } else {
            this.startAmbient()
        }
        return this.isMuted
    }

    public getMuteStatus(): boolean {
        return this.isMuted
    }

    //Procedural Wind Generator (Midnight Breeze)
    public startAmbient() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            this.stopAmbient()

            // 1. Generate White Noise Buffer
            const bufferSize = ctx.sampleRate * 2
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const output = noiseBuffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1
            }

            const noiseSource = ctx.createBufferSource()
            noiseSource.buffer = noiseBuffer
            noiseSource.loop = true

            // 2. Bandpass Filter to shape the wind
            const filter = ctx.createBiquadFilter()
            filter.type = 'bandpass'
            filter.Q.value = 3.0 // Resonant
            filter.frequency.value = 300

            // 3. Modulate wind frequency (LFO)
            const lfo = ctx.createOscillator()
            lfo.type = 'sine'
            lfo.frequency.value = 0.08 // Slow frequency sweeping (8 seconds)
            
            const lfoGain = ctx.createGain()
            lfoGain.gain.value = 150 // Sweep filter between 150Hz and 450Hz

            lfo.connect(lfoGain)
            lfoGain.connect(filter.frequency)
            lfo.start()

            // 4. Main gain node
            const mainGain = ctx.createGain()
            mainGain.gain.value = this.currentVolume * 0.05 // Soft background

            noiseSource.connect(filter)
            filter.connect(mainGain)
            mainGain.connect(ctx.destination)

            noiseSource.start()

            this.ambientNode = mainGain
        } catch (e) {
            console.error('Failed to start ambient wind sound:', e)
        }
    }

    public stopAmbient() {
        if (this.ambientNode) {
            try {
                this.ambientNode.disconnect()
            } catch {}
            this.ambientNode = null
        }
    }

    // Medieval wood navigation tick
    public playTick() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            const now = ctx.currentTime

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'triangle'
            // Rapid pitch drop to simulate wooden tap
            osc.frequency.setValueAtTime(600, now)
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.04)

            gain.gain.setValueAtTime(this.currentVolume * 0.2, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.05)
        } catch {}
    }

    // Codex page open paper rustle
    public playPageOpen() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            const now = ctx.currentTime

            // Procedural noise click + filter Sweep
            const bufferSize = ctx.sampleRate * 0.15 // 150ms
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const output = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1
            }

            const source = ctx.createBufferSource()
            source.buffer = buffer

            const filter = ctx.createBiquadFilter()
            filter.type = 'bandpass'
            filter.frequency.setValueAtTime(800, now)
            filter.frequency.exponentialRampToValueAtTime(2000, now + 0.12)

            const gain = ctx.createGain()
            gain.gain.setValueAtTime(this.currentVolume * 0.12, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

            source.connect(filter)
            filter.connect(gain)
            gain.connect(ctx.destination)

            source.start(now)
            source.stop(now + 0.16)
        } catch {}
    }

    // Two-note dulcimer pluck (A4 + E5)
    public playDulcimer() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            const now = ctx.currentTime

            const playString = (freq: number, delay: number) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.setValueAtTime(freq, now + delay)

                gain.gain.setValueAtTime(0, now + delay)
                gain.gain.linearRampToValueAtTime(this.currentVolume * 0.15, now + delay + 0.005)
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8)

                osc.connect(gain)
                gain.connect(ctx.destination)

                osc.start(now + delay)
                osc.stop(now + delay + 1.0)
            }

            playString(440.00, 0)      // A4
            playString(659.25, 0.04)   // E5 (slightly delayed)
        } catch {}
    }

    // Heartbeat low drum (Clinic path)
    public playHeartbeat() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            const now = ctx.currentTime

            const beat = (time: number) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.setValueAtTime(60, time)
                osc.frequency.exponentialRampToValueAtTime(10, time + 0.15)

                gain.gain.setValueAtTime(this.currentVolume * 0.4, time)
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)

                osc.connect(gain)
                gain.connect(ctx.destination)

                osc.start(time)
                osc.stop(time + 0.2)
            }

            beat(now)
            beat(now + 0.18) // Double pulse
        } catch {}
    }

    // Mechanical click relay (Workshop path)
    public playRelayClick() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            const now = ctx.currentTime

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'square'
            osc.frequency.setValueAtTime(1200, now)

            gain.gain.setValueAtTime(this.currentVolume * 0.04, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.02)
        } catch {}
    }

    // Spell cast / search incantation
    public playSpell() {
        if (this.isMuted) return
        try {
            const ctx = this.getContext()
            const now = ctx.currentTime

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'sine'
            osc.frequency.setValueAtTime(300, now)
            osc.frequency.exponentialRampToValueAtTime(1500, now + 0.4)

            gain.gain.setValueAtTime(0, now)
            gain.gain.linearRampToValueAtTime(this.currentVolume * 0.1, now + 0.05)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.5)
        } catch {}
    }
}

// Export singleton instance
export const sound = typeof window !== 'undefined' ? new SoundSynth() : null
