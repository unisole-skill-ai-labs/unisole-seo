import { test, expect } from '@playwright/test';

test('home page loads and shows hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Unisole/i }).first()).toBeVisible();
});

test('trending course navigates to detail page', async ({ page }) => {
  await page.goto('/');
  await page.getByText('From Notebook to Production').first().click();
  await expect(page).toHaveURL(/\/courses\/from-notebook-to-production/);
  await expect(page.getByRole('link', { name: 'Get this course' })).toBeVisible();
});

test('courses page lists all courses', async ({ page }) => {
  await page.goto('/courses');
  await expect(page.locator('.courses-card').first()).toBeVisible();
});

test('course detail redirects to classplus', async ({ page }) => {
  await page.goto('/courses/complete-python');
  const link = page.getByRole('link', { name: 'Get this course' });
  await expect(link).toHaveAttribute('href', /classplusapp\.com/);
});
