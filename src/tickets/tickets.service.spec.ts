import { Test, TestingModule } from "@nestjs/testing";
import { TicketsService } from "./tickets.service";
import { Ticket } from "@prisma/client";
import { CreateTicketDto } from "./dtos/createTicketDto";
// tickets/tickets.service.ts
import { PrismaService } from '../prisma/prisma.service';  // relative path

describe("TicketsService", () => {
  let service: TicketsService;
  let prisma: Record<string, any>; // will hold our mocked prismaService

  const sampleTicket: Ticket = {
    id: "ticket_1",
    passengerName: "John Doe",
    phone: "+40712345678",
    outboundFlightId: "flight_1",
    returnFlightId: null,
    seatClass: "economy",
    totalPriceCents: 20000,
    ticketType: "economy",
    ticketPurchaseType: "online",
    dateFrom: new Date("2025-06-01"),
    dateTo: new Date("2025-06-10"),
    adults: 1,
    children: 0,
    seniors: 0,
    withMeal: false,
    extraBaggage: false,
    optionsFeeCents: 0,
    discountPercent: 0,
    currency: "EUR",
    paymentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Ticket; // cast because sample may omit some fields depending on Prisma schema

  beforeEach(async () => {
    prisma = {
      ticket: {
        findUnique: jest.fn().mockResolvedValue(sampleTicket),
        findMany: jest.fn().mockResolvedValue([sampleTicket]),
        delete: jest.fn().mockResolvedValue(sampleTicket),
        create: jest.fn().mockResolvedValue(sampleTicket),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    jest.clearAllMocks();
  });

  describe("findTicket", () => {
    it("should return a ticket by id", async () => {
      const result = await service.findTicket("ticket_1");
      expect(prisma.ticket.findUnique).toHaveBeenCalledWith({ where: { id: "ticket_1" } });
      expect(result).toEqual(sampleTicket);
    });
  });

  describe("searchTicket", () => {
    it("should search tickets with default params (title currently unused)", async () => {
      const result = await service.searchTicket("Holiday");
      expect(prisma.ticket.findMany).toHaveBeenCalledWith({ where: {}, take: 10 });
      expect(result).toEqual([sampleTicket]);
    });
  });

  describe("deleteTicket", () => {
    it("should delete and return ticket", async () => {
      const result = await service.deleteTicket("ticket_1");
      expect(prisma.ticket.delete).toHaveBeenCalledWith({ where: { id: "ticket_1" } });
      expect(result).toEqual(sampleTicket);
    });
  });

  describe("getAllTickets", () => {
    it("should return first 10 tickets", async () => {
      const result = await service.getAllTickets();
      expect(prisma.ticket.findMany).toHaveBeenCalledWith({ take: 10 });
      expect(result).toEqual([sampleTicket]);
    });
  });

  describe("calculatePrice", () => {
    it("should calculate economy price without extras", async () => {
      const res = await service.calculatePrice({ ticketType: "economy", quantity: 2 });
      expect(res).toMatchObject({ totalPrice: 200, currency: "EUR", paymentMethod: "Card" });
    });

    it("should include extras, round‑trip discount and round to 2 decimals", async () => {
      const res = await service.calculatePrice({
        ticketType: "business",
        quantity: 1,
        isRoundTrip: true,
        extras: { meal: true, extraLuggage: true },
      });
      // Business base 200 → +5% meal → 210 → +5% luggage → 220.5 → 5% round trip discount → 209.475 → 209.48
      expect(res.totalPrice).toBeCloseTo(209.48, 2);
      expect(res.roundTripDiscountApplied).toBe(true);
    });

    it("should apply last‑minute multiplier (0.6) before rounding", async () => {
      const res = await service.calculatePrice({ ticketType: "economy", quantity: 1, isLastMinute: true });
      expect(res.totalPrice).toBeCloseTo(60, 2); // 100 * 0.6
    });

    it("should return error for invalid quantity", async () => {
      const res = await service.calculatePrice({ ticketType: "economy", quantity: NaN as unknown as number });
      expect(res.error).toBe("Invalid quantity");
      expect(res.totalPrice).toBeNull();
    });

    it("should return error for invalid ticket type", async () => {
      // @ts-expect-error – intentional wrong type for test
      const res = await service.calculatePrice({ ticketType: "vip", quantity: 1 });
      expect(res.error).toBe("Invalid ticket type");
      expect(res.totalPrice).toBeNull();
    });
  });

  describe("createTicket", () => {
    it("should create a ticket with converted dates", async () => {
      const dto: CreateTicketDto = {
        passengerName: "John Doe",
        phone: "+40712345678",
        outboundFlightId: "flight_1",
        seatClass: "economy",
        totalPrice: 20000,
        ticketType: "economy",
        ticketPurchaseType: "online",
        dateFrom: "2025-06-01",
        dateTo: "2025-06-10",
        adults: 1,
        children: 0,
        seniors: 0,
        withMeal: false,
        extraBaggage: false,
        optionsFeeCents: 0,
        discountPercent: 0,
        currency: "EUR",
        returnFlightId: null,
        paymentId: null,
      } as unknown as CreateTicketDto;

      const result = await service.createTicket(dto);
      expect(prisma.ticket.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          passengerName: "John Doe",
          dateFrom: new Date("2025-06-01"),
          dateTo: new Date("2025-06-10"),
        }),
      });
      expect(result).toEqual(sampleTicket);
    });
  });
});
