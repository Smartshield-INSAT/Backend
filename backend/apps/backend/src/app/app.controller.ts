import { Controller, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { DeviceSpecsDto } from "./device-specs.dto";

@Controller("")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("get-id")
  async getId(@Body() body: DeviceSpecsDto): Promise<{ id: string }> {
    return this.appService.handleGetId(body);
  }
}
