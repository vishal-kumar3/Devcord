
export interface ICustomResponse {
    message: string;
    status?: number;
    data?: Record<string, any>;
}

export class CustomResponse {

    message: string
    status: number
    data: Record<string, any>

    constructor(message: string, status?: number, data?: Record<string, any>) {
        this.message = message
        this.status = status || 200
        this.data = data || {}
    }

}