import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { DeviceSpecsDto } from "./device-specs.dto";

jest.mock("ioredis");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("AppService", () => {
  let service: AppService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: "REDIS_CLIENT",
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    redisClient = module.get<Redis>("REDIS_CLIENT");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handleGetId", () => {
    it("should return existing id and update specs if mac-address exists", async () => {
      const macAddress = "00:1A:2B:3C:4D:5E";
      const existingId = "existing-uuid";
      const body: DeviceSpecsDto = {
        "mac-address": macAddress,
        "device-name": "Device XYZ",
      };

      jest.spyOn(redisClient, "get").mockImplementation(async (key: string) => {
        if (key === `mac:${macAddress}`) {
          return existingId;
        }
        return null;
      });

      jest.spyOn(redisClient, "set").mockResolvedValue("OK");

      const result = await service.handleGetId(body);

      expect(redisClient.get).toHaveBeenCalledWith(`mac:${macAddress}`);
      expect(redisClient.set).toHaveBeenCalledWith(
        `id:${existingId}`,
        JSON.stringify(body),
      );
      expect(result).toEqual({ id: existingId });
    });

    it("should generate new id, store mapping and specs if mac-address does not exist", async () => {
      const macAddress = "00:1A:2B:3C:4D:5F";
      const newId = "new-uuid";
      const body: DeviceSpecsDto = {
        "mac-address": macAddress,
        "device-name": "Device ABC",
      };

      jest.spyOn(redisClient, "get").mockResolvedValue(null);
      jest.spyOn(redisClient, "set").mockResolvedValue("OK");

      // Mock uuidv4 to return newId
      (uuidv4 as jest.Mock).mockReturnValue(newId);

      const result = await service.handleGetId(body);

      expect(uuidv4).toHaveBeenCalled();
      expect(redisClient.get).toHaveBeenCalledWith(`mac:${macAddress}`);
      expect(redisClient.set).toHaveBeenCalledWith(`mac:${macAddress}`, newId);
      expect(redisClient.set).toHaveBeenCalledWith(
        `id:${newId}`,
        JSON.stringify(body),
      );
      expect(result).toEqual({ id: newId });
    });
  });
});
