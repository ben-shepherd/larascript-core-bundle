import { AppSingleton } from "@/app";
import { BaseProvider } from "@/base";
import LoggerService from "../services/LoggerService";
import MockDatabaseService from "../services/MockDatabaseService";

export type TestContainers = {
  example: string;
  object: {
    value: 1;
  };
  logger: LoggerService;
  database: MockDatabaseService;
};

export class TestProvider extends BaseProvider {
  async register(): Promise<void> {
    this.bind("example", "hello world");
    this.bind("object", { value: 1 });
  }
}

export class LoggerProvider extends BaseProvider {
  async register(): Promise<void> {
    this.bind("logger", new LoggerService());
  }
}

export class MockSuccessfulConnectionDatabaseProvider extends BaseProvider {
  async register(): Promise<void> {
    const database = new MockDatabaseService({
      connectionWillSucceed: true,
    });
    database.setDepdencyLoader(AppSingleton.container);

    this.bind("database", database);
  }
}

export class MockFailedConnectionDatabaseProvider extends BaseProvider {
  async register(): Promise<void> {
    const database = new MockDatabaseService({
      connectionWillSucceed: false,
    });
    database.setDepdencyLoader(AppSingleton.container);

    this.bind("database", database);
  }
}
