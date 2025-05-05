import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesService } from 'src/s3/s3.service';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private s3Service: ImagesService,
  ) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findFacebookUser(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
  async findMany() {
    return this.prisma.user.findMany({});
  }
  async addSavedEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event.savedByUserIds.includes(userId)) {
      return this.prisma.user.update({
        where: { id: userId },
        data: { savedEvents: { connect: { id: eventId } } },
      });
    } else {
      return this.prisma.user.update({
        where: { id: userId },
        data: { savedEvents: { disconnect: { id: eventId } } },
      });
    }
  }

  async getMyFriendshipRequests(userId: string) {
    const myRequests = await this.prisma.friendship.findMany({
      where: {
        senderId: userId,
      },
      include: {
        receiver: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
        sender: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
      },
    });

    return myRequests;
  }

  async getMyPendingFriendshipRequests(id: string) {
    return await this.prisma.friendship.findMany({
      where: {
        receiverId: id,
        accepted: false,
      },
      include: {
        sender: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
      },
    });
  }

  async getMyRequestedPendingFriendships(id: string, username?: string) {
    if (username) {
      const friendshipsISent = await this.prisma.friendship.findMany({
        where: {
          receiver: {
            username: {
              contains: username,
              mode: 'insensitive',
            },
          },
          senderId: id,
          accepted: false,
        },

        include: {
          sender: false,
          receiver: {
            select: {
              avatar: true,
              username: true,
              id: true,
            },
          },
        },
      });
      return friendshipsISent.map((friend) => friend.receiver);
    } else {
      return await this.prisma.friendship.findMany({
        where: {
          senderId: id,
          accepted: false,
        },

        include: {
          sender: false,
          receiver: {
            select: {
              avatar: true,
              username: true,
              id: true,
            },
          },
        },
      });
    }
  }

  async getFriends(id: string) {
    return await this.prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: id, accepted: true },
          { receiverId: id, accepted: true },
        ],
      },
      include: {
        sender: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
        receiver: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
      },
    });
  }

  async acceptFriendship(id: string, friendId: string) {
    // Step 1: Find the friendship record
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        receiverId: id,
        senderId: friendId,
        accepted: false,
      },
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }

    // Step 2: Update the found friendship record
    return await this.prisma.friendship.update({
      where: { id: friendship.id },
      data: { accepted: true },
    });
  }

  async denyFriendship(id: string, friendId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        receiverId: id,
        senderId: friendId,
        accepted: false,
      },
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }

    return await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });
  }

  async getFriendshipRequestByUsernamePending(myId: string, username: string) {
    const pendingFriends = await this.prisma.friendship.findMany({
      where: {
        sender: {
          username: {
            contains: username,
            mode: 'insensitive',
          },
        },
        accepted: false,
        receiver: {
          id: myId,
        },
      },
      select: {
        sender: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
      },
    });

    return pendingFriends.map((friend) => friend.sender);
  }

  async getFriendsByUsername(myId: string, username: string) {
    const senders = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: myId, accepted: true },
          { receiverId: myId, accepted: true },
        ],
      },
      select: {
        receiver: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
      },
    });
    console.log('Senders', senders);
    return senders.map((friend) => friend.receiver);
  }

  async findUsersByUsername(username: string, id: string) {
    const friendshipsPending = await this.getFriendshipRequestByUsernamePending(
      id,
      username,
    );
    const sentFriendships = (await this.getMyRequestedPendingFriendships(
      id,
      username,
    )) as {
      id: string;
      username: string;
      avatar: string;
    }[];

    console.log('Friends pending', sentFriendships);
    const friends = await this.getFriendsByUsername(id, username);
    console.log('Friends', friends);
    const excludeIds = friends
      .concat(friendshipsPending)
      .concat(sentFriendships)
      .concat({ id, username: '', avatar: '' })
      .map((friend) => friend.id);

    excludeIds.push(id);

    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: 'insensitive',
        },
        id: {
          not: {
            in: excludeIds,
          },
        },
      },
      select: {
        avatar: true,
        username: true,
        id: true,
      },
      take: 10,
    });

    return {
      friends: {
        users: friends,
        type: 'friends',
      },
      friendRequestedByMe: {
        users: [...sentFriendships],
        type: 'friendRequestedByMe',
      },
      friendsPending: {
        users: [...friendshipsPending],
        type: 'friendsPending',
      },
      users: {
        users: users,
        type: 'users',
      },
    };
  }

  async toggleCreateFriendshipRequest(senderId: string, receiverId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId, accepted: false },
          { senderId: receiverId, receiverId: senderId, accepted: false },
        ],
      },
    });
    if (friendship) {
      console.log('Friendship', friendship);
      const res = await this.prisma.friendship.delete({
        where: { id: friendship.id, accepted: false, senderId, receiverId },
      });
      console.log(res);
      return res;
    } else {
      const res = await this.prisma.friendship.create({
        data: {
          senderId,
          receiverId,
          accepted: false,
        },
      });
      console.log(res);
      return res;
    }
  }

  async unfriend(id: string, friendId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: id, receiverId: friendId },
          { senderId: friendId, receiverId: id },
        ],
      },
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }

    return await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });
  }

  async getSavedEvents(id: string) {
    const events = await this.prisma.user.findUnique({
      where: { id },
      include: { savedEvents: true },
    });

    return events.savedEvents;
  }

  async findUser(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
      include: { evnets: true },
    });

    return user;
  }
  async checkUsername(username: string) {
    console.log('Usernem ', username);
    const user = await this.prisma.user.findFirst({
      where: {
        username: { equals: username, mode: 'insensitive' },
      },
    });

    if (user) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  }

  async checkEmail(email: string) {
    console.log(email);

    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
      },
    });

    if (user) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  }

  async bulkBusinessInformationUpdate(
    id: string,
    businessInfor: BusinessInfoDto,
  ) {
    const {
      businessName,
      businessAddress,
      businessEmail,
      businessPostCode,
      businessDescription,
    } = businessInfor;
    await this.prisma.user.update({
      where: { id },
      data: {
        businessName,
        businessAddress,
        businessEmail,
        businessPostCode,
        businessDescription,
      },
    });
  }
  async updateProfilePicture(userId: string, base64: string, type: string) {
    return await this.s3Service
      .uploadFile(base64, type, userId)
      .then(async (imageObject) => {
        console.log('Image object', imageObject);

        return await this.prisma.user.update({
          where: { id: userId },
          data: {
            avatar: imageObject.Location,
          },
        });
      });
  }

  async updateBusinessName(userId: string, businessName: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessName,
      },
    });
  }

  async updateBusinessAddress(userId: string, businessAddress: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessAddress,
      },
    });
  }
  async updateBusinessEmail(userId: string, businessEmail: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessEmail,
      },
    });
  }
  async updateBusinessPostCode(userId: string, businessPostCode: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessPostCode,
      },
    });
  }

  async updateBusinessDescription(userId: string, businessDescription: string) {
    console.log('Business description', businessDescription);
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessDescription,
      },
    });
  }

  async updateBusinessPhone(userId: string, businessPhone: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessPhone,
      },
    });
  }
}
