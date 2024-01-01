import { prettyMessage } from "./prettyMessage";
import { prettyConfig } from "./prettyConfig";

export interface prettyLogger {
    configPath: string;
    config:prettyConfig;

  }