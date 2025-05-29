import { Test, TestingModule } from "@nestjs/testing";
import { FlightsService } from "./flights.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Flight } from "@prisma/client";
import { CreateFlightDto } from "./dtos/addFlight.dto";
import { SearchFlightDto } from "./dtos/searchFlight.dto";
import { startOfDay, addDays } from "date-fns";
import { FlightEntity } from "./entities/flight.entity";

describe("FlightsService", () => {
  let service: FlightsService;
  let prisma: Record<string, any>;

  // --- sample data ---------------------------------------------------------
  const sampleFlight: Flight & {
    flightData: any;
    departureLocation: any;
    arrivalLocation: any;
    plane: any;
  } = {
    id: "flight_1",
    planeId: "plane_1",
    departureLocationId: "loc_A",
    arrivalLocationId: "loc_B",
    departureDate: new Date("2025-07-01T08:00:00Z"),
    arrivalDate: new Date("2025-07-01T10:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
    // relations mocked below
    flightData: { economySeats: 100, businessSeats: 20, firstClassSeats: 10 },
    departureLocation: { id: "loc_A", name: "AAA" },
    arrivalLocation: { id: "loc_B", name: "BBB" },
    plane: { id: "plane_1", planeModel: "Boeing 737", planeCode: "ABC123" },
  } as unknown as Flight & {
    flightData: any;
    departureLocation: any;
    arrivalLocation: any;
    plane: any;
  };

  beforeEach(async () => {
    prisma = {
      flight: {
        findMany: jest.fn().mockResolvedValue([sampleFlight]),
        create: jest.fn().mockResolvedValue(sampleFlight),
        delete: jest.fn().mockResolvedValue(sampleFlight),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  describe("getAllFlights", () => {
    it("should return all flights with relations", async () => {
      const result = await service.getAllFlights();
      expect(prisma.flight.findMany).toHaveBeenCalledWith({
        include: {
          flightData: true,
          departureLocation: true,
          arrivalLocation: true,
          plane: true,
        },
      });
      expect(result).toEqual([sampleFlight]);
    });
  });

  // -------------------------------------------------------------------------
  // describe("addFlight", () => {
  //   it("should create a flight and nested flightData", async () => {
  //     const dto: CreateFlightDto = {
  //       planeId: "plane_1",
  //       departureLocationId: "loc_A",
  //       arrivalLocationId: "loc_B",
  //       departureDate: new Date("2025-07-01T08:00:00Z"),
  //       arrivalDate: new Date("2025-07-01T10:00:00Z"),
  //       flightData: {
  //         economySeats: 100,
  //         businessSeats: 20,
  //         firstClassSeats: 10,
  //       },
  //     } as unknown as CreateFlightDto;

  //     const entity = new FlightEntity(dto);

  //     await service.addFlight(dto);

  //     expect(prisma.flight.create).toHaveBeenCalledWith({
  //       data: expect.objectContaining({
  //         ...entity,
  //         arrivalLocationId: dto.arrivalLocationId,
  //         departureLocationId: dto.departureLocationId,
  //         flightData: {
  //           create: { ...entity.flightData },
  //         },
  //       }),
  //     });
  //   });
  // });

  // -------------------------------------------------------------------------
  describe("deleteFlight", () => {
    it("should delete a flight by id", async () => {
      const result = await service.deleteFlight("flight_1");
      expect(prisma.flight.delete).toHaveBeenCalledWith({
        where: { id: "flight_1" },
      });
      expect(result).toEqual(sampleFlight);
    });
  });

  // -------------------------------------------------------------------------
  describe("searchFlight", () => {
    it("should search flights by date and locations", async () => {
      const searchDto: SearchFlightDto = {
        departureDate: "2025-07-01",
        from: "AAA",
        to: "BBB",
      } as unknown as SearchFlightDto;

      const depStart = startOfDay(new Date(searchDto.departureDate));
      const depEnd = addDays(depStart, 1);

      const result = await service.searchFlight(searchDto);

      expect(prisma.flight.findMany).toHaveBeenCalledWith({
        include: {
          flightData: true,
          departureLocation: true,
          arrivalLocation: true,
        },
        where: {
          departureLocation: {
            name: "AAA",
          },
          arrivalLocation: {
            name: "BBB",
          },
          departureDate: { gte: depStart, lt: depEnd },
        },
        take: 10,
      });

      expect(result).toEqual([sampleFlight]);
    });
  });
});
