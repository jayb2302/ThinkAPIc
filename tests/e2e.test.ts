import { test, expect } from "@playwright/test";
import seedDatabase from "../src/database/seed";

export default function FullstackTestCollection() {
  test.describe("Fullstack E2E Flow", () => {
    test.beforeAll(async ({ request }) => {
      // Seed the database only once before all tests
      await seedDatabase();
      // Register test user
      const res = await request.post(
        "http://localhost:4000/api/auth/register",
        {
          data: {
            username: "Anna",
            email: "anna@gmail.com",
            password: "anna1234",
            role: "student",
          },
        }
      );
      expect(res.status()).toBe(201); // confirm user was created

      await new Promise((r) => setTimeout(r, 1000));

      console.log("👤 Anna student user registered (if not already present)");
    });

    test.beforeEach(async ({ page }) => {
      // Go to frontend and login
      await page.goto("http://localhost:5173");
      console.log("🧪 Navigated to frontend");
      await page.screenshot({ path: "page-loaded.png" });
      await page.click('button:has-text("Login")');
      await page.fill('input[type="email"]', "anna@gmail.com");
      await page.fill('input[type="password"]', "anna1234");
      await page.click('button:has-text("Sign-In")');
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000); // buffer
      console.log("🔑 Logged in as Anna");
      await page.screenshot({ path: "login-success.png" });
    });

    test("Login via frontend UI", async ({ page }) => {
      await expect(page).toHaveURL("http://localhost:5173/");
    });

    test("Navigate to and open any topic", async ({ page }) => {
      // Go to Topics page
      await page.goto("http://localhost:5173/topics");
      console.log("🔍 Navigated to Topics page");
      await page.screenshot({ path: "topics-page.png" });

      await page.waitForSelector(".topic-card");
      const topicCards = await page.locator(".topic-card").count();
      console.log(`🧩 Found ${topicCards} topic cards`);
      // Click the first "View Topic" link and check URL
      await page.getByRole("link", { name: "View Topic" }).first().click();
      await expect(page).toHaveURL(/\/topics\/.*/);
      await page.screenshot({ path: "topic-opened.png" });
    });

   test("Complete quiz for a topic", async ({ page }) => {
      await page.goto("http://localhost:5173/topics");
      console.log("🔍 Navigated to Topics page");
      await page.screenshot({ path: "topics-page.png" });

      await page.waitForSelector(".topic-card");
      const topicCards = await page.locator(".topic-card").count();
      console.log(`🧩 Found ${topicCards} topic cards`);

      // Click on first "View Topic"
      await page
        .locator(".topic-card")
        .first()
        .getByRole("link", { name: "View Topic" })
        .click();
      console.log("✅ Clicked View Topic");
      await page.screenshot({ path: "after-view-topic.png" });

      // Open quiz dialog
      await page.getByRole("button", { name: "Take Quiz" }).click();
      await page.waitForSelector(".p-dialog"); // wait for quiz dialog
      console.log("✅ Opened Quiz Dialog");
      await page.screenshot({ path: "quiz-dialog-opened.png" });
      await page.waitForTimeout(1000); // wait for dialog to fully render
      await expect(page.locator(".p-dialog")).toBeVisible();

      // Loop through quizzes - more defensive logic
      while (await page.locator('button:has-text("Next")').isVisible().catch(() => false)) {
        const radios = await page.locator('input[type="radio"]').elementHandles();
        if (radios.length > 0) {
          await radios[0].click();
          await page.getByRole("button", { name: "Next" }).click();
          console.log("➡ Clicked Next");
          await page.screenshot({ path: `quiz-next-${Date.now()}.png` });
        } else {
          console.warn("⚠️ No radio buttons found. Skipping...");
          break;
        }
      }

      // Final question
      if (await page.locator('button:has-text("Submit All")').isVisible().catch(() => false)) {
        const radios = await page.locator('input[type="radio"]').elementHandles();
        if (radios.length > 0) {
          await radios[0].click();
        }
        console.log("✅ Selected final answer");
        await page.screenshot({ path: "before-submit.png" });
        await page.getByRole("button", { name: "Submit All" }).click();
        console.log("✅ Submitted quiz");
      }
      await page.screenshot({ path: 'before-results.png' });
      console.log("🕐 Waiting for Results dialog...");
      // Verify results
      await expect(
        page.locator('div[role="dialog"] h2:text("Results")')
      ).toBeVisible({ timeout: 10000 });
      await page.screenshot({ path: "Results.png" });
    });
  });
}
