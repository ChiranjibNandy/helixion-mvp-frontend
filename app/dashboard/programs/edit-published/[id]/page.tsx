'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import { Spinner } from '@/components/ui/spinner';
import { providerService } from '@/services/provider.service';
import { updatePublishedProgramAPI } from '@/services/programService';
import BaseProgramForm from '@/components/dashboard/programs/BaseProgram';
import AppModal from '@/components/ui/app-modal'; 

export default function EditPublishedProgram() {
   const router = useRouter();
   const params = useParams();
   const programId = params?.id as string;

   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);

   // Modal Control States
   const [modalState, setModalState] = useState<{
      isOpen: boolean;
      type: 'confirm' | 'success';
      title: string;
      description: string;
      error: string | null;
   }>({
      isOpen: false,
      type: 'confirm',
      title: '',
      description: '',
      error: null,
   });

   const [form, setForm] = useState({
      title: '',
      startDate: '',
      endDate: '',
      venue: '',
      city: '',
      stayTypes: [
         {
            id: 'residential',
            label: t('draftPrograms.labelResidential'),
            enabled: false,
            options: [
               { id: 'single_occupancy', label: t('programme.fields.singleOccupancy'), price: '' },
               { id: 'twin_sharing', label: t('programme.fields.twinSharing'), price: '' },
            ],
         },
         {
            id: 'non_residential',
            label: t('programme.fields.nonResidential'),
            enabled: false,
            options: [
               { id: 'non_residential', label: t('programme.fields.nonResidentialFee'), price: '' },
            ],
         },
      ],
      brochureFilename: '',
      minParticipants: 0,
      maxParticipants: 0,
   });

   useEffect(() => {
      const fetchProgram = async () => {
         try {
            setIsLoading(true);
            const program = await providerService.getDraftById(programId);

            const getStayOptionPrice = (options: any[], typeName: string) => {
               const found = options?.find((opt: any) => opt.type === typeName);
               return found ? String(found.price) : '';
            };
            const singleOccVal = getStayOptionPrice(program.stayOptions || [], 'single_occupancy');
            const twinShareVal = getStayOptionPrice(program.stayOptions || [], 'twin_sharing');
            const nonResVal = getStayOptionPrice(program.stayOptions || [], 'non_residential');

            const hasRes = !!singleOccVal || !!twinShareVal;
            const hasNonRes = !!nonResVal;

            let filename = '';
            if (program.brochureUrl) {
               const parts = program.brochureUrl.split('/');
               filename = parts[parts.length - 1] || 'brochure.pdf';
            }

            setForm({
               title: program.title || '',
               startDate: program.startDate ? program.startDate.split('T')[0] : '',
               endDate: program.endDate ? program.endDate.split('T')[0] : '',
               venue: program.venueName || '',
               city: program.city || '',
               brochureFilename: filename,
               stayTypes: [
                  {
                     id: 'residential',
                     label: t('draftPrograms.labelResidential'),
                     enabled: hasRes,
                     options: [
                        { id: 'single_occupancy', label: t('trainingEnrolment.programDetails.singleOccupancy'), price: singleOccVal },
                        { id: 'twin_sharing', label: t('trainingEnrolment.programDetails.twinSharing'), price: twinShareVal },
                     ],
                  },
                  {
                     id: 'non_residential',
                     label: t('programme.list.stayTypeNonResidential'),
                     enabled: hasNonRes,
                     options: [
                        { id: 'non_residential', label: t('programme.list.dayScholar'), price: nonResVal },
                     ],
                  },
               ],
               minParticipants: program.minParticipants || 0,
               maxParticipants: program.maxParticipants || 0,
            });
         } catch (error) {
            console.error('Failed to fetch program details:', error);
         } finally {
            setIsLoading(false);
         }
      };

      if (programId) {
         fetchProgram();
      }
   }, [programId]);

   const handleFieldChange = (key: string, value: any) => {
      setForm((prev) => ({ ...prev, [key]: value }));
   };

   // Step 1: Triggered when user clicks "Save Changes" on the form
   const handleFormSubmitClick = () => {
      // Client-side guardrail matching Zod validation requirement
      if (Number(form.maxParticipants) < Number(form.minParticipants)) {
         setModalState({
            isOpen: true,
            type: 'confirm',
            title: 'Validation Error',
            description: 'Maximum participants must be greater than or equal to minimum participants.',
            error: 'Maximum participants cannot be less than minimum participants.',
         });
         return;
      }

      // Open Confirmation Modal
      setModalState({
         isOpen: true,
         type: 'confirm',
         title: 'Save Changes',
         description: 'Are you sure you want to update the core details of this published program?',
         error: null,
      });
   };

   // Step 2: Triggered when user clicks confirm inside the modal
   const handleConfirmUpdate = async () => {
      try {
         setIsSaving(true);
         setModalState((prev) => ({ ...prev, error: null }));

         await updatePublishedProgramAPI({
            id: programId,
            title: form.title,
            minParticipants: Number(form.minParticipants) || undefined,
            maxParticipants: Number(form.maxParticipants) || undefined,
         });

         // Switch Modal to Success state
         setModalState({
            isOpen: true,
            type: 'success',
            title: 'Program Updated Successfully!',
            description: 'Your changes have been saved and applied.',
            error: null,
         });
      } catch (error: any) {
         console.error('Failed to update published program:', error);
         // Keep modal open and display API error message
         setModalState((prev) => ({
            ...prev,
            error: error?.message || 'Failed to update program. Please try again.',
         }));
      } finally {
         setIsSaving(false);
      }
   };

   // Step 3: Triggered when user clicks "Done" on the Success modal
   const handleSuccessDone = () => {
      setModalState((prev) => ({ ...prev, isOpen: false }));
      router.push('/dashboard/programs/list');
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
         </div>
      );
   }

   return (
      <>
         <BaseProgramForm
            mode="edit"
            title="Edit Program Details"
            description="Update core details and participant limits for your published program."
            formState={form}
            onFieldChange={handleFieldChange}
            onToggleStayType={() => { }}
            onUpdateOptionPrice={() => { }}
            onFileChange={() => { }}
            onSubmitEdit={handleFormSubmitClick}
            onBack={() => router.push('/dashboard/programs/list')}
            loading={isSaving}
            backLabel="Back to Programs"
         />

         {/* Confirmation and Success Modal Handler */}
         <AppModal
            isOpen={modalState.isOpen}
            type={modalState.type}
            title={modalState.title}
            description={modalState.description}
            error={modalState.error}
            loading={isSaving}
            confirmLabel="Save Changes"
            doneLabel="View Programs"
            onConfirm={handleConfirmUpdate}
            onCancel={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
            onDone={handleSuccessDone}
            onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
         />
      </>
   );
}