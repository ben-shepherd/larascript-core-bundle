import { AppSingleton } from "@/app";
import { Environment } from "@/consts";
import { Kernel } from "@/kernel";
import { describe } from "@jest/globals";
import {
    LoggerProvider,
    MockFailedConnectionDatabaseProvider,
    MockSuccessfulConnectionDatabaseProvider,
    TestContainers,
} from "./providers/providers";

describe("Dependency Loader Test Suite", () => {
  describe("Kernel with successful database provider", () => {
    beforeAll(async () => {
      // Reset the kernel before each test
      Kernel.getInstance().containers.clear();
      Kernel.getInstance().preparedProviders = [];
      Kernel.getInstance().readyProviders = [];

      await Kernel.boot(
        {
          environment: Environment.testing,
          providers: [
            new LoggerProvider(),
            new MockSuccessfulConnectionDatabaseProvider(),
          ],
        },
        {},
      );
    });

    test("should have logged a connection successful, logger should contain success message", async () => {
      const database = AppSingleton.container<TestContainers, "database">(
        "database",
      );
      const logger = AppSingleton.container<TestContainers, "logger">("logger");

      await database.connect();

      expect(logger.containsLog("Connection OK")).toBeTruthy();
    });
  });

  describe("Kernel with connection failed database provider, logger should contain failed message", () => {
    beforeAll(async () => {
      // Reset the kernel before each test
      Kernel.getInstance().containers.clear();
      Kernel.getInstance().preparedProviders = [];
      Kernel.getInstance().readyProviders = [];

      await Kernel.boot(
        {
          environment: Environment.testing,
          providers: [
            new LoggerProvider(),
            new MockFailedConnectionDatabaseProvider(),
          ],
        },
        {},
      );
    });

    test("should have logged a connection failed", async () => {
      const database = AppSingleton.container<TestContainers, "database">(
        "database",
      );
      const logger = AppSingleton.container<TestContainers, "logger">("logger");

      await database.connect();

      expect(logger.containsLog("Connection FAILED")).toBeTruthy();
    });
  });
});
