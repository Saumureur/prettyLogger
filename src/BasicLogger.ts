import { prettyConfig } from "./prettyLogger/prettyConfig";
import { prettyLogger } from "./prettyLogger/prettyLogger";
import { prettyMessage } from "./prettyLogger/prettyMessage";
import * as fs from "fs";
import * as path from 'path';

export class BasicLogger implements prettyLogger {
  config: prettyConfig;
  configPath: string;
  memoryDate: Date;

  constructor(configPath: string) {
    // Résoudre le chemin absolu du fichier de configuration
    this.configPath = path.resolve(configPath);

    // Charger le fichier de configuration depuis le chemin spécifié
    const configContent = fs.readFileSync(this.configPath, 'utf-8');
    this.config = JSON.parse(configContent);

    this.memoryDate = new Date();

    // Vérifier si le répertoire de destination existe, sinon le créer
    if (!fs.existsSync(this.config.destinationPath)) {
      fs.mkdirSync(this.config.destinationPath, { recursive: true });
    }
  }

  log(message: prettyMessage): null {
    const currentDate = new Date();
    //if (this.memoryDate.getDate() !== currentDate.getDate()) {
        this.removeOldFiles();
        this.memoryDate = currentDate;
    //}

    const logFilePath = this.getLogFilePath(message.level);

    // Écrire le message dans le fichier de log
    fs.appendFileSync(logFilePath, this.formatLogMessage(message));

    return null;
  }
  
  private getLogFilePath(level: string): string {
    const dateString = new Date().toISOString().split("T")[0];
    const logFileName = `${dateString}_${level}.log`;
    return path.join(this.config.destinationPath, logFileName);
}

  
private formatLogMessage(message: prettyMessage): string {
    const formattedMessage = {
        level: message.level,
        message: message.message,
        object: message.object,
        date: new Date().toISOString().split("T")[0]
    };

    return `${JSON.stringify(formattedMessage)}\n\n`;
}

removeOldFiles(): void {
  const currentDate = new Date();

  const levelsToCheck = [...this.config.levels, this.config.unknownLevel];
  levelsToCheck.forEach((level) => {
    console.log(level)
    const logFilePattern = new RegExp(`\\d{4}-\\d{2}-\\d{2}_${level.name}\\.log`);

    // Lister tous les fichiers correspondant au pattern dans le répertoire de destination
    const files = fs.readdirSync(this.config.destinationPath);

    files.forEach((file) => {
      if (logFilePattern.test(file)) {
        // Extraire la date du nom du fichier
        const fileDate = new Date(file.split('_')[0]);
        console.log(file + " : " + file.split('_')[0])
       
        // Calculer la date d'expiration en fonction de la durée spécifiée dans la configuration
        const expirationDate = new Date(fileDate.getTime() + level.duration * 24 * 60 * 60 * 1000);
        console.log(expirationDate)
        // Vérifier si le fichier est plus vieux que la date d'expiration
        if (currentDate > expirationDate) {
          // Supprimer le fichier s'il a dépassé sa date de péremption
          fs.unlinkSync(path.join(this.config.destinationPath, file));
        }
      }
    });
  });
}

  }