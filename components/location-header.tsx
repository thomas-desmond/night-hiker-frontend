"use client";

import { MapPin } from "lucide-react";

export function LocationHeader() {
  return (
    <header className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Night Hiking Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect moonlit nights for your hiking adventures
          </p>
        </div>
      </div>
    </header>
  );
}