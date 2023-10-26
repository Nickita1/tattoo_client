export interface ApiValidationError {
    path: string,
    message: string
}

export const toValidationErrorString = 
    (error: ApiValidationError): string => `${error?.path && error.path.split('/body/')[1]} ${error.message}`;