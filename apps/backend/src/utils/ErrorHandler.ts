export interface IError {
    message: string;
    status?: number;
    data?: Record<string, any>;
}

export class CustomError extends Error {
    status: number
    data: Record<string, any>
    constructor(message: string, status?: number, data?: Record<string, any>) {
        super(message)
        this.status = status || 500
        this.data = data || {}
    }
}
