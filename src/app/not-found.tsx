import FuzzyText from "@/components/ui/FuzzyText";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#111111] flex items-center justify-center p-0 overflow-hidden w-full h-full select-none">
      <div className="flex items-center justify-center w-full max-w-full overflow-hidden">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.65}
          enableHover={true}
          color="#81D607"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontWeight={900}
          fontSize="min(25vw, 42vh)"
          fuzzRange={45}
          glitchMode={true}
          glitchInterval={1800}
          glitchDuration={200}
          clickEffect={true}
          className="cursor-pointer max-w-full"
        >
          404
        </FuzzyText>
      </div>
    </main>
  );
}
