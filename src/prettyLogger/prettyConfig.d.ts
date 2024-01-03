import { prettyLevel } from "./prettyLevel";

export interface prettyConfig {
    destinationPath: string;
    configPath : string;
    levels : prettyLevel[];
    unknownLevel: prettyLevel;
  }
  