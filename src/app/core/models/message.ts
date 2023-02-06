import invariant from 'invariant';
import { MessageType } from './message-type'

export class Message {
  readonly type: MessageType;
  readonly content: string;
  readonly data: any;
  readonly location: string;
  readonly stackTrace: string;
  readonly timestamp: Date;

  constructor(
    type: MessageType,
    content: string,
    data?: any,
    location?: string,
    stackTrace?: string) {
    invariant(type, 'Type is required');
    invariant(content, 'Content is required');
    this.type = type;
    this.content = content;
    this.data = data;
    this.location = location;
    this.stackTrace = stackTrace;
    this.timestamp = new Date();
  }

  static CreateVerbose(content: string, data?: any, location?: string, stackTrace?: string): Message {
    return new Message(MessageType.Verbose, content, data, location, stackTrace);
  }

  static CreateDebug(content: string, data?: any, location?: string, stackTrace?: string): Message {
    return new Message(MessageType.Debug, content, data, location, stackTrace);
  }

  static CreateInfo(content: string, data?: any, location?: string, stackTrace?: string): Message {
    return new Message(MessageType.Info, content, data, location, stackTrace);
  }

  static CreateWarning(content: string, data?: any, location?: string, stackTrace?: string): Message {
    return new Message(MessageType.Warning, content, data, location, stackTrace);
  }

  static CreateError(content: string, data?: any, location?: string, stackTrace?: string): Message {
    return new Message(MessageType.Error, content, data, location, stackTrace);
  }

  static CreateFatal(content: string, data?: any, location?: string, stackTrace?: string): Message {
    return new Message(MessageType.Fatal, content, data, location, stackTrace);
  }
}
