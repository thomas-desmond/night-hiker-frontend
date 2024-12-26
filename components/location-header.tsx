"use client";

import { MapPin } from "lucide-react";

export function LocationHeader() {
  return (
    <header className="max-w-4xl mx-auto space-y-2">
      <h1 className="text-4xl font-bold text-foreground">Night Hiking Guide</h1>
      <div className="flex items-center text-muted-foreground">
        <MapPin className="w-4 h-4 mr-2" />
        <span>Escondido, CA</span>
      </div>
    </header>
  );
}