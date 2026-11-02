import { Address } from "@/services/settings.service";

export const formatAddressString = (location?: Address): string => {
   if (!location) return "No address provided";

   const { addressLine1, addressLine2, city, state, postalCode } = location;
   return [addressLine1, addressLine2, city, state, postalCode]
      .filter((part) => part && part.trim() !== "")
      .join(", ");
};