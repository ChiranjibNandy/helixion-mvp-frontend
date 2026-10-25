import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createProgramFormData } from "@/constants/training-provider";
import { t } from "@/lib/i18n";
import { ArrowLeftRight } from "lucide-react";

interface LivePreviewProps {
  data: createProgramFormData;
}

export default function LivePreview({ data }: LivePreviewProps) {
  const enabledStays = data.stayTypes.filter((s) => s.enabled);

  return (
    <div className="bg-bgCard border border-borderCard rounded-lg p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-textSidebarMuted uppercase tracking-wider mb-0.5">{t('programme.livePreview')}</p>
          <p className="text-xs text-textMuted">{t('programme.howToSee')}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-3 border-borderDark text-textSecondary hover:bg-bgButton"
        >
          {t('button.preview')}
        </Button>
      </div>

      <Separator className="bg-borderDark" />

      {/* Preview Card */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {data.title || t('programme.defaultTitle')}
          </h3>
          <p className="text-sm text-textSidebarMuted mt-0.5">
            {data.venue ? `Venue — ${ data.venue }` : t('programme.defaultVenue')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-textSidebarMuted mb-1">{t('programme.fields.start')}</p>
            <p className="text-sm text-textSecondary">{data.startDate || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-textSidebarMuted mb-1">{t('programme.fields.end')}</p>
            <p className="text-sm text-textSecondary">{data.endDate || "—"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-textSidebarMuted mb-1">{t('programme.fields.capacity')}</p>
          <p className="text-sm text-textSecondary">
            {data.minParticipants || data.maxParticipants
              ? `${ data.minParticipants || "?" } / ${ data.maxParticipants || "?" }`
              : "— / —"}
          </p>
        </div>

        {enabledStays.length > 0 && (
          <div>
            <p className="text-xs text-textSidebarMuted mb-2">{t('programme.fields.fees')}</p>
            <div className="space-y-2">
              {enabledStays.map((stay) =>
                stay.options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-textSidebarMuted">{stay.label}</p>
                      <p className="text-sm text-textSecondary">{opt.label}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {opt.price && (
                        <span className="text-sm text-textSecondary">₹{opt.price}</span>
                      )}
                      <ArrowLeftRight className="w-3.5 h-3.5 text-textSidebarMuted" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {enabledStays.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {enabledStays.map((stay) => (
              <Badge
                key={stay.id}
                variant="secondary"
                className="bg-bgStatCard text-textSecondary border border-borderDark text-xs"
              >
                {stay.label}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}