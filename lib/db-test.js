import { db } from "./prisma";

export async function testDatabaseConnection() {
  try {
    // Simple query to test connection
    await db.$queryRaw`SELECT 1`;
    return { success: true, message: "Database connected successfully" };
  } catch (error) {
    return { 
      success: false, 
      message: "Database connection failed", 
      error: error.message 
    };
  }
}

export async function healthCheck() {
  try {
    const result = await testDatabaseConnection();
    return {
      status: result.success ? "healthy" : "unhealthy",
      database: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      database: { success: false, message: error.message },
      timestamp: new Date().toISOString(),
    };
  }
}
