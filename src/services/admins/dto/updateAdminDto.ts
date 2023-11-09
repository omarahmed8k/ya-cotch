
export interface UpdateAdminDto {
    id: number;
    name: string;
    surname: string;
    emailAddress: string;
    permissionNames?: Array<string>;
}
