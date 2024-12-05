import 'package:flutter/material.dart';
import '../widgets/sidebar/app_sidebar.dart';

class NavigationConfig {
  static List<NavItem> adminMainItems = [
    NavItem(
      title: 'Dashboard',
      icon: Icons.dashboard,
      route: '/admin',
    ),
    NavItem(
      title: 'WooCommerce Orders',
      icon: Icons.shopping_cart,
      route: '/admin/woo-orders',
    ),
    NavItem(
      title: 'Create Order',
      icon: Icons.add_shopping_cart,
      route: '/admin/create-order',
    ),
    NavItem(
      title: 'Users',
      icon: Icons.people,
      route: '/admin/users',
    ),
    NavItem(
      title: 'Content',
      icon: Icons.article,
      route: '/admin/content',
    ),
    NavItem(
      title: 'Analytics',
      icon: Icons.analytics,
      route: '/admin/analytics',
    ),
  ];

  static List<NavItem> adminSupportItems = [
    NavItem(
      title: 'Settings',
      icon: Icons.settings,
      route: '/admin/settings',
    ),
    NavItem(
      title: 'Help',
      icon: Icons.help,
      route: '/admin/help',
    ),
  ];

  static List<NavItem> userMainItems = [
    NavItem(
      title: 'Home',
      icon: Icons.home,
      route: '/user',
    ),
    NavItem(
      title: 'My Orders',
      icon: Icons.shopping_bag,
      route: '/user/orders',
    ),
    NavItem(
      title: 'Notifications',
      icon: Icons.notifications,
      route: '/user/notifications',
    ),
  ];

  static List<NavItem> userSupportItems = [
    NavItem(
      title: 'Profile',
      icon: Icons.person,
      route: '/user/profile',
    ),
    NavItem(
      title: 'Help',
      icon: Icons.help,
      route: '/user/help',
    ),
  ];
} 