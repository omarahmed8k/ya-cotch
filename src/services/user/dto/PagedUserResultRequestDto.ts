import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';
import UserType from '../../types/userType';

export interface PagedUserResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword?: string,
    type?: UserType;
}
