import { Zap } from "lucide-react";

export default function InstantBookBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-full shadow-md">
      <Zap className="h-4 w-4 fill-current" />
      <span>Instant Book</span>
    </div>
  );
}
