import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../widgets/sidebar/app_sidebar.dart';
import '../../config/navigation_items.dart';
import '../../widgets/layout/app_scaffold.dart';
import '../../services/auth_service.dart';
import 'woo_orders_screen.dart';
import 'create_order_screen.dart';

class AdminDashboard extends StatefulWidget {
  final String? initialRoute;
  
  const AdminDashboard({
    Key? key, 
    this.initialRoute,
  }) : super(key: key);

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  late String _currentRoute;

  @override
  void initState() {
    super.initState();
    _currentRoute = widget.initialRoute ?? '/admin';
  }

  Widget _buildCurrentView() {
    switch (_currentRoute) {
      case '/admin/woo-orders':
        return const WooOrdersScreen();
      case '/admin/create-order':
        return const CreateOrderScreen();
      case '/admin/users':
        return const Center(child: Text('Users Management'));
      case '/admin/content':
        return const Center(child: Text('Content Management'));
      case '/admin/analytics':
        return const Center(child: Text('Analytics Dashboard'));
      case '/admin/settings':
        return const Center(child: Text('Settings'));
      case '/admin/help':
        return const Center(child: Text('Help & Support'));
      default:
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.deepPurple.withOpacity(0.05),
                Colors.pink.withOpacity(0.05),
              ],
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Welcome, Admin!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildDashboardGrid(),
                ],
              ),
            ),
          ),
        );
    }
  }

  Future<void> _handleSignOut(BuildContext context) async {
    try {
      await AuthService.signOut();
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error signing out: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    
    return AppScaffold(
      mainItems: NavigationConfig.adminMainItems,
      supportItems: NavigationConfig.adminSupportItems,
      currentPath: _currentRoute,
      userEmail: user?.email ?? '',
      onLogout: () => _handleSignOut(context),
      onNavigate: (route) {
        setState(() => _currentRoute = route);
      },
      body: _buildCurrentView(),
    );
  }

  Widget _buildDashboardGrid() {
    return GridView.count(
      shrinkWrap: true,
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      children: [
        _buildDashboardCard(
          'WooCommerce Orders',
          Icons.shopping_cart,
          Colors.blue,
          () => setState(() => _currentRoute = '/admin/woo-orders'),
        ),
        _buildDashboardCard(
          'Users',
          Icons.people,
          Colors.green,
          () => setState(() => _currentRoute = '/admin/users'),
        ),
        _buildDashboardCard(
          'Analytics',
          Icons.analytics,
          Colors.orange,
          () => setState(() => _currentRoute = '/admin/analytics'),
        ),
        _buildDashboardCard(
          'Settings',
          Icons.settings,
          Colors.purple,
          () => setState(() => _currentRoute = '/admin/settings'),
        ),
        _buildDashboardCard(
          'Create Order',
          Icons.add_shopping_cart,
          Colors.green,
          () => setState(() => _currentRoute = '/admin/create-order'),
        ),
      ],
    );
  }

  Widget _buildDashboardCard(
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.7),
                color,
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: Colors.white,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
} 