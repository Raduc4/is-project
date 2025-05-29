import { Test, TestingModule } from "@nestjs/testing";
import { PlanesService } from "./planes.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Plane } from "@prisma/client";
import { CreatePlaneDto } from "./dtos/createPlane.dto";

describe("PlanesService", () => {
  let service: PlanesService;
  let prisma: Record<string, any>; // mocked PrismaService

  const samplePlane: Plane = {
    id: "plane_1",
    planeModel: "Boeing 737",
    planeCode: "ABC123",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Plane;

  beforeEach(async () => {
    prisma = {
      plane: {
        findMany: jest.fn().mockResolvedValue([samplePlane]),
        create: jest.fn().mockResolvedValue(samplePlane),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<PlanesService>(PlanesService);
    jest.clearAllMocks();
  });

  describe("generatePlaneCode", () => {
    it("should generate a 6‑character uppercase alphanumeric code", () => {
      const code = service.generatePlaneCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    it("should return different codes most of the time", () => {
      const first = service.generatePlaneCode();
      const second = service.generatePlaneCode();
      expect(first).not.toBe(second);
    });
  });

  describe("find", () => {
    it("should search planes by code prefix case‑insensitively", async () => {
      const result = await service.find("AB");
      expect(prisma.plane.findMany).toHaveBeenCalledWith({
        where: {
          planeCode: {
            startsWith: "AB",
            mode: "insensitive",
          },
        },
      });
      expect(result).toEqual([samplePlane]);
    });
  });

  describe("create", () => {
    it("should create a plane with generated planeCode", async () => {
      const dto: CreatePlaneDto = {
        planeModel: "Boeing 737",
      } as CreatePlaneDto;

      // make the generated code deterministic for the assertion
      jest.spyOn(service, "generatePlaneCode").mockReturnValue("XYZ789");

      await service.create(dto);

      expect(prisma.plane.create).toHaveBeenCalledWith({
        data: {
          planeModel: "Boeing 737",
          planeCode: "XYZ789",
        },
      });
    });
  });
});
