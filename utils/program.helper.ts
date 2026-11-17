import { STAY_TYPE_IDS } from "@/constants/program";
import { t } from "@/lib/i18n";

export const mapProgramToForm = (program: any) => {
   const getStayOptionPrice = (
      options: any[],
      typeName: string
   ) => {
      const found = options?.find(
         (opt: any) => opt.type === typeName
      );

      return found ? String(found.price) : "";
   };

   const singleOccVal = getStayOptionPrice(
      program.stayOptions || [],
      "single_occupancy"
   );

   const twinShareVal = getStayOptionPrice(
      program.stayOptions || [],
      "twin_sharing"
   );

   const nonResVal = getStayOptionPrice(
      program.stayOptions || [],
      STAY_TYPE_IDS.NON_RESIDENTIAL
   );

   const filename = program.brochureUrl
      ? program.brochureUrl.split("/").pop() || "brochure.pdf"
      : "";

   return {
      title: program.title || "",
      startDate: program.startDate
         ? program.startDate.split("T")[0]
         : "",
      endDate: program.endDate
         ? program.endDate.split("T")[0]
         : "",
      venue: program.venueName || "",
      city: program.city || "",
      brochureFilename: filename,
      stayTypes: [
         {
            id: STAY_TYPE_IDS.RESIDENTIAL,
            label: t("draftPrograms.labelResidential"),
            enabled: !!singleOccVal || !!twinShareVal,
            options: [
               {
                  id: "single_occupancy",
                  label: t("trainingEnrolment.programDetails.singleOccupancy"),
                  price: singleOccVal,
               },
               {
                  id: "twin_sharing",
                  label: t("trainingEnrolment.programDetails.twinSharing"),
                  price: twinShareVal,
               },
            ],
         },
         {
            id: STAY_TYPE_IDS.NON_RESIDENTIAL,
            label: t("programme.list.stayTypeNonResidential"),
            enabled: !!nonResVal,
            options: [
               {
                  id: STAY_TYPE_IDS.NON_RESIDENTIAL,
                  label: t("programme.list.dayScholar"),
                  price: nonResVal,
               },
            ],
         },
      ],
      minParticipants: program.minParticipants || 0,
      maxParticipants: program.maxParticipants || 0,
   };
};