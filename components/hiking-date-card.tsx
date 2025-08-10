"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Star, Clock, Sunrise } from "lucide-react";
import { HikingDate } from "@/types/hiking";
import { ActivityMode } from "@/types/hiking";

interface HikingDateCardProps {
  date: HikingDate;
  mode: ActivityMode;
}

export function HikingDateCard({ date, mode }: HikingDateCardProps) {
  const isHikingMode = mode === "hiking";
  const isGoodForActivity = isHikingMode ? date.isGoodForHiking : date.isGoodForStarGazing;
  const reason = isHikingMode ? date.reason : date.starGazingReason;
  const activityIcon = isHikingMode ? Moon : Star;
  const activityLabel = isHikingMode ? "Hiking" : "Star Gazing";

  const getStatusColor = (status: "Yes" | "No" | "Partial") => {
    switch (status) {
      case "Yes":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100";
      case "Partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100";
      case "No":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100";
    }
  };

  const getStatusText = (status: "Yes" | "No" | "Partial") => {
    if (isHikingMode) {
      switch (status) {
        case "Yes":
          return "Good for Hiking";
        case "Partial":
          return "Okay for Hiking";
        case "No":
          return "Not Recommended";
      }
    } else {
      switch (status) {
        case "Yes":
          return "Perfect for Star Gazing";
        case "Partial":
          return "Good for Star Gazing";
        case "No":
          return "Poor for Star Gazing";
      }
    }
  };

  return (
    <Card className="group transition-all hover:ring-2 hover:ring-primary/20">
      {/* Main Content */}
      <div className={`p-4 ${
        isGoodForActivity === "Yes"
          ? "bg-gradient-to-br from-green-500/10 to-green-500/5"
          : isGoodForActivity === "Partial"
          ? "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5"
          : "bg-gradient-to-br from-red-500/10 to-red-500/5"
      }`}>
        {/* Date and Status */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold">
              {date.date.toFormat("MMM dd")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {date.date.toFormat("yyyy")}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(isGoodForActivity)}`}
          >
            {getStatusText(isGoodForActivity)}
          </div>
        </div>

        {/* Moon Info */}
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-4 h-4" />
          <div className="text-sm font-medium">
            {Math.round(date.moonIllumination)}% illumination
          </div>
        </div>

        {/* Activity-specific info */}
        <div className="flex items-center gap-2 mb-4">
          {isHikingMode ? <Moon className="w-4 h-4" /> : <Star className="w-4 h-4" />}
          <div className="text-sm font-medium">
            {isHikingMode ? "Hiking Conditions" : "Star Gazing Conditions"}
          </div>
        </div>

        {/* Best Time Window - Only show if good or partial */}
        {(isGoodForActivity === "Yes" || isGoodForActivity === "Partial") && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Best Time Window:</span>
            </div>
            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
              {date.moonRiseTime && (
                <div className="flex items-center gap-2">
                  <Sunrise className="w-3 h-3" />
                  <span>Moonrise: {date.moonRiseTime.toFormat("HH:mm")}</span>
                </div>
              )}
              {date.moonSetTime && (
                <div className="flex items-center gap-2">
                  <Sunrise className="w-3 h-3 rotate-180" />
                  <span>Moonset: {date.moonSetTime.toFormat("HH:mm")}</span>
                </div>
              )}
              {date.sunsetTime && (
                <div className="flex items-center gap-2">
                  <Sunrise className="w-3 h-3" />
                  <span>Sunset: {date.sunsetTime.toFormat("HH:mm")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="text-sm text-muted-foreground">
          {reason}
        </div>
      </div>
    </Card>
  );
}
