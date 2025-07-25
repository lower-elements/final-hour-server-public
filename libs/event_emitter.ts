export type EventCallback<T> = (data: T) => void;

export default class EventEmitter<T> {
    private events: { [key: string]: EventCallback<T>[] };
    constructor() {
        this.events = {};
    }

    on(eventName: string, callback: EventCallback<T>): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName: string, data?: T): void {
        if (this.events[eventName]) {
            this.events[eventName].forEach((callback) => {
                callback((data ?? this) as T);
            });
        }
    }

    cancel(eventName: string, callback: EventCallback<T>): void {
        const listeners = this.events[eventName];
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    removeListener(eventName: string, callback: EventCallback<T>): void {
        this.cancel(eventName, callback);
    }
    off(eventName: string, callback: EventCallback<T>): void {
        this.cancel(eventName, callback);
    }

    removeAllListeners(eventName?: string): void {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }
    once(eventName: string, callback: EventCallback<T>): void {
        this.on(eventName, (data) => {
            callback(data);
            this.cancel(eventName, callback);
        });
    }
    listenerCount(eventName: string): number {
        if (eventName in this.events) {
            return this.events[eventName].length;
        }
        return 0;
    }
}
