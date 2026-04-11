"use client"
import type { Programme } from '@/types';
import { ProgrammeCard } from './ProgrammeCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardContent } from '../ui/card';


interface AvailableProgrammesProps {
  programmes: Programme[];
  onEnrol?: (id: string) => void;
}

export function AvailableProgrammes({ programmes, onEnrol }: AvailableProgrammesProps) {
  return (
    <section>
      <SectionHeading title="Available Programmes" />
      {programmes.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-xs text-muted-foreground">No programmes available right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme._id} programme={programme} onEnrol={onEnrol} />
          ))}
        </div>
      )}
    </section>
  );
}