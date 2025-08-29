import { VerificationHeader } from "../components/VerificationHeader";
import { VerificationCards } from "../components/VerificationCards";

interface VerificationQueueProps {
  onNewsSelect?: (newsId: number) => void;
}

export function VerificationQueue({ onNewsSelect }: VerificationQueueProps) {
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <VerificationHeader />
        
        {/* Verification Cards */}
        <VerificationCards onNewsSelect={onNewsSelect} />
      </div>
    </div>
  );
}