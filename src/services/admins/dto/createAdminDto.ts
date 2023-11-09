
export interface CreateAdminDto {
    name: string;
    surname: string;
    emailAddress: string;
    permissionNames?: Array<string>;
    password: string;
}
