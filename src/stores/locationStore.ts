import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import { LocationDto } from '../services/locations/dto/locationDto';
import locationsService from '../services/locations/locationsService';
import { CreateLocationDto } from '../services/locations/dto/createLocationDto';
import { UpdateLocationDto } from '../services/locations/dto/updateLocationDto';
import LocationType from '../services/types/locationType';
import { EntityDto } from '../services/dto/entityDto';

class LocationStore extends StoreBase {
  @observable countries: Array<LocationDto> = [];
  @observable cities: Array<LocationDto> = [];
  @observable neighbourhoods: Array<LocationDto> = [];
  @observable loadingLocations = true;
  @observable isSubmittingLocation = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable citiesTotalCount: number = 0;
  @observable countriesTotalCount: number = 0;
  @observable neighbourhoodsTotalCount: number = 0;
  @observable parentId: number = 0;
  @observable locationModel?: LocationDto = undefined;
  @observable isActiveFilterCountry?:boolean=undefined;
  @observable parentIdFilterCity?:number=undefined;
  @observable isActiveFilterCity?:boolean=undefined;
  @observable parentIdFilterNeighbourhood?:number=undefined;
  @observable isActiveFilterNeighbourhood?:boolean=undefined;
  @observable keywordNeighbourhood?:string=undefined;
  @observable keywordCity?:string=undefined;
  @observable keywordCountry?:string=undefined;

  @action
  async getCountries() {
    await this.wrapExecutionAsync(async () => {
      let result = await locationsService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        type:LocationType.Country,
        isActive:this.isActiveFilterCountry,
        keyword:this.keywordCountry
      });
      this.countries = result.items;
      this.countriesTotalCount=result.totalCount;
    }, () => {
      this.loadingLocations = true;
    }, () => {
      this.loadingLocations = false;
    });
  }

  @action
  async getCities() {
    await this.wrapExecutionAsync(async () => {
      let result = await locationsService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        type:LocationType.City,
        parentId:this.parentIdFilterCity,
        isActive:this.isActiveFilterCity,
        keyword:this.keywordCity

        //parentId:this.parentId !== 0 ? this.parentId : undefined
      });
      this.cities = result.items;
      this.citiesTotalCount=result.totalCount;
    }, () => {
      this.loadingLocations = true;
    }, () => {
      this.loadingLocations = false;
    });
  }

  @action
  async getNeighbourhoods() {
    await this.wrapExecutionAsync(async () => {
      let result = await locationsService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        type:LocationType.Neighbourhood,
        parentId:this.parentIdFilterNeighbourhood,
        isActive:this.isActiveFilterNeighbourhood,
        keyword:this.keywordNeighbourhood

        //parentId:this.parentId
      });
      this.neighbourhoods = result.items;
      this.neighbourhoodsTotalCount=result.totalCount;
    }, () => {
      this.loadingLocations = true;
    }, () => {
      this.loadingLocations = false;
    });
  }

  @action
  async createLocation(input: CreateLocationDto) {
    await this.wrapExecutionAsync(async () => {
      await locationsService.createLocation(input);
      notifySuccess();
    }, () => {
      this.isSubmittingLocation = true;
    }, () => {
      this.isSubmittingLocation = false;
    });
  }

  @action
  async updateLocation(input: UpdateLocationDto) {
    await this.wrapExecutionAsync(async () => {
      await locationsService.updateLocation(input);
      notifySuccess();
    }, () => {
      this.isSubmittingLocation = true;
    }, () => {
      this.isSubmittingLocation = false;
    });
  }


  @action
  async getCountry(id:number) {
    let location = this.countries.find(c => c.id === id);
    if (location !== undefined) {
      this.locationModel = {
        id: location.id,
        arName:location.arName,
        enName:location.enName,
        parent:location.parent,
        parentId:location.parentId,
        isActive:location.isActive
      };
    }
  }

  @action
  async getCity(id:number) {
    let location = this.cities.find(c => c.id === id);
    if (location !== undefined) {
      this.locationModel = {
        id: location.id,
        arName:location.arName,
        enName:location.enName,
        parent:location.parent,
        parentId:location.parentId,
        isActive:location.isActive
      };
    }
  }

  @action
  async getNeighbourhood(id:number) {
    let location = this.neighbourhoods.find(c => c.id === id);
    if (location !== undefined) {
      this.locationModel = {
        id: location.id,
        arName:location.arName,
        enName:location.enName,
        parent:location.parent,
        parentId:location.parentId,
        isActive:location.isActive
      };
    }
  }

  @action
  async locationActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await locationsService.locationActivation(input);
      notifySuccess();
    }, () => {
      this.loadingLocations = true;
    }, () => {
      this.loadingLocations = false;
    });
  }
  @action
  async locationDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await locationsService.locationDeactivation(input);
      notifySuccess();
    }, () => {
      this.loadingLocations = true;
    }, () => {
      this.loadingLocations = false;
    });
  }

}

export default LocationStore;
