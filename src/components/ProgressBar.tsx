import { cn } from "../lib/utils";

interface Step {
  id: number;
  label: string;
}

interface ProgressBarProps {
  activeStep: number;
}

export default function ProgressBar({ activeStep }: ProgressBarProps) {
  const steps: Step[] = [
    { id: 1, label: "Campaign Details" },
    { id: 2, label: "Select Objective" },
    { id: 3, label: "Choose Audience" },
    { id: 4, label: "Create Email Content" },
    { id: 5, label: "Schedule Campaign" },
    { id: 6, label: "Review & Launch" },
  ];

  return (
    <nav className="flex flex-col w-full items-center mb-8">
      <div className="relative w-full max-w-[897px] h-[65px]">
        {/* Base gray line */}
        <div className="absolute w-full h-2 top-[29px] left-0.5 bg-[#17171b33] rounded-full" />

        {/* Dynamic black progress line */}
        <div
          className="absolute h-2 top-[29px] left-0.5 bg-zinc-900 rounded-full transition-all duration-300"
          style={{
            width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        <div className="flex items-center justify-between w-full">
          {steps.map((step) => (
            <div
              key={step.id}
              className="inline-flex items-center gap-[5.61px] p-[2.24px] relative rounded-[43px]"
            >
              <div
                className={cn(
                  "flex w-[60.2px] h-[60.2px] items-center justify-center gap-[5.61px] p-[13.46px] relative rounded-[43px] border-[0.56px] border-solid border-zinc-200",
                  activeStep >= step.id ? "bg-zinc-900" : "bg-white"
                )}
              >
                <div
                  className={cn(
                    "relative w-fit mt-[-0.56px] font-semibold text-[16.8px] tracking-[0] leading-[20.2px] whitespace-nowrap",
                    activeStep >= step.id ? "text-white" : "text-zinc-950"
                  )}
                >
                  {step.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step labels */}
      <div className="flex items-center justify-between w-full max-w-[897px] mt-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "relative w-fit text-sm tracking-[0] leading-6 whitespace-nowrap",
              activeStep >= step.id
                ? "font-medium text-zinc-900"
                : "font-normal text-zinc-500"
            )}
          >
            {step.label}
          </div>
        ))}
      </div>
    </nav>
  );
}
