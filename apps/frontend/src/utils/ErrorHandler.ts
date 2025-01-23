

export const ErrorHandler = (error: any) =>  {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return { error: 'Unauthorized', msg: 'Invalid token'}
      case 403:
        return { error: 'Forbidden', msg: 'Rate limit exceeded or insufficient permissions'}
      case 404:
        return { error: 'Not Found', msg:'The requested resource doesn\'t exist'}
      case 422:
        return { msg: 'Validation Failed',error: error.response.data.errors}
      case 500:
        return { error: 'Server Error', msg:'Something went wrong on GitHub\'s end'}
      case 503:
        return { error: 'Service Unavailable', msg:'GitHub is down or being upgraded'}
      default:
        return { status:error.response.status, error:error.response.data}
    }
  } else if (error.request) {
    return { error: 'Network Error:', msg:error.message}
  } else {
    return { error: 'Error:', msg:error.message}
  }
}
