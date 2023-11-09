
export interface AdminDto {
    id: number;
    name: string;
    surname: string;
    emailAddress: string;
    isActive?: boolean;
    fullName?: string;
    creationTime?: string;
    permissionNames?: Array<string>;
}
