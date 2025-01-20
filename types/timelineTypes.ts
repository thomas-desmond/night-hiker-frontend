export interface AstronomicalEvent {
    type: 'sunset' | 'moonrise' | 'moonpeak' | 'moonset';
    datetime: Date;
  }
  
  export interface TimelineProps {
    events: AstronomicalEvent[];
  }
  
  