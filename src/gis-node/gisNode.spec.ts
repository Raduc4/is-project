import { Test, TestingModule } from "@nestjs/testing";
import { GisNodeService } from "./gis-node.service";
import { PrismaService } from "src/prisma/prisma.service";
import { GisNode } from "@prisma/client";
import { CreateGisNodeDto } from "./dtos/createGisNode.dto";

describe("GisNodeService", () => {
  let service: GisNodeService;
  let prisma: Record<string, any>;

  const sampleNode: GisNode = {
    id: "node_1",
    name: "Node One",
    uname: "NODE1",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as GisNode;

  beforeEach(async () => {
    prisma = {
      gisNode: {
        findMany: jest.fn().mockResolvedValue([sampleNode]),
        create: jest.fn().mockResolvedValue(sampleNode),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GisNodeService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<GisNodeService>(GisNodeService);
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  describe("searchGisNode", () => {
    it("should search GisNodes by name or uname", async () => {
      const result = await service.searchGisNode("Node");

      expect(prisma.gisNode.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ name: { contains: "Node" } }, { uname: { contains: "Node" } }],
        },
      });

      expect(result).toEqual([sampleNode]);
    });
  });

  // -----------------------------------------------------------------------
  describe("create", () => {
    it("should uppercase uname before persisting", async () => {
      const dto: CreateGisNodeDto = {
        name: "Node Two",
        uname: "node2",
      } as CreateGisNodeDto;

      await service.create(dto);

      expect(prisma.gisNode.create).toHaveBeenCalledWith({
        data: {
          name: "Node Two",
          uname: "NODE2",
        },
      });
    });
  });
});
