import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";

describe("UserService", () => {
  let service: UserService;
  let prisma: Record<string, any>;

  const sampleUser: User = {
    id: "user_1",
    email: "john.doe@example.com",
    phone: "+40712345678",
    password: "hashed_pw",
    firstName: "John",
    lastName: "Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as User; // Adapt if your schema differs

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(sampleUser),
        findMany: jest.fn().mockResolvedValue([sampleUser]),
        findFirst: jest.fn().mockResolvedValue(sampleUser),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  describe("findOneByEmail", () => {
    it("should find a user by email", async () => {
      const result = await service.findOneByEmail("john.doe@example.com");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "john.doe@example.com" },
      });
      expect(result).toEqual(sampleUser);
    });
  });

  describe("findOneByPhone", () => {
    it("should find a user by phone", async () => {
      const result = await service.findOneByPhone("+40712345678");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { phone: "+40712345678" },
      });
      expect(result).toEqual(sampleUser);
    });
  });

  describe("findMany", () => {
    it("should return array of users", async () => {
      const result = await service.findMany();
      expect(prisma.user.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual([sampleUser]);
    });
  });

  describe("findUser", () => {
    it("should return user by id", async () => {
      const result = await service.findUser("user_1");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user_1" },
      });
      expect(result).toEqual(sampleUser);
    });
  });

  describe("checkEmail", () => {
    it("should return status true when user exists (case-insensitive)", async () => {
      // mock already returns sampleUser
      const res = await service.checkEmail("JOHN.DOE@example.com");
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: { equals: "JOHN.DOE@example.com", mode: "insensitive" },
        },
      });
      expect(res).toEqual({ status: true });
    });

    it("should return status false when user not found", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
      const res = await service.checkEmail("notfound@example.com");
      expect(res).toEqual({ status: false });
    });
  });
});
