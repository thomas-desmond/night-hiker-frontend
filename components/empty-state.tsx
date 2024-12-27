"use client";

import { Moon, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Moon className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No hiking dates found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or selecting a different date range to find perfect nights for hiking.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Tip: Full moons typically offer the best visibility</span>
        </div>
      </div>
    </Card>
  );
}