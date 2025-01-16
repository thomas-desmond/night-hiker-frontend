"use client";

import { useState } from "react";
import { MapPin, Check } from "lucide-react";
import { Command } from "cmdk";
import { cn } from "@/lib/utils";
import { Location } from "@/types/location";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface LocationSearchProps {
  selected: Location;
  onSelect: (location: Location) => void;
}

// Mock locations - replace with actual location search API
const locations = [
  { id: "1", name: "Escondido", region: "CA", lat: 33.0893, long: -117.1153 },
  { id: "2", name: "San Diego", region: "CA", lat: 32.7157, long: -117.1611 },
  { id: "3", name: "Los Angeles", region: "CA", lat: 34.0522, long: -118.2437 },
];

export function LocationSearch({ selected, onSelect }: LocationSearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          disabled={true}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {selected ? `${selected.name}, ${selected.region}` : "Select location..."}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <CommandPrimitive>
          <CommandInput placeholder="Search locations..." />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup>
            {locations.map((location) => (
              <CommandItem
                key={location.id}
                value={`${location.name}, ${location.region}`}
                onSelect={() => {
                  onSelect(location);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.id === location.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {location.name}, {location.region}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  );
}