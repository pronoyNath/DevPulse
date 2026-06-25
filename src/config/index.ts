import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  nodeEnv: process.env.NODE_ENV || ("development" as string),
  connectionString: process.env.CONNECTIONSTRING || ("" as string),
  port: process.env.PORT || (5000 as number),
  secretKey: process.env.JWT_SECRET || ("" as string),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || ("1d" as string),
};

export default config;
