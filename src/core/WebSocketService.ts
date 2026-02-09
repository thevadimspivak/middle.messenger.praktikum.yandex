import { EventBus } from './EventBus';

export enum WSEvents {
  Connected = 'connected',
  Error = 'error',
  Message = 'message',
  Close = 'close',
}

interface WSMessage {
  id?: string;
  time?: string;
  user_id?: string;
  content: string;
  type: 'message' | 'ping' | 'pong' | 'get old' | 'user connected';
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

export class WebSocketService extends EventBus {
  private socket: WebSocket | null = null;

  private pingInterval: number | null = null;

  private url: string = '';

  public connect(userId: number, chatId: number, token: string): Promise<void> {
    if (this.socket) {
      this.close();
    }

    this.url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener('open', () => {
        this.startPing();
        this.emit(WSEvents.Connected);
        resolve();
      });

      this.socket.addEventListener('close', (event) => {
        this.stopPing();
        this.emit(WSEvents.Close, event);
      });

      this.socket.addEventListener('error', (error) => {
        this.emit(WSEvents.Error, error);
        reject(error);
      });

      this.socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'pong') {
            console.log('pong');
            return;
          }

          if (data.type === 'user connected') {
            return;
          }

          this.emit(WSEvents.Message, data);
        } catch (e) {
          console.error('Ошибка парсинга сообщения:', e);
        }
      });
    });
  }

  public send(content: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket не подключен');
    }

    const message: WSMessage = {
      content,
      type: 'message',
    };

    this.socket.send(JSON.stringify(message));
  }

  public getOldMessages(offset: number = 0) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket не подключен');
    }

    const message: WSMessage = {
      content: offset.toString(),
      type: 'get old',
    };

    this.socket.send(JSON.stringify(message));
  }

  public close() {
    this.stopPing();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private startPing() {
    this.pingInterval = window.setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('ping');
        const pingMessage: WSMessage = {
          content: '',
          type: 'ping',
        };
        this.socket.send(JSON.stringify(pingMessage));
      }
    }, 30000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public getState(): number {
    return this.socket?.readyState ?? WebSocket.CLOSED;
  }
}

export default new WebSocketService();
