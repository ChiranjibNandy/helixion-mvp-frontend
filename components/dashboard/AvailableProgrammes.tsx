import type { Programme } from '@/types';
import { ProgrammeCard } from './ProgrammeCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardContent } from '../ui/card';
import { t } from '@/lib/i18n';

interface AvailableProgrammesProps {
  programmes: Programme[];
  onEnrol?: (id: string) => void;
}

export function AvailableProgrammes({ programmes, onEnrol }: AvailableProgrammesProps) {
  return (
    <section>
      <SectionHeading title={t('programme.available')} />

      {programmes.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-xs text-muted-foreground">
              {t('programme.empty')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {programmes.map((programme) => (
            <ProgrammeCard
              key={programme._id}
              programme={programme}
              onEnrol={onEnrol}
            />
          ))}
        </div>
      )}
    </section>
  );
}