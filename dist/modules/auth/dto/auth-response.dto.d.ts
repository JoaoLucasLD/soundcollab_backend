export declare class AuthUserDto {
    id: string;
    email: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    tokenType: 'Bearer';
    expiresIn: number;
    user: AuthUserDto;
}
