"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { t } from "@/lib/i18n";
import { Spinner } from "@/components/ui/spinner";
import { providerService } from "@/services/provider.service";
import BaseProgramForm from "@/components/dashboard/programs/BaseProgram";
import { STAY_TYPE_IDS } from "@/constants/program";
import { mapProgramToForm } from "@/utils/program.helper";

export default function ViewPublishedProgram() {
   const router = useRouter();
   const params = useParams();
   const programId = params?.id as string;

   const [isLoading, setIsLoading] = useState(true);

   const [form, setForm] = useState({
      title: "",
      startDate: "",
      endDate: "",
      venue: "",
      city: "",
      stayTypes: [
         {
            id: STAY_TYPE_IDS.RESIDENTIAL,
            label: t("draftPrograms.labelResidential"),
            enabled: false,
            options: [
               {
                  id: "single_occupancy",
                  label: t("programme.fields.singleOccupancy"),
                  price: "",
               },
               {
                  id: "twin_sharing",
                  label: t("programme.fields.twinSharing"),
                  price: "",
               },
            ],
         },
         {
            id: STAY_TYPE_IDS.NON_RESIDENTIAL,
            label: t("programme.fields.nonResidential"),
            enabled: false,
            options: [
               {
                  id: STAY_TYPE_IDS.NON_RESIDENTIAL,
                  label: t("programme.fields.nonResidentialFee"),
                  price: "",
               },
            ],
         },
      ],
      brochureFilename: "",
      minParticipants: 0,
      maxParticipants: 0,
   });

   useEffect(() => {
   const fetchProgram = async () => {
      try {
         setIsLoading(true);

         const program = await providerService.getDraftById(programId);

         setForm(mapProgramToForm(program));
      } catch (error) {
         console.error(t("programme.view.fetchError"), error);
      } finally {
         setIsLoading(false);
      }
   };

   if (programId) {
      fetchProgram();
   }
}, [programId]);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
         </div>
      );
   }

   return (
      <BaseProgramForm
         mode="view"
         title={t("programme.view.title")}
         description={t("programme.view.description")}
         formState={form}
         onFieldChange={() => { }}
         onToggleStayType={() => { }}
         onUpdateOptionPrice={() => { }}
         onFileChange={() => { }}
         onBack={() => router.push("/dashboard/programs/upcoming")}
         backLabel={t("button.backToPrograms")}
      />
   );
}