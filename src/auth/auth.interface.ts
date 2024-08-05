import { HttpStatus } from '@nestjs/common';

export interface AuthResponse {
    /** Status */
    httpStatus: HttpStatus;
    /** Token */
    token?: string;
}
