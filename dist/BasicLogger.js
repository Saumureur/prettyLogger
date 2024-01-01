"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicLogger = void 0;
var fs = require("fs");
var path = require("path");
var BasicLogger = /** @class */ (function () {
    function BasicLogger(configPath) {
        // Résoudre le chemin absolu du fichier de configuration
        this.configPath = path.resolve(configPath);
        // Charger le fichier de configuration depuis le chemin spécifié
        var configContent = fs.readFileSync(this.configPath, 'utf-8');
        this.config = JSON.parse(configContent);
        this.memoryDate = new Date();
        // Vérifier si le répertoire de destination existe, sinon le créer
        if (!fs.existsSync(this.config.destinationPath)) {
            fs.mkdirSync(this.config.destinationPath, { recursive: true });
        }
    }
    BasicLogger.prototype.log = function (message) {
        var currentDate = new Date();
        //if (this.memoryDate.getDate() !== currentDate.getDate()) {
        this.removeOldFiles();
        this.memoryDate = currentDate;
        //}
        var logFilePath = this.getLogFilePath(message.level);
        // Écrire le message dans le fichier de log
        fs.appendFileSync(logFilePath, this.formatLogMessage(message));
        return null;
    };
    BasicLogger.prototype.getLogFilePath = function (level) {
        var dateString = new Date().toISOString().split("T")[0];
        var logFileName = "".concat(dateString, "_").concat(level, ".log");
        return path.join(this.config.destinationPath, logFileName);
    };
    BasicLogger.prototype.formatLogMessage = function (message) {
        var formattedMessage = {
            level: message.level,
            message: message.message,
            object: message.object,
            date: new Date().toISOString().split("T")[0]
        };
        return "".concat(JSON.stringify(formattedMessage), "\n\n");
    };
    BasicLogger.prototype.removeOldFiles = function () {
        var _this = this;
        var currentDate = new Date();
        // Parcourir chaque niveau de log défini dans la configuration
        this.config.levels.forEach(function (level) {
            console.log(level);
            var logFilePattern = new RegExp("\\d{4}-\\d{2}-\\d{2}_".concat(level.name, "\\.log"));
            // Lister tous les fichiers correspondant au pattern dans le répertoire de destination
            var files = fs.readdirSync(_this.config.destinationPath);
            console.log(files);
            files.forEach(function (file) {
                if (logFilePattern.test(file)) {
                    console.log("yoyoyo");
                    // Extraire la date du nom du fichier
                    var fileDate = new Date(file.split('_')[0]);
                    console.log(file + " : " + file.split('_')[0]);
                    // Calculer la date d'expiration en fonction de la durée spécifiée dans la configuration
                    var expirationDate = new Date(fileDate.getTime() + level.duration * 24 * 60 * 60 * 1000);
                    console.log(expirationDate);
                    // Vérifier si le fichier est plus vieux que la date d'expiration
                    if (currentDate > expirationDate) {
                        // Supprimer le fichier s'il a dépassé sa date de péremption
                        fs.unlinkSync(path.join(_this.config.destinationPath, file));
                    }
                }
            });
        });
    };
    return BasicLogger;
}());
exports.BasicLogger = BasicLogger;
