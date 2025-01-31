
interface IGithubError {
    message: string;
    status: string;
    documentation_url: string;
}

// export const githubErrorHandler = ({ message, status, documentation_url }: IGithubError) =>  {
//     switch (Number(status)) {
//       case 401:
//         return { error: 'Unauthorized', msg: 'Invalid token'}
//       case 403:
//         return { error: 'Forbidden', msg: 'Rate limit exceeded or insufficient permissions'}
//       case 404:
//         return { error: 'Not Found', msg:'The reqd resource doesn\'t exist'}
//       case 422:
//         return { msg: 'Validation Failed',error: error.response.data.errors}
//       case 500:
//         return { error: 'Server Error', msg:'Something went wrong on GitHub\'s end'}
//       case 503:
//         return { error: 'Service Unavailable', msg:'GitHub is down or being upgraded'}
//       default:
//         return { status:error.response.status, error:error.response.data}
//     }
    
// }

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
