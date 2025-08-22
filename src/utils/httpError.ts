export class HttpError extends Error {
    status: number;
    code?: string;
    constructor(status: number, message: string, code?: string) {
        super(message);
        this.status = status;
        this.code = code || 'INTERNAL_SERVER_ERROR';
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}