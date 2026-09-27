'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload, ArrowLeft, Save, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import InputField, { Label } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import PageHeader from "@/components/ui/pageHeader";
import StayOptionRow from "./Stay-option-row"; 

interface BaseProgramFormProps {
   mode: 'create' | 'edit' | 'draft';
   title: string;
   description: string;
   formState: any;
   onFieldChange: (key: string, value: any) => void;
   onToggleStayType: (stayId: string) => void;
   onUpdateOptionPrice: (stayId: string, optionId: string, price: string) => void;
   onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSubmitDraft?: () => void;
   onSubmitPublish?: () => void;
   onSubmitEdit?: () => void;
   onBack?: () => void;
   loading?: boolean;
   backLabel?: string;
   rightPanel?: React.ReactNode;
}

export default function BaseProgramForm({
   mode,
   title,
   description,
   formState,
   onFieldChange,
   onToggleStayType,
   onUpdateOptionPrice,
   onFileChange,
   onSubmitDraft,
   onSubmitPublish,
   onSubmitEdit,
   onBack,
   loading,
   backLabel,
   rightPanel,
}: BaseProgramFormProps) {
   const isEditMode = mode === 'edit';

   return (
      <div className="min-h-screen px-6 py-8 text-white font-sans">
         {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4 self-start">
               <ArrowLeft size={16} className="mr-1.5" />
               {backLabel || 'Back'}
            </Button>
         )}

         <PageHeader title={title} description={description} />

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mt-4">
            {/* Left: Form Fields */}
            <div className="bg-bgCard border border-borderCard rounded-lg p-6 space-y-5">
               <div>
                  <p className="text-xs font-medium text-textSecondary mb-0.5">{t('programme.createdetailsTitle')}</p>
                  <p className="text-xs text-textSidebarMuted">{t('programme.createdetailsDescription')}</p>
               </div>

               <Separator className="bg-borderDark" />

               {/* Program Title (Editable in all modes) */}
               <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <Label className="pt-2 text-sm text-textMuted">{t('programme.fields.programTitle')}*</Label>
                  <InputField
                     value={formState.title || ''}
                     onChange={(e) => onFieldChange("title", e.target.value)}
                     placeholder={t('programme.fields.programTitlePlaceholder')}
                     className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm"
                  />
               </div>

               {/* Program Dates (Frozen in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <Label className="pt-2 text-sm text-textMuted">{t('programme.fields.programDates')}*</Label>
                  <div className="grid grid-cols-2 gap-2">
                     <InputField
                        type="date"
                        value={formState.startDate}
                        disabled={isEditMode}
                        onChange={(e) => onFieldChange("startDate", e.target.value)}
                        className={cn("bg-inputBg border-borderDark text-textSecondary h-9 text-sm", isEditMode && "opacity-60 cursor-not-allowed")}
                     />
                     <InputField
                        type="date"
                        value={formState.endDate}
                        disabled={isEditMode}
                        onChange={(e) => onFieldChange("endDate", e.target.value)}
                        className={cn("bg-inputBg border-borderDark text-textSecondary h-9 text-sm", isEditMode && "opacity-60 cursor-not-allowed")}
                     />
                  </div>
               </div>

               {/* Venue (Frozen in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <Label className="pt-2 text-sm text-textMuted">{t('programme.fields.venue')}*</Label>
                  <InputField
                     value={formState.venue}
                     disabled={isEditMode}
                     onChange={(e) => onFieldChange("venue", e.target.value)}
                     placeholder={t('programme.fields.venuePlaceholder')}
                     className={cn("bg-inputBg border-borderDark text-textSecondary h-9 text-sm", isEditMode && "opacity-60 cursor-not-allowed")}
                  />
               </div>

               {/* City (Frozen in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <Label className="pt-2 text-sm text-textMuted">{t('programme.fields.city')}</Label>
                  <InputField
                     value={formState.city}
                     disabled={isEditMode}
                     onChange={(e) => onFieldChange("city", e.target.value)}
                     placeholder={t('programme.fields.cityPlaceholder')}
                     className={cn("bg-inputBg border-borderDark text-textSecondary h-9 text-sm", isEditMode && "opacity-60 cursor-not-allowed")}
                  />
               </div>

               {/* Stay Types & Fees (Frozen in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <div className="pt-2">
                     <Label className="text-sm text-textMuted">{t('programme.fields.stayType')}</Label>
                     <p className="text-xs text-textSidebarMuted mt-0.5">{t('programme.fields.programFee')}</p>
                  </div>
                  <div className={cn("space-y-3", isEditMode && "opacity-60 pointer-events-none")}>
                     {formState.stayTypes?.map((stay: any) => (
                        <div key={stay.id} className="space-y-2">
                           <div className="flex items-center gap-2">
                              <Checkbox
                                 id={stay.id}
                                 checked={stay.enabled}
                                 disabled={isEditMode}
                                 onCheckedChange={() => onToggleStayType(stay.id)}
                                 className="border-borderDark data-[state=checked]:bg-primary data-[state=checked]:border-primary w-3.5 h-3.5"
                              />
                              <label htmlFor={stay.id} className="text-sm text-textSecondary font-medium cursor-pointer select-none">
                                 {stay.label}
                              </label>
                           </div>

                           {stay.enabled && (
                              <div className="space-y-2 pl-2">
                                 {stay.options.map((opt: any) => (
                                    <StayOptionRow
                                       key={opt.id}
                                       option={opt}
                                       parentEnabled={stay.enabled}
                                       onPriceChange={(optId, price) => onUpdateOptionPrice(stay.id, optId, price)}
                                    />
                                 ))}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Attach Brochure (Frozen in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <Label className="pt-2 text-sm text-textMuted">{t('programme.fields.attachBrochure')}*</Label>
                  <div>
                     <label
                        htmlFor="brochure-upload"
                        className={cn(
                           "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-borderDark text-sm transition-colors",
                           isEditMode 
                              ? "opacity-50 cursor-not-allowed bg-bgButton/50 text-textSidebarMuted" 
                              : "bg-bgButton hover:bg-bgButtonHover text-textSecondary cursor-pointer"
                        )}
                     >
                        <Upload className="w-3.5 h-3.5" />
                        {t('button.browse')}
                     </label>
                     <input
                        id="brochure-upload"
                        type="file"
                        disabled={isEditMode}
                        accept=".pdf,.doc,.docx"
                        onChange={onFileChange}
                        className="hidden"
                     />
                     {formState.brochureFile?.name && (
                        <p className="text-xs text-textMuted mt-1.5">{formState.brochureFile.name}</p>
                     )}
                  </div>
               </div>

               {/* Minimum Participants (Editable in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <div className="pt-2">
                     <Label className="text-sm text-textMuted">{t('programme.fields.minimumParticipants')}</Label>
                  </div>
                  <InputField
                     type="number"
                     value={formState.minParticipants}
                     onChange={(e) => onFieldChange("minParticipants", e.target.value)}
                     className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm w-40"
                  />
               </div>

               {/* Maximum Participants (Editable in edit mode) */}
               <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <div className="pt-2">
                     <Label className="text-sm text-textMuted">{t('programme.fields.maximumParticipants')}</Label>
                  </div>
                  <InputField
                     type="number"
                     value={formState.maxParticipants}
                     onChange={(e) => onFieldChange("maxParticipants", e.target.value)}
                     className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm w-40"
                  />
               </div>

               <Separator className="bg-borderDark" />

               {/* Action Buttons based on mode */}
               <div className="flex items-center justify-end gap-3 pt-1">
                  {mode === 'create' || mode === 'draft' ? (
                     <>
                        <Button variant="outline" onClick={onSubmitDraft} disabled={loading} className="h-9 px-4 text-sm border-borderDark text-textSecondary hover:bg-bgButton">
                           <Save size={14} className="mr-1.5" /> {t("button.saveDraft")}
                        </Button>
                        <Button onClick={onSubmitPublish} disabled={loading} className="bg-primary hover:bg-primaryDark text-white h-9 px-4 text-sm">
                           <Send size={14} className="mr-1.5" /> {t("programme.publishProgram")}
                        </Button>
                     </>
                  ) : (
                     <Button onClick={onSubmitEdit} disabled={loading} className="bg-primary hover:bg-primaryDark text-white h-9 px-4 text-sm">
                        <Save size={14} className="mr-1.5" /> Save Changes
                     </Button>
                  )}
               </div>
            </div>

            {/* Right: Panel / Live Preview */}
            {rightPanel && <div>{rightPanel}</div>}
         </div>
      </div>
   );
}