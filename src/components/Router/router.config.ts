import LoadableComponent from './../Loadable/index';
import { HomeOutlined, UserOutlined, BookOutlined, TagsOutlined, SlidersOutlined, ShoppingOutlined, RiseOutlined, BellOutlined, EnvironmentOutlined, TrophyOutlined, ShoppingCartOutlined, CoffeeOutlined, SolutionOutlined, ShopOutlined, DollarOutlined } from '@ant-design/icons';

export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../../components/Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../scenes/Login')),
    showInMenu: false,
  },
];

export const appRouters: any = [
  {
    path: '/',
    exact: true,
    name: 'home',
    // permission: '',
    title: 'Home',
    component: LoadableComponent(() => import('../../components/Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // permission: '',
    title: 'Dashboard',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
  },

  {
    // permission: 'TrainersManagement',
    title: 'Trainers',
    name: 'trainer-menu',
    icon: TrophyOutlined,
    showInMenu: true,

  },
  {
    path: '/trainers',
    // permission: 'TrainersManagement',
    title: 'Trainers',
    baseMenuItem: 'trainer-menu',
    name: 'trainer',
    icon: TrophyOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Trainers')),
  },
  {
    path: "/trainer/:id",
    // permission: 'TrainersManagement',
    title: 'TrainerDetails',
    name: 'trainerDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Trainers/TrainerDetails')),
  },
  {
    path: '/specializations',
    // permission: 'IndicesManagement',
    title: 'Specializations',
    name: 'specialization',
    baseMenuItem: 'trainer-menu',
    icon: SlidersOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Specializations')),
  },



  {
    path: '/trainees',
    // permission: 'TraineesManagement',
    title: 'Trainees',
    name: 'trainee',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Trainees')),
  },
  {
    path: "/trainee/:id",
    // permission: 'TraineesManagement',
    title: 'TraineeDetails',
    name: 'traineeDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Trainees/TraineeDetails')),
  },


  {
    title: 'Courses',
    // permission: 'CoursesManagement',
    name: 'course-menu',
    icon: SolutionOutlined,
    showInMenu: true,

  },
  {
    path: '/courses',
    // permission: 'CoursesManagement',
    title: 'Courses',
    baseMenuItem: 'course-menu',
    name: 'course',
    icon: SolutionOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Courses')),
  },
  {
    path: '/booking-requests',
    // permission: 'CoursesManagement',
    title: 'BookingRequests',
    baseMenuItem: 'course-menu',
    name: 'bookingRequest',
    icon: RiseOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/BookingRequests')),
  },
  {
    path: "/course/:id",
    // permission: 'CoursesManagement',
    title: 'CourseDetails',
    name: 'courseDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Courses/CourseDetails')),
  },
  {
    path: '/categories',
    // permission: 'CategoriesManagement',
    title: 'Categories',
    name: 'category',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Categories')),
  },

  {
    // permission: 'RestaurantsManagement',
    title: 'Restaurants',
    name: 'restaurant-menu',
    icon: ShopOutlined,
    showInMenu: true
  },
  {
    path: '/restaurants',
    title: 'Restaurants',
    // permission: 'RestaurantsManagement',
    name: 'restaurant',
    baseMenuItem: 'restaurant-menu',
    icon: ShopOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Restaurants')),
  },
  {
    path: "/restaurant/:id",
    // permission: 'RestaurantsManagement',
    title: 'RestaurantDetails',
    name: 'restaurantDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Restaurants/RestaurantDetails')),
  },
  {
    path: '/restaurants-managers',
    title: 'RestaurantManagers',
    // permission: 'RestaurantsManagement',
    name: 'restaurantsManager',
    baseMenuItem: 'restaurant-menu',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/RestaurantManagers')),
  },
  {
    path: '/restaurants-dishes',
    title: 'Dishes1',
    // permission: 'DishesManagement',
    name: 'dishes',
    baseMenuItem: 'restaurant-menu',
    icon: CoffeeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dishes')),
  },
  {
    path: "/dish/:id",
    // permission: 'DishesManagement',
    title: 'DishDetails',
    name: 'dishDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Dishes/DishDetails')),
  },

  {
    path: '/restaurants-orders',
    title: 'Orders1',
    // permission: 'RestaurantsManagement',
    name: 'restaurantsOrders',
    baseMenuItem: 'restaurant-menu',
    icon: ShoppingCartOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/RestaurantsOrders')),
  },
  {
    path: "/order/:id",
    permission: 'DishesManagement',
    title: 'OrderDetails',
    name: 'orderDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/RestaurantsOrders/OrderDetails')),
  },


  {
    permission: 'ShopsManagement',
    title: 'Shops',
    name: 'shop-menu',
    icon: ShopOutlined,
    showInMenu: true
  },
  {
    path: '/shops',
    title: 'Shops',
    permission: 'RestaurantsManagement',
    name: 'shop',
    baseMenuItem: 'shop-menu',
    icon: ShopOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Shops')),
  },
  {
    path: "/shop/:id",
    // permission: '',
    title: 'ShopDetails',
    name: 'shopDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Shops/ShopDetails')),
  },
  {
    path: '/shops-managers',
    title: 'ShopManagers',
    permission: 'ShopsManagement',
    name: 'shopsManager',
    baseMenuItem: 'shop-menu',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ShopManagers')),
  },
  {
    path: '/products',
    title: 'Products1',
    permission: 'RestaurantsManagement',
    name: 'products',
    baseMenuItem: 'shop-menu',
    icon: ShoppingOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Products')),
  },
  {
    path: "/product/:id",
    // permission: '',
    title: 'ProductDetails',
    name: 'productDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Products/ProductDetails')),
  },
  {
    path: '/shops-orders',
    title: 'Orders1',
    permission: 'ShopsManagement',
    name: 'shopsOrders',
    baseMenuItem: 'shop-menu',
    icon: ShoppingCartOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ShopsOrders')),
  },
  {
    path: '/subscriptions',
    // permission: 'SubscriptionsManagement',
    title: 'Subscriptions',
    name: 'subscription',
    icon: BellOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Subscriptions')),
  },
  {
    path: "/subscription/:id",
    // permission: 'SubscriptionsManagement',
    title: 'SubscriptionDetails',
    name: 'subscriptionDetails',
    icon: "",
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Subscriptions/SubscriptionDetails')),
  },
  {
    path: '/payments',
    permission: 'AdminsManagement',
    title: 'Payments',
    name: 'payment',
    icon: DollarOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Payments')),
  },
  {
    path: '/stories',
    title: 'Stories',
    // permission: 'StoriesManagement',
    name: 'Stories',
    icon: BookOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Stories')),
  },
  {
    path: '/locations',
    // permission: 'LocationsManagement',
    title: 'Locations',
    name: 'location',
    icon: EnvironmentOutlined,
    showInMenu: true,
  },
  {
    path: '/countries',
    title: 'Countries',
    // permission: 'LocationsManagement',
    name: 'country',
    baseMenuItem: 'location',
    icon: EnvironmentOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Countries')),
  },
  {
    path: '/cities',
    title: 'Cities',
    // permission: 'LocationsManagement',
    name: 'city',
    baseMenuItem: 'location',
    icon: EnvironmentOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Cities')),
  },

  {
    path: '/admins',
    // permission: 'AdminsManagement',
    title: 'Admins',
    name: 'admin',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Admins')),
  },
  {
    path: '/logout',
    title: 'Logout',
    name: 'logout',
    showInMenu: false,
    component: LoadableComponent(() => import('../../components/Logout')),
  },
  {
    path: '/exception?:type',
    // permission: '',
    title: 'exception',
    name: 'exception',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Exception')),
  },
];

export const routers = [...userRouter, ...appRouters];
