import { Suspense } from "react";
import CreateTrainingProgram from "@/components/dashboard/programs/CreateTrainingProgram";


export default async function Page() {
   return (
      <Suspense fallback={null}>
         <CreateTrainingProgram />
      </Suspense>
   );
}