import { z } from 'zod';

export const advisoryInputSchema = z.object({
  fieldId: z.string().min(1, 'fieldId is required'),
  cropType: z.string().min(2, 'cropType must be at least 2 characters'),
  growthStage: z.enum(['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting']),
  soilMoisturePercentage: z.coerce.number().min(0).max(100),
  soilPh: z.coerce.number().min(0).max(14),
  nitrogenPpm: z.coerce.number().nonnegative(),
  phosphorusPpm: z.coerce.number().nonnegative(),
  potassiumPpm: z.coerce.number().nonnegative(),
  temperatureCelsius: z.coerce.number(),
  humidityPercentage: z.coerce.number().min(0).max(100),
  visualSymptoms: z.string().optional().default(''),
  imageBase64: z.string().optional().nullable(),
  imageMimeType: z.string().optional().default('image/jpeg')
});

export const taskApprovalSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'EXECUTE']),
  notes: z.string().optional(),
  overridePayload: z.any().optional(),
  agronomistId: z.string().optional()
});

export const createFieldSchema = z.object({
  fieldName: z.string().min(2, 'Field name is required'),
  locationCoordinates: z.string().optional().default('28.6139° N, 77.2090° E'),
  areaHectares: z.coerce.number().positive('Area must be greater than 0'),
  currentCrop: z.string().min(2, 'Current crop is required')
});
