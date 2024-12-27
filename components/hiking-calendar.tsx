"use client";

import { useState } from 'react';
import Calendar from 'react-calendar';
import { Card } from '@/components/ui/card';
import { Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-calendar/dist/Calendar.css';

interface HikingDay {
  date: Date;
  moonIllumination: number;
  isGoodForHiking: boolean;
}

// Mock data - replace with actual data
const hikingDays: HikingDay[] = Array.from({ length: 31 }, (_, i) => ({
  date: new Date(2024, 0, i + 1),
  moonIllumination: Math.random() * 100,
  isGoodForHiking: Math.random() > 0.5,
}));

export function HikingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDateQuality = (date: Date): 'good' | 'medium' | 'poor' => {
    const hikingDay = hikingDays.find(
      day => day.date.toDateString() === date.toDateString()
    );
    
    if (!hikingDay) return 'poor';
    
    if (hikingDay.moonIllumination >= 80) return 'good';
    if (hikingDay.moonIllumination >= 50) return 'medium';
    return 'poor';
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const quality = getDateQuality(date);
    return cn(
      'relative hover:bg-muted/50',
      {
        'bg-green-500/20 dark:bg-green-500/30 hover:bg-green-500/30 dark:hover:bg-green-500/40 text-green-700 dark:text-green-300': quality === 'good',
        'bg-yellow-500/20 dark:bg-yellow-500/30 hover:bg-yellow-500/30 dark:hover:bg-yellow-500/40 text-yellow-700 dark:text-yellow-300': quality === 'medium',
        'bg-red-500/20 dark:bg-red-500/30 hover:bg-red-500/30 dark:hover:bg-red-500/40 text-red-700 dark:text-red-300': quality === 'poor',
      }
    );
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Moon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Hiking Calendar</h2>
      </div>
      
      <div className="calendar-container">
        <Calendar
          value={selectedDate}
          tileClassName={tileClassName}
          className="border-none shadow-none"
        />
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500/20 dark:bg-green-500/30" />
          <span className="text-green-700 dark:text-green-300">Excellent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500/20 dark:bg-yellow-500/30" />
          <span className="text-yellow-700 dark:text-yellow-300">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/20 dark:bg-red-500/30" />
          <span className="text-red-700 dark:text-red-300">Poor</span>
        </div>
      </div>
    </Card>
  );
}