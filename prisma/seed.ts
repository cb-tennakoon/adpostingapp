// prisma/seed.ts
import "dotenv/config";
import {
  PrismaClient,
  Tier,
  Role,
  AdStatus,
  PaymentStatus,
  ReportReason,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// ---------- Prisma Client ----------
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ======================
  // 1. Clean data in correct order (respect foreign keys)
  // ======================
  await prisma.payment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.report.deleteMany();
  await prisma.adImage.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.postType.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tierPlan.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Old data cleaned");

  // ======================
  // 2. Tier Plans
  // ======================
  const tiers = [
    {
      tier: Tier.BRONZE,
      rank: 1,
      name: "Bronze",
      priceLkr: 0,
      durationHours: 0,
      maxPhotos: 3,
      minPhotos: 1,
      maxVideos: 0,
      allowVideo: false,
      maxVideoSizeMB: 0,
      showOnHome: true,
      badgeColor: "#CD7F32",
    },
    {
      tier: Tier.SILVER,
      rank: 2,
      name: "Silver",
      priceLkr: 500,
      durationHours: 24,
      maxPhotos: 5,
      minPhotos: 1,
      maxVideos: 0,
      allowVideo: false,
      maxVideoSizeMB: 0,
      showOnHome: true,
      badgeColor: "#C0C0C0",
    },
    {
      tier: Tier.GOLD,
      rank: 3,
      name: "Gold",
      priceLkr: 1000,
      durationHours: 24,
      maxPhotos: 8,
      minPhotos: 1,
      maxVideos: 1,
      allowVideo: true,
      maxVideoSizeMB: 50,
      showOnHome: true,
      badgeColor: "#FFD700",
    },
    {
      tier: Tier.PLATINUM,
      rank: 4,
      name: "Platinum",
      priceLkr: 2000,
      durationHours: 24,
      maxPhotos: 12,
      minPhotos: 1,
      maxVideos: 2,
      allowVideo: true,
      maxVideoSizeMB: 100,
      showOnHome: true,
      badgeColor: "#E5E4E2",
    },
    {
      tier: Tier.TITANIUM,
      rank: 5,
      name: "Titanium",
      priceLkr: 3500,
      durationHours: 24,
      maxPhotos: 20,
      minPhotos: 1,
      maxVideos: 3,
      allowVideo: true,
      maxVideoSizeMB: 150,
      showOnHome: true,
      badgeColor: "#878681",
    },
  ];

  for (const t of tiers) {
    await prisma.tierPlan.create({ data: t });
  }
  console.log("✅ Tier Plans created");

  // ======================
  // 3. Categories + PostTypes
  // ======================
  const categoryData = [
    {
      name: "Girls Personal",
      slug: "girls-personal",
      description: "Girls personal ads",
      isAdult: true,
      sortOrder: 1,
      types: ["Profile Ad", "Verified Profile"],
    },
    {
      name: "Boys Personal",
      slug: "boys-personal",
      description: "Boys personal ads",
      isAdult: true,
      sortOrder: 2,
      types: ["Profile Ad", "Verified Profile"],
    },
    {
      name: "Shemale Personal",
      slug: "shemale-personal",
      description: "Shemale personal ads",
      isAdult: true,
      sortOrder: 3,
      types: ["Profile Ad", "Verified Profile"],
    },
    {
      name: "Spa & Wellness",
      slug: "spa-wellness",
      description: "Massage, spa and wellness services",
      isAdult: true,
      sortOrder: 4,
      types: ["Therapist Profile", "Home Service", "Spa Center"],
    },
    {
      name: "Live Cam",
      slug: "live-cam",
      description: "Live cam shows",
      isAdult: true,
      sortOrder: 5,
      types: ["Performer Profile", "Live Now"],
    },
    {
      name: "Beauty & Salon",
      slug: "beauty-salon",
      description: "Hair, makeup and beauty services",
      isAdult: false,
      sortOrder: 6,
      types: ["Salon Listing", "Home Visit"],
    },
  ];

  const categories: { id: string; slug: string; postTypeIds: string[] }[] = [];

  for (const c of categoryData) {
    const cat = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        isAdult: c.isAdult,
        sortOrder: c.sortOrder,
      },
    });

    const postTypeIds: string[] = [];
    for (const typeName of c.types) {
      const pt = await prisma.postType.create({
        data: {
          name: typeName,
          slug: typeName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          categoryId: cat.id,
        },
      });
      postTypeIds.push(pt.id);
    }

    categories.push({ id: cat.id, slug: cat.slug, postTypeIds });
  }
  console.log("✅ Categories & PostTypes created");

  // ======================
  // 4. Site Settings
  // ======================
  await prisma.siteSetting.createMany({
    data: [
      { key: "SITE_NAME", value: "Bandu" },
      { key: "ADMIN_WHATSAPP", value: "94771234567" },
    ],
  });
  console.log("✅ Site Settings created");

  // ======================
  // 5. Users
  // ======================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@bandu.lk",
      phone: "94770000000",
      name: "Super Admin",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
      isAdult: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      phone: "94771111111",
      name: "Kamal Perera",
      role: Role.PROVIDER,
      isVerified: true,
      isAdult: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      phone: "94772222222",
      name: "Nimal Silva",
      role: Role.PROVIDER,
      isVerified: true,
      isAdult: true,
    },
  });

  console.log("✅ Users created");
  console.log("   Admin → admin@bandu.lk / admin123");

  // ======================
  // 6. Sample Ads
  // ======================
  const spaCategory = categories.find((c) => c.slug === "spa-wellness")!;
  const girlsCategory = categories.find((c) => c.slug === "girls-personal")!;

  // Bronze Ad
  const ad1 = await prisma.ad.create({
    data: {
      title: "Relaxing Full Body Massage",
      description: "Professional massage service at home. Highly experienced therapist.",
      priceLkr: 5000,
      phone: "94771111111",
      whatsapp: "94771111111",
      city: "Colombo",
      district: "Colombo",
      ageShown: 28,
      status: AdStatus.ACTIVE,
      tier: Tier.BRONZE,
      tierRank: 1,
      userId: user1.id,
      categoryId: spaCategory.id,
      postTypeId: spaCategory.postTypeIds[0],
      likeCount: 12,
      shareCount: 5,
      views: 120,
      images: {
        create: [
          {
            url: "https://picsum.photos/seed/bandu1/600/800",
            isCover: true,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Gold Ad
  const ad2 = await prisma.ad.create({
    data: {
      title: "Premium Spa Experience",
      description: "Luxury spa treatment with aromatherapy. Book now!",
      priceLkr: 12000,
      phone: "94772222222",
      whatsapp: "94772222222",
      city: "Kandy",
      district: "Kandy",
      ageShown: 26,
      status: AdStatus.ACTIVE,
      tier: Tier.GOLD,
      tierRank: 3,
      tierStartedAt: new Date(),
      tierExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: user2.id,
      categoryId: spaCategory.id,
      postTypeId: spaCategory.postTypeIds[0],
      likeCount: 45,
      shareCount: 18,
      views: 340,
      isVerifiedBadge: true,
      images: {
        create: [
          {
            url: "https://picsum.photos/seed/bandu2/600/800",
            isCover: true,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Pending Ad
  await prisma.ad.create({
    data: {
      title: "Home Beauty Service",
      description: "Makeup and hair styling at your home.",
      priceLkr: 8000,
      phone: "94771111111",
      city: "Galle",
      status: AdStatus.PENDING_REVIEW,
      requestedTier: Tier.SILVER,
      tier: Tier.BRONZE,
      tierRank: 1,
      userId: user1.id,
      categoryId: girlsCategory.id,
      postTypeId: girlsCategory.postTypeIds[0],
    },
  });

  console.log("✅ Sample ads created");

  // ======================
  // 7. Sample Payment (for Gold Ad)
  // ======================
  const goldPlan = await prisma.tierPlan.findUnique({
    where: { tier: Tier.GOLD },
  });

  if (goldPlan) {
    await prisma.payment.create({
      data: {
        amountLkr: goldPlan.priceLkr,
        status: PaymentStatus.PAID,
        method: "Bank Transfer",
        reference: "SEED-GOLD-001",
        userId: user2.id,
        adId: ad2.id,
        planId: goldPlan.id,
        verifiedAt: new Date(),
        verifiedById: admin.id,
      },
    });
  }

  console.log("✅ Sample payment created");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });