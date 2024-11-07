import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DeviceSpecsDto } from "./device-specs.dto";

describe("AppController", () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            handleGetId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getId", () => {
    it("should return id from service", async () => {
      const body: DeviceSpecsDto = {
        "mac-address": "00:1A:2B:3C:4D:5E",
        "device-name": "Device XYZ",
      };
      const expectedResult = { id: "some-uuid" };

      jest.spyOn(service, "handleGetId").mockResolvedValue(expectedResult);

      const result = await controller.getId(body);

      expect(service.handleGetId).toHaveBeenCalledWith(body);
      expect(result).toEqual(expectedResult);
    });
  });
});
