import { When, Then, Given, After } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import expect from 'expect';
import { execSync } from 'child_process';
import { PrismaService } from '../../src/core/prisma/prisma.service';
import { deepCompare } from '../_helper/deep-compare';

const apiBaseUrl = 'http://localhost:3000';
let apiToken: string | null = null;
let apiResponse: AxiosResponse;

Given('I use seed data', () => {
  execSync('npx prisma migrate reset --force > /dev/null');
  execSync('npm run database:seed > /dev/null');
});

Given('there are no articles in the database', async () => {
  const prisma = new PrismaService();
  await prisma.article.deleteMany();
  await prisma.$disconnect();
});

Given('two articles exist with the exact same publication date', async () => {
  const prisma = new PrismaService();
  await prisma.article.deleteMany();
  const sameDate = new Date('2026-08-15T12:00:00.000Z');
  await prisma.article.createMany({
    data: [
      {
        id: '5e1f0a2b-0002-4000-8000-000000000002',
        title: 'Second UUID Article',
        content: 'Published at the exact same timestamp.',
        publishedAt: sameDate,
      },
      {
        id: '5e1f0a2b-0001-4000-8000-000000000001',
        title: 'First UUID Article',
        content: 'Published at the exact same timestamp.',
        publishedAt: sameDate,
      },
    ],
  });
  await prisma.$disconnect();
});

Given('I use admin token', async () => {
  apiToken = 'admin-token';
});

Given('I use destructive actions token', async () => {
  apiToken = 'destructive-actions-token';
});

When(
  'I send a {string} request to {string}',
  async (method: string, path: string) => {
    const url = `${apiBaseUrl}${path}`;
    apiResponse = await axios.request({
      method: method,
      url: url,
      validateStatus: () => true,
      headers: apiToken === '' ? {} : { Authorization: `Bearer ${apiToken}` },
    });
  },
);

When(
  'I send a {string} request to {string} with body:',
  async (method: string, path: string, body: string) => {
    const url = `${apiBaseUrl}${path}`;
    apiResponse = await axios.request({
      method: method,
      url: url,
      data: JSON.parse(body),
      validateStatus: () => true,
      headers: apiToken === '' ? {} : { Authorization: `Bearer ${apiToken}` },
    });
  },
);

Then('the response status should be {int}', (statusCode: number) => {
  expect(apiResponse.status).toBe(statusCode);
});

Then(
  'the response body should have the property {string}',
  (property: string) => {
    expect(apiResponse.data).toHaveProperty(property);
  },
);

Then('the response body should contain:', async function (docString: string) {
  const expected = JSON.parse(docString);
  const actual = apiResponse.data;

  deepCompare(actual, expected);
});

Then('the response list should have {int} items', (count: number) => {
  expect(Array.isArray(apiResponse.data)).toBe(true);
  expect(apiResponse.data).toHaveLength(count);
});

Then(
  'the response list item at index {int} should have property {string} equal to {string}',
  (index: number, property: string, value: string) => {
    expect(apiResponse.data[index][property]).toBe(value);
  },
);

Then('I dump response', () => {
  console.log(JSON.stringify(apiResponse.data));
});

After(() => {
  apiToken = null;
});
