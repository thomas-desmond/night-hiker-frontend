"use client";

import { MountainSnow } from "lucide-react";

export function LocationHeader() {
  return (
    <header className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <div className="flex items-center gap-2">
              <MountainSnow className="w-10 h-10" />
              <span>MoonTrail Guide</span>
            </div>
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the best moonlit hiking nights
          </p>
        </div>
      </div>
    </header>
  );
}
