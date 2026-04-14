import type { Programme } from '@/types';
import { MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { t } from '@/lib/i18n'; 

interface ProgrammeCardProps {
  programme: Programme;
  onEnrol?: (id: string) => void;
}

export function ProgrammeCard({ programme, onEnrol }: ProgrammeCardProps) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col flex-1 p-3.5">
        <p className="text-xs font-semibold text-foreground leading-snug mb-1">
          {programme.name}
        </p>

        <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
          {programme.duration} · {programme.mode}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {programme.location && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
              <MapPin className="size-2.5" />
              {programme.location}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2 ml-auto"
            disabled={!onEnrol}
            onClick={() => onEnrol?.(programme._id)}
          >
            {t('programme.enrol')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}