import { IsString, IsNotEmpty } from "class-validator";

export class DeviceSpecsDto {
  @IsString()
  @IsNotEmpty()
  "mac-address": string;

  // Allow any additional properties
  [key: string]: unknown;
}
