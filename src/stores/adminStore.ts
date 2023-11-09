import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { AdminDto } from '../services/admins/dto/adminDto';
import adminsService from '../services/admins/adminsService';
import { CreateAdminDto } from '../services/admins/dto/createAdminDto';
import { UpdateAdminDto } from '../services/admins/dto/updateAdminDto';
import userService from '../services/user/userService';

class AdminStore extends StoreBase {
  @observable admins: Array<AdminDto> = [];
  @observable loadingAdmins = true;
  @observable isSubmittingAdmin = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable adminModel?: AdminDto = undefined;
  @observable keyword?: string = undefined;
  @observable isActiveFilter?: boolean = undefined;

  @action
  async getAdmins() {
    await this.wrapExecutionAsync(async () => {
      let result = await adminsService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword
      });
      this.admins = result.items;
      this.totalCount = result.totalCount;
    }, () => {
      this.loadingAdmins = true;
    }, () => {
      this.loadingAdmins = false;
    });
  }

  @action
  async createAdmin(input: CreateAdminDto) {
    await this.wrapExecutionAsync(async () => {
      await adminsService.createAdmin(input);
      await this.getAdmins();
      notifySuccess();
    }, () => {
      this.isSubmittingAdmin = true;
    }, () => {
      this.isSubmittingAdmin = false;
    });
  }

  @action
  async updateAdmin(input: UpdateAdminDto) {
    await this.wrapExecutionAsync(async () => {
      await adminsService.updateAdmin(input);
      await this.getAdmins();
      notifySuccess();
    }, () => {
      this.isSubmittingAdmin = true;
    }, () => {
      this.isSubmittingAdmin = false;
    });
  }


  @action
  async getAdmin(input: EntityDto) {
    let admin = this.admins.find(c => c.id === input.id);
    if (admin !== undefined) {
      this.adminModel = {
        id: admin.id,
        name: admin.name,
        isActive: admin.isActive,
        emailAddress: admin.emailAddress,
        surname: admin.surname,
        fullName: admin.fullName,
        creationTime: admin.creationTime,
        permissionNames: admin.permissionNames
      };
    }
  }


  @action
  async deleteAdmin(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      await adminsService.deleteAdmin(input);
      await this.getAdmins();
      notifySuccess();
    }, () => {
      this.loadingAdmins = true;
    }, () => {
      this.loadingAdmins = false;
    });
  }

  @action
  async adminActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await userService.userActivation(input);
      await this.getAdmins();
      notifySuccess();
    }, () => {
      this.loadingAdmins = true;
    }, () => {
      this.loadingAdmins = false;
    });
  }
  @action
  async adminDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await userService.userDeactivation(input);
      await this.getAdmins();
      notifySuccess();
    }, () => {
      this.loadingAdmins = true;
    }, () => {
      this.loadingAdmins = false;
    });
  }
}

export default AdminStore;
