import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
    constructor(
        message: string,
        statusCode: HttpStatus,
        public readonly errorCode?: string,
        public readonly details?
    ) {
        super(
            {
                message,
                errorCode,
                details,
                timestamp: new Date().toISOString(),
            },
            statusCode
        );
    }
}

//400
export class ValidationException extends AppException {
    constructor(message: string, details?) {
        super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
    }
}

//404
export class ResourceNotFoundException extends AppException {
    constructor(resourceType: string, identifier: string | number) {
        super(
            `${resourceType} with identifier ${identifier} not found`,
            HttpStatus.NOT_FOUND,
            'RESOURCE_NOT_FOUND'
        );
    }
}

//401
export class AuthenticationException extends AppException {
    constructor(message = 'Authentication failed') {
        super(message, HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
    }
}

export class ServiceException extends AppException {
    constructor(message: string, details?) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE, '_ERROR', details);
    }
}
