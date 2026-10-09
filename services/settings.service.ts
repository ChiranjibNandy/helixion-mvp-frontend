import { API } from "@/constants/api";
import { api } from "@/lib/api";

export enum ProfileTypes {
   CORPORATE_ADMIN = "admin",
   TRADING_PARTNER = "training_provider"
}

export interface SettingsProfile {
   _id?: string;
   ownerId?: string;
   profileType: ProfileTypes;
   gstNumber?: string;
   panNumber?: string;
   createdAt?: string;
   updatedAt?: string;
}

export interface UpdateSettingsProfilePayload {
   gstNumber?: string;
   panNumber?: string;
}

interface ApiResponse<T> {
   success: boolean;
   message: string;
   profile: SettingsProfile;
}

/**
 * Get the current user's settings profile.
 */
export const getSettingsProfileApi = async (): Promise<SettingsProfile> => {
   const response = await api.get<ApiResponse<SettingsProfile>>(
      API.SETTINGS.PROFILE
   );

   return response.data.profile;
};

/**
 * Update the current user's settings profile.
 */
export const updateSettingsProfileApi = async (
   payload: UpdateSettingsProfilePayload
): Promise<SettingsProfile> => {
   const response = await api.put<ApiResponse<SettingsProfile>>(
      API.SETTINGS.PROFILE,
      payload
   );

   return response.data.profile;
};
