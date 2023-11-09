import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import AdminStore from './adminStore';
import CategoryStore from './categoryStore';
import CourseStore from './courseStore';
import TrainerStore from './trainerStore';
import IndexStore from './indexStore';
import DishStore from './dishStore';
import RestaurantStore from './restaurantStore';
import LocationStore from './locationStore';
import RestaurantManagerStore from './restaurantManagerStore';
import ProductStore from './productStore';
import ShopStore from './shopStore';
import BookingRequestStore from './bookingRequestStore';
import TraineeStore from './traineeStore';
import PaymentStore from './paymentStore';
import SubscriptionStore from './subscriptionStore';
import OrderStore from './orderStore';
import ShopManagerStore from './shopManagerStore';
import StoryStore from './storyStore'

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    adminStore: new AdminStore(),
    categoryStore: new CategoryStore(),
    courseStore: new CourseStore(),
    trainerStore: new TrainerStore(),
    indexStore: new IndexStore(),
    dishStore: new DishStore(),
    restaurantStore: new RestaurantStore(),
    locationStore:new LocationStore(),
    restaurantManagerStore: new RestaurantManagerStore(),
    shopManagerStore: new ShopManagerStore(),
    productStore: new ProductStore(),
    shopStore: new ShopStore(),
    bookingRequestStore: new BookingRequestStore(),
    traineeStore: new TraineeStore(),
    paymentStore: new PaymentStore(),
    subscriptionStore: new SubscriptionStore(),
    orderStore: new OrderStore(),
    storyStore : new StoryStore()

  };
}
