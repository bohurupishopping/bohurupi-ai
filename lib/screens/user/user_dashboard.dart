import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../widgets/layout/app_scaffold.dart';
import '../../config/navigation_items.dart';
import '../../services/auth_service.dart';

class UserDashboard extends StatefulWidget {
  final String? initialRoute;
  
  const UserDashboard({
    Key? key, 
    this.initialRoute,
  }) : super(key: key);

  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  late String _currentRoute;

  @override
  void initState() {
    super.initState();
    _currentRoute = widget.initialRoute ?? '/user';
  }

  Widget _buildCurrentView() {
    switch (_currentRoute) {
      case '/user/orders':
        return const Center(child: Text('My Orders'));
      case '/user/notifications':
        return const Center(child: Text('Notifications'));
      case '/user/profile':
        return const Center(child: Text('Profile'));
      case '/user/help':
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
                    'Welcome!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildUserContent(),
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
      mainItems: NavigationConfig.userMainItems,
      supportItems: NavigationConfig.userSupportItems,
      currentPath: _currentRoute,
      userEmail: user?.email ?? '',
      onLogout: () => _handleSignOut(context),
      onNavigate: (route) {
        setState(() => _currentRoute = route);
      },
      body: _buildCurrentView(),
    );
  }

  Widget _buildUserContent() {
    return Column(
      children: [
        _buildActionCard(
          'My Profile',
          Icons.person,
          Colors.blue,
          () => setState(() => _currentRoute = '/user/profile'),
        ),
        const SizedBox(height: 16),
        _buildActionCard(
          'My Orders',
          Icons.shopping_bag,
          Colors.green,
          () => setState(() => _currentRoute = '/user/orders'),
        ),
        const SizedBox(height: 16),
        _buildActionCard(
          'Notifications',
          Icons.notifications,
          Colors.orange,
          () => setState(() => _currentRoute = '/user/notifications'),
        ),
      ],
    );
  }

  Widget _buildActionCard(
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
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                color.withOpacity(0.7),
                color,
              ],
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                size: 32,
                color: Colors.white,
              ),
              const SizedBox(width: 16),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              const Icon(
                Icons.arrow_forward_ios,
                color: Colors.white,
              ),
            ],
          ),
        ),
      ),
    );
  }
} 