import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
}

class LoggingService {
  private static instance: LoggingService;
  private logDir: string;
  private logLevel: LogLevel;
  
  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
    
    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const message = entry.message;
    const context = entry.context ? JSON.stringify(entry.context) : '';
    
    return `[${timestamp}] [${levelName}] ${message} ${context}`;
  }

  private writeToFile(filename: string, content: string) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content + '\n');
  }

  private log(level: LogLevel, message: string, context?: any, entry?: Partial<LogEntry>) {
    if (!this.shouldLog(level)) return;
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...entry
    };
    
    const formattedLog = this.formatLogEntry(logEntry);
    
    // Console output
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.CRITICAL:
        console.error(`🔥 CRITICAL: ${formattedLog}`);
        break;
    }
    
    // File output
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}.log`;
    this.writeToFile(filename, formattedLog);
    
    // Error logs go to separate file
    if (level >= LogLevel.ERROR) {
      const errorFilename = `${date}-error.log`;
      this.writeToFile(errorFilename, formattedLog);
    }
  }

  debug(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.DEBUG, message, context, entry);
  }

  info(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.INFO, message, context, entry);
  }

  warn(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.WARN, message, context, entry);
  }

  error(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.ERROR, message, context, entry);
  }

  critical(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.CRITICAL, message, context, entry);
  }

  // Request logging middleware
  requestLogger() {
    return (req: Request, res: Response, next: any) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      
      // Add request ID to request object
      (req as any).requestId = requestId;
      
      this.info(`Request started: ${req.method} ${req.path}`, {
        requestId,
        method: req.method,
        endpoint: req.path,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        this.info(`Request completed: ${req.method} ${req.path}`, {
          requestId,
          method: req.method,
          endpoint: req.path,
          statusCode: res.statusCode,
          responseTime
        });
        
        if (res.statusCode >= 400) {
          this.error(`Request failed: ${req.method} ${req.path}`, {
            requestId,
            method: req.method,
            endpoint: req.path,
            statusCode: res.statusCode,
            responseTime
          });
        }
      });
      
      next();
    };
  }

  // Error logging middleware
  errorLogger() {
    return (error: any, req: Request, res: Response, next: any) => {
      const requestId = (req as any).requestId || 'unknown';
      
      this.error(`Unhandled error: ${error.message}`, {
        requestId,
        method: req.method,
        endpoint: req.path,
        error: error.stack,
        userId: (req as any).user?.id
      });
      
      next(error);
    };
  }

  // Get log files
  getLogFiles(): string[] {
    if (!fs.existsSync(this.logDir)) {
      return [];
    }
    
    return fs.readdirSync(this.logDir)
      .filter(file => file.endsWith('.log'))
      .sort()
      .reverse();
  }

  // Read log file
  readLogFile(filename: string, lines: number = 100): string[] {
    const filePath = path.join(this.logDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const logLines = content.split('\n').filter(line => line.trim());
    
    return logLines.slice(-lines);
  }
}

export default LoggingService.getInstance();