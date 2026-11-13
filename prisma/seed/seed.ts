import { PrismaService } from '../../src/core/prisma/prisma.service';

const prisma = new PrismaService();

export const SEED_ARTICLES = [
  {
    id: '5e1f0a2b-0001-4000-8000-000000000001',
    title: 'Getting Started with NestJS and Prisma 7',
    content:
      'In this article, we explore how to structure a modern NestJS back-end application using CQRS and Prisma 7 with PostgreSQL.',
    publishedAt: new Date('2026-08-01T10:00:00.000Z'),
  },
  {
    id: '5e1f0a2b-0002-4000-8000-000000000002',
    title: 'Understanding Clean Architecture in TypeScript',
    content:
      'Separating domain models, application queries, and infrastructure adapters keeps business logic clean and easy to test.',
    publishedAt: new Date('2026-08-05T14:30:00.000Z'),
  },
  {
    id: '5e1f0a2b-0003-4000-8000-000000000003',
    title: 'Functional Testing with Cucumber and Gherkin',
    content:
      'Behavior-driven development allows teams to verify API contracts using readable Given-When-Then scenarios.',
    publishedAt: new Date('2026-08-10T09:15:00.000Z'),
  },
];

export async function main() {
  for (const article of SEED_ARTICLES) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        content: article.content,
        publishedAt: article.publishedAt,
      },
      create: article,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error(e);
    process.exit(1);
  });
