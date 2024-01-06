
export type prettyLevel ={
    value: number;
    name: string;
    color: string;
    duration:number;
}

export type prettyConfig ={
    destinationPath: string;
    configPath : string;
    levels : prettyLevel[];
    unknownLevel: prettyLevel;
  }
  
  export type prettyMessage ={
    message: string;
    object: any[];
    level:string;
  }

  export type prettyLogger ={
    configPath: string;
    config:prettyConfig;
  }